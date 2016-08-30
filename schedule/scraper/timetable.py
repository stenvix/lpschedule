# -*- coding: utf-8 -*-
import datetime

from sqlalchemy import and_
from grab.spider import Spider, Task
from schedule.models import Institute, Group, Teacher, Lesson, Time
from celery.utils.log import get_task_logger

WEEKDAYS = {
    u'Пн': '1',
    u'Вт': '2',
    u'Ср': '3',
    u'Чт': '4',
    u'Пт': '5',
    u'Сб': '6',
    u'Нд': '7',
}

logger = get_task_logger(__name__)


class ScheduleParser(Spider):
    """ Site scraper for checking changes in base site. """
    # New site http://www.lp.edu.ua/rozklad-dlya-studentiv
    # BASE = 'http://old.lp.edu.ua/node/40'
    BASE = 'http://www.lp.edu.ua/rozklad-dlya-studentiv'
    initial_urls = [BASE]

    def prepare(self):
        super(ScheduleParser, self).prepare()

    def shutdown(self):
        super(ScheduleParser, self).shutdown()

    @classmethod
    def save_inst(self, inst_name):
        if Institute.get_by_attr(inst_name):
            return
        else:
            Institute.add(Institute(institute_abbr=inst_name))

    @classmethod
    def save_group(self, group_full_name, group_url, institute):
        if Group.get_by_full_name(group_full_name):
            return
        else:
            Group.add(Group(group_full_name=group_full_name, group_url=group_url, institute=institute))

    @classmethod
    def save_lesson(self, schedule, task):
        ids = []
        for day_key, day in schedule.iteritems():
            for lesson_key, lesson in day.iteritems():
                for week_key, week in lesson.iteritems():
                    for subgroup in week:
                        if len(subgroup) > 0:
                            teacher = self.save_teacher(subgroup['teacher'])
                            lesson_id = self.save_or_update_lesson(
                                lesson_name=subgroup['name'],
                                lesson_number=lesson_key,
                                lesson_week=week_key if len(lesson) > 1 else -1,
                                day_number=day_key,
                                lesson_type=subgroup['room'].split(',')[1].strip(),
                                subgroup=subgroup['subgroup'],
                                room=subgroup['room'].split(',')[0],
                                day_name=u's',
                                semester_part=task.semester,
                                group=task.group_name,
                                teacher=teacher)
                            ids.append(lesson_id)
                        else:
                            teacher = None

        result = Lesson.query.filter(
            and_(~Lesson.lesson_id.in_(ids),
                 Lesson.group_id == Group.get_by_full_name(task.group_name).group_id)).all()
        for item in result:
            Lesson.deactivate(item)

    @classmethod
    def save_teacher(self, teacher_name):
        teacher = Teacher.get_by_name(teacher_name)
        if teacher:
            return teacher
        else:
            return Teacher.add(Teacher(teacher_name=teacher_name))

    @classmethod
    def save_or_update_lesson(self, **kwargs):
        lesson_number = kwargs.get('lesson_number')
        lesson_week = kwargs.get('lesson_week')
        day_number = kwargs.get('day_number')
        subgroup = kwargs.get('subgroup')
        group = kwargs.get('group')

        lesson_name = kwargs.get('lesson_name')
        day_name = kwargs.get('day_name')
        lesson_type = kwargs.get('lesson_type')
        semester_part = kwargs.get('semester_part')
        room = kwargs.get('room')
        teacher = kwargs.get('teacher')

        if lesson_number is None and lesson_week is None and day_number is None and subgroup is None and group is None:
            return
        lesson = Lesson.get_by_attrs(lesson_number=lesson_number, lesson_week=lesson_week, day_number=day_number,
                                     subgroup=subgroup, group=group)

        if lesson:
            Lesson.update(lesson, lesson_name=lesson_name,
                          lesson_type=lesson_type,
                          semester_part=semester_part,
                          room=room, teacher=teacher,
                          day_name=day_name, active=True)
        else:
            time = Time.get_by_number(lesson_number)
            lesson = Lesson(lesson_name=lesson_name, lesson_number=lesson_number,
                            lesson_week=lesson_week, day_number=day_number,
                            lesson_type=lesson_type, subgroup=subgroup, room=room,
                            day_name=day_name, semester_part=semester_part,
                            group=Group.get_by_full_name(group), time=time)
            lesson.teachers.append(teacher)
            Lesson.add(lesson)
        return lesson.lesson_id

    @classmethod
    def parseSubjectTable(self, html):
        subjects = {}
        for week, tr in enumerate(html.select('./table/tr')):
            one_subject = []
            lesson = tr.select('./td')
            for subgroupid, subgroup in enumerate(lesson):
                subject = None
                div = subgroup.select('./div')
                if div.count() == 0:
                    one_subject.append({})
                else:
                    name = div.select('./b').text()
                    teacher = div.select('./i').text()
                    room = div.select('./br/following-sibling::text()')
                    if len(room) > 1:
                        room = room[1].text()
                    else:
                        room = room[0].text()

                    subject = {'name': name, 'teacher': teacher, 'room': room}
                    if lesson.count() > 1:
                        subject['subgroup'] = subgroupid
                    else:
                        subject['subgroup'] = -1
                    one_subject.append(subject)
            subjects['{}'.format(week)] = one_subject
        return subjects

    @classmethod
    def task_initial(self, grab, task):
        for inst in grab.doc.select('//select[@name="inst"]/option'):
            if not inst.text():
                continue
            inst_name, inst_attr = inst.text(), inst.attr('value')
            self.save_inst(inst_name)
            semesters = grab.doc.select('//select[@name="semestr"]/option/@value')
            semester_part = grab.doc.select('//select[@name="semest_part"]/option[@selected]/@value')
            if (len(semesters) > 0 and len(semester_part) > 0):
                semester = self.get_semester(semesters)
                for part in semester_part:
                    yield Task('institute',
                               inst_name=inst_name,
                               inst_attr=inst_attr,
                               semester=semester,
                               semester_part=part.text(),
                               url='{}?inst={}&group=&semestr={}&semest_part={}'.format(
                                   ScheduleParser.BASE,
                                   inst_attr,
                                   semester,
                                   part.text()))

    @classmethod
    def task_institute(self, grab, task):
        print(u'Fetching institute {}'.format(task.inst_name))
        for group in grab.doc.select('//select[@name="group"]/option'):
            if not group.text():
                continue
            group_name, group_attr = group.text(), group.attr('value')
            self.save_group(group_name, task.url, Institute.get_by_attr(task.inst_name))
            yield Task('parse',
                       inst_name=task.inst_name,
                       inst_attr=task.inst_attr,
                       group_name=group_name,
                       group_attr=group_attr,
                       semester=task.semester,
                       semester_part=task.semester_part,
                       url='{}?inst={}&group={}&semestr={}&semest_part={}'.format(
                           ScheduleParser.BASE,
                           task.inst_attr,
                           group_attr,
                           task.semester,
                           task.semester_part))

    @classmethod
    def task_parse(self, grab, task):
        logger.info(
            u'Parse semester {}, institute {}, group {} url {}'.format(task.semester, task.inst_name, task.group_name,
                                                                       task.url))
        schedule = {}
        for tr in grab.doc.select('//div[@id="stud"]/table/tr'):

            if tr.select('./td').count() == 0:
                continue
            if tr.select('./td').count() == 1:
                dayweek = WEEKDAYS[tr.select('./td')[0].text()]
                continue
            if tr.select('./td').count() == 2:
                number = tr.select('./td')[0].text()
                html = tr.select('./td')[1]
            if tr.select('./td').count() == 3:
                dayweek = WEEKDAYS[tr.select('./td')[0].text()]
                number = tr.select('./td')[1].text()
                html = tr.select('./td')[2]

            schedule[dayweek] = schedule.get(dayweek, {})
            schedule[dayweek][number] = self.parseSubjectTable(html)
        if schedule:
            self.save_lesson(schedule, task)
        else:
            logger.info('Schedule is empty')

    @classmethod
    def get_semester(cls, semesters):
        d = datetime.date.today()
        if d.month >= 8 or d.month <= 12:
            return semesters[0].text()
        else:
            return semesters[1].text()

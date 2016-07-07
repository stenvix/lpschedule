# -*- coding: utf-8 -*-
import logging
from grab.spider import Spider, Task
from schedule.models import Institute, Group, Teacher, Lesson, Time


WEEKDAYS = {
    u"Пн": "1",
    u"Вт": "2",
    u"Ср": "3",
    u"Чт": "4",
    u"Пт": "5",
    u"Сб": "6",
    u"Нд": "7",
}


def parseSubjectTable(html):
    subjects = {}
    for week, tr in enumerate(html.select('./table/tr')):
        oneSubject = []
        for subgroupid, subgroup in enumerate(tr.select('./td')):
            div = subgroup.select('./div')
            if div.count() == 0:
                oneSubject.append({})
            else:
                name = div.select('./b').text()
                teacher = div.select('./i').text()
                room = div.select('./br/following-sibling::text()')[1].text()
                oneSubject.append({'name': name, 'teacher': teacher, 'room': room})
        subjects["{}".format(week)] = oneSubject
    return subjects


class ScheduleParser(Spider):
    """ Site scraper for checking changes in base site. """

    BASE = 'http://old.lp.edu.ua/node/40'
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
    def save_group(self, group_full_name, group_url):
        if Group.get_by_full_name(group_full_name):
            return
        else:
            Group.add(Group(group_full_name=group_full_name, group_url=group_url))

    @classmethod
    def save_lesson(self, schedule, task):
        for day_key, day in schedule.iteritems():
            for lesson_key, lesson in day.iteritems():
                for week_key, week in lesson.iteritems():
                    for index, subgroup in enumerate(week):
                        if len(subgroup) > 0:
                            teacher = self.save_teacher(subgroup['teacher'])

                            self.save_lesson_obj(subgroup['name'],
                                                 lesson_key, week_key if len(lesson) > 1 else None,
                                                 day_key, subgroup['room'].split(',')[1],
                                                 index if len(week) > 1 else None,
                                                 subgroup['room'].split(',')[0], u's',
                                                 task.semestr,
                                                 Group.get_by_full_name(task.group_name), teacher)


    @classmethod
    def save_teacher(self,teacher_name):
        teacher = Teacher.get_by_name(teacher_name)
        if teacher:
            return teacher
        else:
            return Teacher.add(Teacher(teacher_name=teacher_name))

    @classmethod
    def save_lesson_obj(self, lesson_name, lesson_number, lesson_week, day_number, lesson_type, subgroup, room,
                        day_name, semester, Group, teacher):
        if Lesson.get_by_attrs(lesson_name, lesson_number, lesson_week, day_number):
            return
        else:
            time = Time.get_by_number(lesson_number)
            lesson = Lesson(lesson_name=lesson_name, lesson_number=lesson_number, lesson_week=lesson_week,
                              day_number=day_number, lesson_type=lesson_type, subgroup=subgroup, room=room,
                              day_name=day_name, semester_part = semester, group=Group, time = time )
            lesson.teachers.append(teacher)
            Lesson.add(lesson)

    @classmethod
    def task_initial(self, grab, task):
        for inst in grab.doc.select('//select[@name="inst"]/option'):
            if not inst.text(): continue
            inst_name, inst_attr = inst.text(), inst.attr('value')
            self.save_inst(inst_name)
            yield Task('institute', inst_name=inst_name, inst_attr=inst_attr,
                       url="{}?inst={}&group=&semestr=1&semest_part=1".format(ScheduleParser.BASE, inst_attr))

    @classmethod
    def task_institute(self, grab, task):
        logging.debug(u'Fetching institute {}'.format(task.inst_name))
        for group in grab.doc.select('//select[@name="group"]/option'):
            if not group.text(): continue
            group_name, group_attr = group.text(), group.attr('value')
            yield Task('group', inst_name=task.inst_name, inst_attr=task.inst_attr, group_name=group_name,
                       group_attr=group_attr,
                       url='{}?inst={}&group={}&semestr=1&semest_part=1'.format(ScheduleParser.BASE, task.inst_attr,
                                                                                group_attr))

    @classmethod
    def task_group(self, grab, task):
        logging.debug(u'{} in {}'.format(task.group_name, task.inst_name))
        self.save_group(task.group_name, task.url)
        semestr = grab.doc.select('//select[@name="semestr"]/option[@selected]/@value')
        semestr_part = grab.doc.select('//select[@name="semest_part"]/option[@selected]/@value')
        if (len(semestr) > 0 and len(semestr_part) > 0):
            for sem in semestr:
                for part in semestr_part:
                    yield Task('parse', inst_name=task.inst_name,
                        inst_attr=task.inst_attr, group_name=task.group_name, group_attr=task.group_attr,
                        semestr=sem.text(), semestr_part=part.text(),
                        url='{}?inst={}&group={}&semestr={}&semest_part={}'.format(ScheduleParser.BASE, task.inst_attr,
                                                                                  task.group_attr, sem.text(),
                                                                                  part.text()))

    @classmethod
    def task_parse(self, grab, task):
        logging.info(
            u'Parse semester {}, institute {}, group {} url {}'.format(task.semestr, task.inst_name, task.group_name,
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
            schedule[dayweek][number] = parseSubjectTable(html)
        if schedule:
            self.save_lesson(schedule, task)
        else:
            logging.info("Schedule is empty")


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    bot = ScheduleParser(thread_number=2)
    bot.run()

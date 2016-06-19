# -*- coding: utf-8 -*-
import logging
import codecs
import json
from grab.spider import Spider, Task
from selection import XpathSelector as Selector

WEEKDAYS = {
            u"Пн": "day1",
            u"Вт": "day2",
            u"Ср": "day3",
            u"Чт": "day4",
            u"Пт": "day5",
            u"Сб": "day6",
            u"Нд": "day7",
           }
def parseSubjectTable(html):
    subjects = {}
    for week,tr in enumerate(html.select('./table/tr')):
        oneSubject = []
        for subgroupid, subgroup in enumerate(tr.select('./td')):
            div = subgroup.select('./div')
            if div.count() == 0:
                oneSubject.append({})
            else:
                name = div.select('./b').text()
                teacher = div.select('./i').text()
                room = div.select('./br/following-sibling::text()')[1].text()
                oneSubject.append({'name': name, 'teacher':teacher, 'room':room})
        subjects["week{}".format(week)] = oneSubject
    return subjects

class ScheduleParser(Spider):
    """ Site scraper for checking changes in base site. """


    BASE ='http://lp.edu.ua/node/40'
    initial_urls=[BASE]

    def prepare(self):
        super(ScheduleParser, self).prepare()
    def shutdown(self):
        super(ScheduleParser, self).shutdown()

    @classmethod
    def task_initial(self, grab, task):
        for inst in grab.doc.select('//select[@name="inst"]/option'):
            if not inst.text():continue
            inst_name,inst_attr = inst.text(), inst.attr('value')
            yield Task('institute',inst_name=inst_name,inst_attr=inst_attr,
                    url="{}?inst={}&group=&semestr=1&semest_part=1".format(ScheduleParser.BASE,inst_attr))

    @classmethod
    def task_institute(self, grab, task):
        logging.info('Fetching institute {}'.format(task.inst_name.encode('utf-8')))
        for group in grab.doc.select('//select[@name="group"]/option'):
            if not group.text(): continue
            group_name,group_attr = group.text(), group.attr('value')
            yield Task('group',inst_name=task.inst_name,inst_attr=task.inst_attr, group_name=group_name,group_attr = group_attr,
                    url='{}?inst={}&group={}&semestr=1&semest_part=1'.format(ScheduleParser.BASE,task.inst_attr,group_attr))

    @classmethod
    def task_group(self, grab, task):
        logging.info('{} in {}'.format(task.group_name.encode('utf-8'),task.inst_name.encode('utf-8')))
        semestr = grab.doc.select('//select[@name="semestr"]/option[@selected]/@value')
        semestr_part = grab.doc.select('//select[@name="semest_part"]/option[@selected]/@value')
        if(len(semestr)>0 and len(semestr_part)>0):
            for sem in semestr:
                for part in semestr_part:
                    yield Task('parse', inst_name=task.inst_name,
                            inst_attr=task.inst_attr, group_name=task.group_name,group_attr = task.group_attr,semestr=sem.text(),semestr_part = part.text(),
                            url='{}?inst={}&group={}&semestr={}&semest_part={}'.format(ScheduleParser.BASE,
                                task.inst_attr,task.group_attr,sem.text(),part.text()))

    @classmethod
    def task_parse(self,grab,task):
        logging.info(u'Parse semestr {}, institute {}, group {} url {}'.format(task.semestr,task.inst_name,task.group_name,task.url))
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
            with codecs.open(u"out/{}-{}-{}-{}.json".format(task.inst_name, task.group_name, task.semestr, task.semestr_part), "w", encoding='utf-8') as out:
                json.dump(schedule, out, ensure_ascii=False, indent=2, sort_keys=True)
            print "Success"
        else:
            print "Schedule is empty"

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    bot = ScheduleParser(thread_number=2)
    bot.run()

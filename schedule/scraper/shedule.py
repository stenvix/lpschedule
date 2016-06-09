# -*- coding: utf-8 -*-
import logging

from grab.spider import Spider, Task
class ScheduleParser(Spider):
    BASE ='http://lp.edu.ua/node/40'
    initial_urls=[BASE]

    def prepare(self):
        super(ScheduleParser, self).prepare()
    def shutdown(self):
        super(ScheduleParser, self).shutdown()

    def task_initial(self, grab, task):
        for inst in grab.doc.select('//select[@name="inst"]/option'):
            if not inst.text():continue
            inst_name,inst_attr = inst.text(), inst.attr('value')
            yield Task('institute',inst_name=inst_name,inst_attr=inst_attr,
                    url="{}?inst={}&group=&semestr=1&semest_part=1".format(ScheduleParser.BASE,inst_attr))
    def task_institute(self, grab, task):
        logging.info('Fetching institute {}'.format(task.inst_name.encode('utf-8')))
        for group in grab.doc.select('//select[@name="group"]/option'):
            if not group.text(): continue
            group_name,group_attr = group.text(), group.attr('value')
            yield Task('group',inst_name=task.inst_name,inst_attr=task.inst_attr, group_name=group_name,group_attr = group_attr,
                    url='{}?inst={}&group={}&semestr=1&semest_part=1'.format(ScheduleParser.BASE,task.inst_attr,group_attr))

    def task_group(self, grab, task):
        logging.info('{} in {}'.format(task.group_name.encode('utf-8'),task.inst_name.encode('utf-8')))
        semestr = grab.doc.select('//select[@name="semestr"]/option[@selected]/@value')
        semest_part = grab.doc.select('//select[@name="semest_part"]/option[@selected]/@value')
        if(len(semestr)>0 and len(semest_part)>0):
            for sem in semestr:
                for part in semest_part:
                    yield Task('parse', inst_name=task.inst_name,
                            inst_attr=task.inst_attr, group_name=task.group_name,group_attr = task.group_attr,
                            url='{}?inst={}&group={}&semestr={}&semest:st_part={}'.format(ScheduleParser.BASE,
                                task.inst_attr,task.group_attr,semestr,semest_part))

    def task_parse(self,grab,task):
        logging.info('YES')
if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    bot = ScheduleParser(thread_number=2)
    bot.run()

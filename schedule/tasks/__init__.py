import multiprocessing
from schedule import celery
from schedule.scraper import TimeParser, ScheduleParser

@celery.task(name="schedule.parse")
def parse():
    time_parser = TimeParser(thread_number=multiprocessing.cpu_count())
    time_parser.run()
    parser = ScheduleParser(thread_number=multiprocessing.cpu_count())
    parser.run()
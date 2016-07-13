import multiprocessing
from schedule import celery

@celery.task
def parse():
    from schedule.scraper import TimeParser, ScheduleParser
    time_parser = TimeParser(thread_number=multiprocessing.cpu_count())
    time_parser.run()
    parser = ScheduleParser(thread_number=multiprocessing.cpu_count())
    parser.run()
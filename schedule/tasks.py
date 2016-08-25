import multiprocessing
from .factory import create_celery_app
from .scraper import TimeParser, ScheduleParser

celery = create_celery_app()


@celery.task(name='schedule.parse')
def parse():
    time_parser = TimeParser(thread_number=multiprocessing.cpu_count())
    time_parser.run()
    parser = ScheduleParser(thread_number=multiprocessing.cpu_count())
    parser.run()

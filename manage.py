# -*- coding: utf-8 -*-
"""Flask Script configuration."""
import logging
import multiprocessing
from flask_script import Server
from flask_migrate import MigrateCommand
from schedule import app, db, manager, celery
from schedule.scraper import ScheduleParser, TimeParser


@manager.option('-h', '--host', dest='host', default='0.0.0.0')
@manager.option('-p', '--port', dest='port', type=int, default=5000)
@manager.option('-w', '--workers', dest='workers', type=int, default=4)
def gunicorn(host, port, workers):
    """Start the Server with Gunicorn."""
    from gunicorn.app.base import Application

    class FlaskApplication(Application):

        @classmethod
        def init(self, parser, opts, args):
            return {
                'bind': '{0}:{1}'.format(host, port),
                'workers': workers
                }

        @classmethod
        def load(self):
            return app
    application = FlaskApplication()
    return application.run()

server = Server(host="0.0.0.0", port=5000)

manager.add_command("runserver", server)
manager.add_command('db', MigrateCommand)
@manager.command
def initdb():
    db.create_all()

@celery.task
def parse():
    time_parser = TimeParser(thread_number=multiprocessing.cpu_count())
    time_parser.run()
    parser = ScheduleParser(thread_number=multiprocessing.cpu_count())
    parser.run()


class WorkerProcess(multiprocessing.Process):
    def __init__(self):
        super(WorkerProcess,self).__init__(name='celery_worker_process')

    def run(self):
        argv = [
            'worker',
            '--loglevel=INFO',
            '--hostname=local',
            '-Ofair',
            '-B'
        ]

        celery.worker_main(argv)

def start_celery():
    global worker_process# 'spawn' seems to work also
    worker_process = WorkerProcess()
    worker_process.start()

def stop_celery():
    global worker_process
    if worker_process:
        worker_process.terminate()
        worker_process = None

@app.before_first_request
def before_first_request():
    start_celery()

if __name__ == '__main__':
    manager.run()



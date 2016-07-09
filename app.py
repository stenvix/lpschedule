# -*- coding: utf-8 -*-
"""Flask Script configuration."""
import os
import sys
import multiprocessing
import atexit
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
@manager.command
def runserver():
    start_celery()
    app.run()

manager.add_command('db', MigrateCommand)
@manager.command
def initdb():
    db.create_all()
@manager.command
def dropdb():
    db.drop_all(bind=None)

@celery.task
def parse():
    dropdb()
    initdb()
    time_parser = TimeParser(thread_number=multiprocessing.cpu_count())
    time_parser.run()
    parser = ScheduleParser(thread_number=multiprocessing.cpu_count())
    parser.run()


class WorkerProcess(multiprocessing.Process):
    def __init__(self):
        super(WorkerProcess,self).__init__(name='celery_worker_process')
        # Thread.__init__(self)

    def run(self):
        argv = [
            'worker',
            '--loglevel=INFO',
            '--hostname=local',
            '-Ofair',
            '-B'
        ]

        celery.worker_main(argv)

app.worker_process = None

def start_celery():
    if app.worker_process is None:
        app.worker_process = WorkerProcess()
        app.worker_process.daemon = True
        app.worker_process.start()

def stop_celery():
    if app.worker_process:
        app.worker_process.terminate()
        app.worker_process = None

atexit.register(stop_celery)


@manager.command
def server():
    try:
        virtenv = os.path. \
            join(os.environ.get('OPENSHIFT_PYTHON_DIR', '.'), 'virtenv')
        python_version = "python" + str(sys.version_info[0]) + \
                         "." + str(sys.version_info[1])
        os.environ['PYTHON_EGG_CACHE'] = os.path.join(
            virtenv, 'lib', python_version, 'site-packages')
        virtualenv = os.path.join(virtenv, 'bin', 'activate_this.py')
        if (sys.version_info[0] < 3):
            execfile(virtualenv, dict(__file__=virtualenv))
        else:
            exec (open(virtualenv).read(), dict(__file__=virtualenv))
    except IOError:
        pass
    port = app.config['PORT']
    server_ip = app.config['IP']
    try:
        start_celery()
        gunicorn(server_ip, port, workers=2)
    except ImportError:
        pass


if __name__ == '__main__':
    server()
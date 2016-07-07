# -*- coding: utf-8 -*-
"""Flask Script configuration."""
import logging
import multiprocessing
from flask_script import Server
from flask_migrate import MigrateCommand
from schedule import app, db, manager
from schedule.scraper import ScheduleParser, TimeParser
from schedule.models import Institute, Lesson

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

@manager.command
def parse():
    logging.basicConfig(level=logging.INFO)
    initdb()
    time_parser = TimeParser(thread_number=multiprocessing.cpu_count())
    time_parser.run()
    parser = ScheduleParser(thread_number=multiprocessing.cpu_count())
    parser.run()

if __name__ == '__main__':
    manager.run()

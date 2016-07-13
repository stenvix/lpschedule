# -*- coding: utf-8 -*-
"""Flask Script configuration."""
import os
import sys
import multiprocessing
from flask_migrate import MigrateCommand
from schedule import app, db, manager
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
    app.run(host="0.0.0.0")

manager.add_command('db', MigrateCommand)
@manager.command
def initdb():
    db.create_all()
@manager.command
def dropdb():
    db.drop_all(bind=None)

@manager.command
def parse():
    dropdb()
    initdb()
    time_parser = TimeParser(thread_number=multiprocessing.cpu_count())
    time_parser.run()
    parser = ScheduleParser(thread_number=multiprocessing.cpu_count())
    parser.run()
    db.session.close()
    db.engine.dispose()

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
    if port is not None and server is not None:
        gunicorn(server_ip, port, workers=1)

if __name__ == '__main__':
    manager.run(default_command='server')
from flask_script import Manager
from schedule import frontend, api
from werkzeug.wsgi import DispatcherMiddleware
from werkzeug.serving import run_simple
from schedule.core import db

manager = Manager(frontend.create_app())


@manager.command
def runserver():
    app = DispatcherMiddleware(frontend.create_app(), {'/api': api.create_app()})
    run_simple('0.0.0.0', 5000, app, use_reloader=True, use_debugger=True)


@manager.command
def initdb():
    db.create_all()


@manager.command
def dropdb():
    db.drop_all(bind=None)

if __name__ == '__main__':
    manager.run()

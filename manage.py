"""Flask Script configuration."""

from flask_script import Manager, Server
from schedule import app, db, manager
from schedule.models import model
from flask_migrate import MigrateCommand

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
    db.session.add(model.Teacher())
    db.session.add(model.Group())
    db.session.add(model.Lesson(teacher_id="1"))

if __name__ == '__main__':
    manager.run()

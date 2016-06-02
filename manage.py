from flask.ext.script import Manager, prompt_bool, Command, Option, Server
from schedule import app

manager = Manager(app)

@manager.option('-h', '--host', dest='host', default='0.0.0.0')
@manager.option('-p', '--port', dest='port', type=int, default=6969)
@manager.option('-w', '--workers', dest='workers', type=int, default=4)
def gunicorn(host, port, workers):
    """Start the Server with Gunicorn"""
    from gunicorn.app.base import Application
    class FlaskApplication(Application):
        def init(self, parser, opts, args):
            return {
                'bind': '{0}:{1}'.format(host, port),
                'workers': workers
                }
        def load(self):
            return app
    application = FlaskApplication()
    return application.run()


server = Server(host="0.0.0.0",port = 5000)

manager.add_command("runserver", server)

if __name__ == '__main__':
    manager.run()

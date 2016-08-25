# -*- coding: utf-8 -*-
"""Flask Script configuration."""
from werkzeug.wsgi import DispatcherMiddleware
from schedule import frontend, api


def gunicorn(app, host, port, workers):
    """Start the Server with Gunicorn."""
    from gunicorn.app.base import Application

    class FlaskApplication(Application):
        @classmethod
        def init(cls, parser, opts, args):
            return {
                'bind': '{0}:{1}'.format(host, port),
                'workers': workers
            }

        @classmethod
        def load(cls):
            return app
    application = FlaskApplication(app)
    return application.run()

if __name__ == '__main__':
    app = DispatcherMiddleware(frontend.create_app(), {
        '/api': api.create_app()
    })
    gunicorn(app, '0.0.0.0', '5000', 2)

# -*- coding: utf-8 -*-
"""Flask Script configuration."""
import os
import sys

from werkzeug.wsgi import DispatcherMiddleware
from schedule import frontend, api


# def gunicorn(app, host, port, workers):
#     """Start the Server with Gunicorn."""
#     from gunicorn.app.base import Application

#     class FlaskApplication(Application):
#         @classmethod
#         def init(cls, parser, opts, args):
#             return {
#                 'bind': '{0}:{1}'.format(host, port),
#                 'workers': workers
#             }

#         @classmethod
#         def load(cls):
#             return app
#     application = FlaskApplication(app)
#     return application.run()


# def server(app):
#     try:
#         virtenv = os.path. \
#             join(os.environ.get('OPENSHIFT_PYTHON_DIR', '.'), 'virtenv')
#         python_version = 'python' + str(sys.version_info[0]) + \
#                          '.' + str(sys.version_info[1])
#         os.environ['PYTHON_EGG_CACHE'] = os.path.join(
#             virtenv, 'lib', python_version, 'site-packages')
#         virtualenv = os.path.join(virtenv, 'bin', 'activate_this.py')
#         if (sys.version_info[0] < 3):
#             execfile(virtualenv, dict(__file__=virtualenv))
#         else:
#             exec(open(virtualenv).read(), dict(__file__=virtualenv))
#     except IOError:
#         pass

#     port = app.app.config['PORT']
#     server_ip = app.app.config['IP']
#     if port is not None and server is not None:
#         gunicorn(app, server_ip, port, workers=1)

if __name__ == '__main__':
    application = DispatcherMiddleware(frontend.create_app(), {
        '/api': api.create_app()
    })
    application.run();

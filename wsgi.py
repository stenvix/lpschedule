#!/usr/bin/env python
# -*- coding: UTF-8 -*-
import os
import sys

from core.app import build_application
from aiohttp import web
from aiohttp.worker import GunicornWebWorker
app = build_application(os.path.abspath('config.yaml'))

def gunicorn(app, host, port, workers):
    from gunicorn.app.base import Application

    class GunicornApplication(Application):
        @classmethod
        def init(cls, parser, opts, args):
            return {
                'bind': '{0}:{1}'.format(host, port),
                'worker_class': 'aiohttp.worker.GunicornWebWorker',
                'workers': workers
            }
        @classmethod
        def load(cls):
            return app
    application = GunicornApplication()
    return application.run()

def server():
    try:
        virtenv = os.path.join(os.environ.get('OPENSHIFT_PYTHON_DIR','.'),'virtenv')
        python_version = 'python'+str(sys.version_info[0]) + '.' + str(sys.version_info[1])
        os.environ['PYTHON_EGG_CACHE'] = os.path.join(virtenv, 'lib', python_version,
                                                      'site-packages')
        virtualenv = os.path.join(virtenv, 'bin', 'activate_this.py')
        if(sys.version_info[0] < 3):
            execfile(virtualenv, dict(__file__=virtualenv))
        else:
            exec(open(virtualenv).read(), dict(__file__=virtualenv))
    except IOError:
        pass

    port = app.config['PORT']
    server_ip = app.config['IP']
    if port is not None and server_ip is not None:
        gunicorn(app, server_ip, port, workers=1)

if(__name__ == '__main__'):
    server()

#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import os

from .core.app import build_application


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


def run(ip="localhost", port="5000"):
    app = build_application(os.path.abspath('config.yaml'))
    gunicorn(app, app.config['IP'], app.config['PORT'], workers=1)

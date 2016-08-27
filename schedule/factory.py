import os

from celery import Celery
from flask import Flask
from flask_migrate import Migrate
from .core import db
from .helpers import register_blueprints, init_logging


def create_app(package_name, package_path):
    app = Flask(package_name)
    app.config.from_object('schedule.config')
    app.config.from_pyfile('config.cfg', silent=True)
    db.init_app(app)
    init_logging(app)
    Migrate(app, db)
    register_blueprints(app, package_name, package_path)
    return app


def create_celery_app(app=None):
    app = app or create_app('schedule', os.path.dirname(__file__))
    db.app = app
    celery = Celery(app.name, broker=app.config['CELERY']['CELERY_BROKER_URL'],
                    backend=app.config['CELERY']['CELERY_RESULT_BACKEND'])
    celery.conf.update(app.config['CELERY'])
    return celery

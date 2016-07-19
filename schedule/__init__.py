# -*- coding: utf-8 -*-
"""Main app module."""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_script import Manager
from celery import Celery


app = Flask(__name__)
app.config.from_pyfile('config.cfg')
db = SQLAlchemy(app)
manager = Manager(app)
migrate = Migrate(app,db)
from schedule.api import api
app.register_blueprint(api, url_prefix='/api')
celery = Celery(app.name, broker=app.config['CELERY']['CELERY_BROKER_URL'], backend=app.config['CELERY']['CELERY_RESULT_BACKEND'])
celery.conf.update(app.config['CELERY'])

import schedule.routes
import schedule.tasks

# -*- coding: utf-8 -*-
"""Main app module."""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_script import Manager
from celery import Celery
import multiprocessing

app = Flask(__name__)
app.config.from_pyfile('config.cfg')
db = SQLAlchemy(app)
manager = Manager(app)
migrate = Migrate(app,db)
celery = Celery(app.name, broker=app.config['CELERY']['CELERY_BROKER_URL'], backend=app.config['CELERY']['CELERY_RESULT_BACKEND'])
celery.conf.update(app.config['CELERY'])

import schedule.routes

@celery.task
def parse():
    from schedule.scraper import TimeParser, ScheduleParser
    db.drop_all(bind=None)
    db.create_all()
    time_parser = TimeParser(thread_number=multiprocessing.cpu_count())
    time_parser.run()
    parser = ScheduleParser(thread_number=multiprocessing.cpu_count())
    parser.run()
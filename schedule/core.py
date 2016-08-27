import logging

from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()
logger = logging.getLogger('schedule')

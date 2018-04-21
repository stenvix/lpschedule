"""App config."""
import os

from celery.schedules import crontab

DEBUG = False
TESTING = True
SECRET_KEY = '\xf5*\x84`\xe5\xc6\x95*/Xs\x1dg\xa4\xdbph\xa9\x9f\xdf\x9d\n\xf2x'
LOGGER_NAME = 'schedule'
FLASK_LOG_DIR = os.environ.get('OPENSHIFT_LOG_DOR', os.getcwd())
PROPAGATE_EXCEPTIONS = True
SECRET_KEY = os.environ.get(
    'SECRET_KEY',
    '\xfb\x13\xdf\xa1@i\xd6>V\xc0\xbf\x8fp\x16#Z\x0b\x81\xeb\x16')
HOST_NAME = os.environ.get(
    'OPENSHIFT_APP_DNS', 'localhost')
APP_NAME = os.environ.get(
    'OPENSHIFT_APP_NAME', 'flask')
IP = os.environ.get('OPENSHIFT_PYTHON_IP', '0.0.0.0')
PORT = int(os.environ.get('OPENSHIFT_PYTHON_PORT', 80))
SQLALCHEMY_DATABASE_URI = os.environ.get(
    'DATABASE_URL', 'postgres://nnsdeofqutllyo:151bbe792f6eb4395af9cedf93971fbd4ab86a2b368c15ec53f70203f5b13634@ec2-54-247-81-88.eu-west-1.compute.amazonaws.com:5432/d7trb6uv8oke4j?client_encoding=utf8')
SQLALCHEMY_TRACK_MODIFICATIONS = False
SCRAPER_SCHEDULE_URL = 'http://old.lp.edu.ua/node/40'
SCRAPER_TIME_URL = 'http://old.lp.edu.ua/node/45'
CELERY = {
    'CELERY_BROKER_URL': 'sqla+' + os.environ.get(
        'OPENSHIFT_POSTGRESQL_DB_URL',
        'postgres://nnsdeofqutllyo:151bbe792f6eb4395af9cedf93971fbd4ab86a2b368c15ec53f70203f5b13634@ec2-54-247-81-88.eu-west-1.compute.amazonaws.com:5432/d7trb6uv8oke4j?client_encoding=utf8'),
    'CELERY_RESULT_BACKEND': 'db+' + os.environ.get(
        'OPENSHIFT_POSTGRESQL_DB_URL',
        'postgres://nnsdeofqutllyo:151bbe792f6eb4395af9cedf93971fbd4ab86a2b368c15ec53f70203f5b13634@ec2-54-247-81-88.eu-west-1.compute.amazonaws.com:5432/d7trb6uv8oke4j?client_encoding=utf8'),
    'CELERY_TIMEZONE': 'Europe/Kiev',
    'CELERY_ENABLE_UTC': True,
    'CELERYBEAT_SCHEDULE': {
        'every-day': {
            'task': 'schedule.parse',
            'schedule': crontab(minute='*/5')
        }
    }
}

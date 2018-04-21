web: gunicorn app
worker: celery worker -A schedule.tasks.celery -B -l debug -Ofair --logfile="celery.log";
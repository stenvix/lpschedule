web: gunicorn app
worker: celery multi start worker1 -A schedule.tasks.celery -B -l debug -Ofair --logfile="celery.log";
"""Application routing for main app."""
from schedule import app
from flask import render_template
from celery.schedules import crontab

@app.route('/')
def index():
    """Main view."""
    return render_template('index.html')

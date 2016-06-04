"""Application routing for main app."""
from schedule import app
from flask import render_template


@app.route('/')
def index():
    """Main view."""
    return render_template('index.html')

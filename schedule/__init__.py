# -*- coding: utf-8 -*-
"""Main app module."""
from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config.from_pyfile('config.cfg')
db = SQLAlchemy(app)

import schedule.routes

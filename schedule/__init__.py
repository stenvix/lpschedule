# -*- coding: utf-8 -*-
"""Main app module."""
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_script import Manager

app = Flask(__name__)
app.config.from_pyfile('config.cfg')
db = SQLAlchemy(app)
manager = Manager(app)
migrate = Migrate(app,db)

import schedule.routes

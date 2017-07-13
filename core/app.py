#!/usr/bin/env python
# -*- coding: UTF-8 -*-
import json
import os

from aiohttp.web import Application
from .config import Config

def build_application(config_path):
    app = Application()
    app.config = Config()
    app.config.update_from_yaml_file(config_path)
    print(json.dumps(app.config))
    return app

#!/usr/bin/env python
# -*- coding: UTF-8 -*-

import json
import logging
import logging.config

from aiohttp.web import Application
from .config import Config

_logger = logging.getLogger(__name__)


def build_application(config_path):
    init_logger()
    app = Application()
    app.config = Config()
    app.config.update_from_yaml_file(config_path)
    _logger.debug(json.dumps(app.config))
    return app


def init_logger():
    logging.config.fileConfig('logging.ini', disable_existing_loggers=False)

#!/usr/bin/env python
# -*- coding: UTF-8 -*-
from configloader import ConfigLoader

class Config(ConfigLoader):
   def __init__(self, validator=None):
        super().__init__()

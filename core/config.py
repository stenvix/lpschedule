#!/usr/bin/env python
# -*- coding: UTF-8 -*-
from configloader import ConfigLoader
from attrdict import AttrDict
class Config(ConfigLoader):
    def __init__(self, validator=None):
        super().__init__()

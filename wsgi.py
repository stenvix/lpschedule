#!/usr/bin/env python
# -*- coding: UTF-8 -*-
import os
import sys

from lpschedule import run

if(__name__ == '__main__'):
    try:
        virtenv = os.path.join(os.environ.get('OPENSHIFT_PYTHON_DIR', '.'), 'virtenv')
        python_version = 'python' + str(sys.version_info[0]) + '.' + str(sys.version_info[1])
        os.environ['PYTHON_EGG_CACHE'] = os.path.join(virtenv, 'lib', python_version,
                                                      'site-packages')
        virtualenv = os.path.join(virtenv, 'bin', 'activate_this.py')
        if(sys.version_info[0] < 3):
            execfile(virtualenv, dict(__file__=virtualenv))
        else:
            exec(open(virtualenv).read(), dict(__file__=virtualenv))
    except IOError:
        pass

    run()

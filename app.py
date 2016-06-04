#!/usr/bin/env python

"""Main app module, entry point for openshift."""

# This file may be used instead of Apache mod_wsgi to run your python
# web application in a different framework.  A few examples are
# provided (cherrypi, gevent), but this file may be altered to run
# whatever framework is desired - or a completely customized service.
#
import imp
import os
import sys

try:
    virtenv = os.path.\
        join(os.environ.get('OPENSHIFT_PYTHON_DIR', '.'), 'virtenv')
    python_version = "python"+str(sys.version_info[0]) + \
        "."+str(sys.version_info[1])
    os.environ['PYTHON_EGG_CACHE'] = os.path.join(
        virtenv, 'lib', python_version, 'site-packages')
    virtualenv = os.path.join(virtenv, 'bin', 'activate_this.py')
    if(sys.version_info[0] < 3):
        execfile(virtualenv, dict(__file__=virtualenv))
    else:
        open(virtualenv).read(), dict(__file__=virtualenv)
except IOError:
    pass

#
# IMPORTANT: Put any additional includes below this line.  If placed above this
# line, it's possible required libraries won't be in your searchable path
#

#
#  main():
#
if __name__ == '__main__':
    application = imp.load_source('app', 'manage.py')
    port = application.app.config['PORT']
    ip = application.app.config['IP']
    try:
        application.gunicorn(ip, port, workers=1)
    except ImportError:
        pass

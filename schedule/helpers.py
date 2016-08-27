import pkgutil
import importlib
import logging
import os

from flask import Blueprint


def register_blueprints(app, package_name, package_path):
    """Register all Blueprint instances on the specified Flask application found
    in all modules for the specified package.
    :param app: the Flask application
    :param package_name: the package name
    :param package_path: the package path
    """
    rv = []
    for _, name, _ in pkgutil.iter_modules(package_path):
        m = importlib.import_module('%s.%s' % (package_name, name))
        for item in dir(m):
            item = getattr(m, item)
            if isinstance(item, Blueprint):
                app.register_blueprint(item)
            rv.append(item)
    return rv


def init_logging(app):
    if app.config:
        handler = logging.FileHandler(os.path.join(app.config['FLASK_LOG_DIR'], 'flask.log'))
        formater = logging.Formatter(
            fmt='[%(asctime)s](%(pathname)s):%(levelname)s - %(message)s',
            datefmt='%d-%m-%Y %H:%M:%S')
        handler.setFormatter(formater)
        handler.setLevel(logging.WARN)
        if app.debug:
            handler.setLevel(logging.NOTSET)
        if app.config['TESTING']:
            handler.setLevel(logging.DEBUG)
            app.logger.setLevel(logging.DEBUG)
        app.logger.addHandler(handler)
    else:
        raise AttributeError('config not found')


def print_params(params):
    return ''.join(['%s-> %s' % (key, value) for (key, value) in params.items()])

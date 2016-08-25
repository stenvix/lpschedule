from .. import factory


def create_app():
    app = factory.create_app(__name__, __path__)
    return app

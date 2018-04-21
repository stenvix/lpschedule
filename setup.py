from setuptools import setup

setup(name='LpSchedule',
      version='0.1',
      description='API for Lviv Polytechnik schedule',
      author='Stepanov Valentyn',
      author_email='mr.valentyn.stepanov@gmail.com',
      url='http://example.com',
      install_requires=[
          'alembic>=0.8.4',
          'Flask>=0.10.1',
          'SQLAlchemy>=1.0.9',
          'Flask-Migrate>=1.7.0',
          'Flask-Script>=2.0.5',
          'Flask-SQLAlchemy>=2.1',
          'gunicorn>=19.4.5',
          'grab>=0.6.30',
          'psycopg2>=2.5.1',
          'markdown>=2.6.6',
          'celery==4.1.0'
      ],)

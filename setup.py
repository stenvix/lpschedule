from setuptools import setup

setup(name='LpSchedule',
      version='0.1',
      description='A API for Lviv Polytechnik schedule',
      author='Stepanov Valentyn',
      author_email='mr.valentyn.stepanov@gmail.com',
      url='http://example.com',
     install_requires=['Flask>=0.10.1',
     'Flask-Script>=2.0.5','grab>=0.6.30','gunicorn>=19.5.0',
     'itsdangerous>=0.24','Jinja2>=2.8','lxml>=3.6.0',
     'MarkupSafe>=0.23', 'pycurl>=7.43.0','pytils>=0.3',
     'selection>=0.0.11','six>=1.10.0','user-agent>=0.1.4','weblib>=0.1.20',
     'Werkzeug>=0.11.9]']
     )
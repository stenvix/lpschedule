# -*- coding: utf-8 -*-
"""frontendlication routing for main frontend."""
import datetime
import markdown
import codecs

from flask import render_template, abort, request, redirect, url_for, flash, Blueprint
from schedule.models import Group, Lesson
from ..core import logger
from ..helpers import print_params
frontend = Blueprint('frontend', __name__)


@frontend.route('/')
def index():
    """Main view."""
    logger.debug('%s', request.url)
    return render_template('index.html')


@frontend.context_processor
def utility_processor():
    def day_to_string(day_number):
        WEEKDAYS = {
            1: u'Понеділок',
            2: u'Вівторок',
            3: u'Середа',
            4: u'Четвер',
            5: u'П’ятниця',
            6: u'Субота',
            7: u'Неділя'
        }
        return u'{}'.format(WEEKDAYS[day_number])
    return dict(day_to_string=day_to_string)


@frontend.route('/search', methods=['POST'])
def search():
    logger.debug('%s [%s]', request.url, print_params(request.form))
    data = request.form.get('data')
    if data is not None:
        group = Group.query.filter_by(group_full_name=data.upper()).first()
        if group is not None:
            return redirect(url_for('frontend.timetable', group_id=group.group_id))
        else:
            flash('Введіть дані запиту')
            return render_template('index.html')
    abort(404)


# Dump way to check week, need more info !!
def get_week(start=None):
    if not start:
        start = datetime.date(datetime.date.today().year - 1, 9, 1)
    start_week = start.isocalendar()[1]
    now = datetime.date.today()
    now_week = now.isocalendar()[1]
    if start_week % 2 == now_week % 2:
        return 2
    else:
        return 1


@frontend.route('/timetable/<int:group_id>')
def timetable(group_id):
    logger.debug('%s [%s]', request.url, print_params(request.form))
    group_lessons = Lesson.query.filter_by(group_id=group_id).order_by('lesson_number', 'day_number', 'subgroup').all()
    if group_lessons is not None and len(group_lessons) > 0:
        lessons = []
        for week in range(0, 2):
            weeks = {}
            for day_number in range(1, 8):
                day = []
                for lesson_number in range(1, 9):
                    lesson_list = []
                    for lesson in group_lessons:
                        if lesson.day_number == day_number and \
                           lesson.lesson_number == lesson_number and \
                           (lesson.lesson_week == week or lesson.lesson_week == -1):
                            lesson_list.append(lesson)
                    if len(lesson_list) > 0:
                        day.append(lesson_list)
                if len(day) > 0:
                    weeks[day_number] = day
            lessons.append(weeks)
        return render_template('timetable.html', lessons=lessons, week=get_week(), group=Group.query.get(group_id))
    else:
        abort(404)


@frontend.route('/howto')
def how_to():
    logger.debug('%s', request.url)
    input_file = codecs.open('schedule/frontend/static/pages/faq.md', mode='r', encoding='utf-8')
    text = input_file.read()
    html = markdown.markdown(text)
    return render_template('pages.html', content=html)

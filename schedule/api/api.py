from flask import Blueprint, jsonify, request, session
from schedule.models import Group, Institute, Lesson, Teacher

api = Blueprint('api', __name__)


def row2dict(row):
    d = {}
    for column in row.__table__.columns:
        d[column.name] = u'{0}'.format(getattr(row, column.name))
    return d


@api.route('/favorite', methods=['POST'])
def favorite():
    active_group = session.get('group_id')
    group = request.form.get('group_id')
    if group is not None:
        if active_group != group:
            session['group_id'] = group
            return jsonify(data='updated')
    return jsonify('done')

@api.route('/group', methods=['GET'])
def group_search():
    group_name = request.args.get('search')

    if group_name:
        group_name = group_name.upper()
        all_groups = Group.query.filter(
            Group.group_full_name.ilike('%'+ group_name + '%')
        ).order_by('group_full_name').all()
        data = []
        for i in all_groups:
            data.append(row2dict(i))
        return jsonify(data)

@api.route('/teacher', methods=['GET'])
def teacher_search():
    teacher_name = request.args.get('search')
    if teacher_name:
        teacher_name = teacher_name.lower()
        teachers = Teacher.query.filter(Teacher.teacher_name.ilike('%'+teacher_name+'%')).order_by('teacher_name').all()
        data = []
        for i  in teachers:
            item = row2dict(i)
            item['institute'] = row2dict(i.institute)
            data.append(item)
        return jsonify(data)

@api.route('/institute/<int:institute_id>/groups', methods=['GET'])
def group(institute_id):
    group_name = request.args.get('search')
    if institute_id is not None:
        all_groups = Group.query.filter_by(institute_id=institute_id).order_by('group_full_name').all()
    elif group_name:
        group_name = group_name.upper()
        all_groups = Group.query.filter(
            Group.group_full_name.like(group_name + '%')
        ).order_by('group_full_name').all()
    data = []
    for i in all_groups:
        data.append(row2dict(i))
    return jsonify(data)


@api.route('/institute/<int:institute_id>/teachers', methods=['GET'])
def teachers(institute_id):
    teachers = Teacher.query.filter_by(institute_id = institute_id)
    data = []
    for i in teachers:
        data.append(row2dict(i))
    return jsonify(data)


@api.route('/institutes', methods=['GET'])
def institute():
    all_institutes = Institute.query.all()
    data = []
    for i in all_institutes:
        data.append(row2dict(i))
    return jsonify(data)


@api.route('/timetable/group/<int:group_id>', methods=['GET'])
def group_timetable(group_id):
    group_lessons = Lesson.query.filter_by(
        group_id=group_id, active=True).order_by('lesson_number', 'day_number', 'subgroup').all()
    data = []
    for i in group_lessons:
        item = row2dict(i)
        teachers = []
        for t in i.teachers:
            teachers.append(row2dict(t))
        item['teachers'] = teachers
        data.append(item)
    return jsonify(data)


@api.route('/timetable/teacher/<int:teacher_id>', methods=['GET'])
def teacher_timetable(teacher_id):
    teacher = Teacher.query.filter_by(teacher_id=teacher_id).first()
    data = []
    if(teacher is not None):
        for i in teacher.lessons:
            if(i.active == True):
                item = row2dict(i)
                item['teachers'] = row2dict(teacher)
                item['group'] = row2dict(i.group)
                data.append(item)
    return jsonify(data)
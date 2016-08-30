# -*- coding: utf-8 -*-
"""App models."""
from schedule.core import db
from sqlalchemy.ext.declarative import declared_attr


class Base(object):
    @declared_attr
    def __tablename__(self):
        return self.__name__.lower()


class Lesson(Base, db.Model):
    lesson_id = db.Column(db.Integer, primary_key=True)
    lesson_name = db.Column(db.Unicode)
    lesson_number = db.Column(db.Integer)
    lesson_type = db.Column(db.Unicode)
    lesson_week = db.Column(db.Integer, default=-1)
    subgroup = db.Column(db.Integer, default=-1)
    room = db.Column(db.Unicode)
    semester_part = db.Column(db.Integer)
    active = db.Column(db.Boolean, default=True)

    day_number = db.Column(db.Integer)
    day_name = db.Column(db.Unicode)

    group_id = db.Column(db.Integer, db.ForeignKey('group.group_id'))
    time_id = db.Column(db.Integer, db.ForeignKey('time.time_id'))

    time = db.relationship('Time')
    group = db.relationship('Group', backref='lessons')

    @staticmethod
    def get_by_attrs(**kwargs):
        return Lesson.query.filter_by(subgroup=kwargs.get('subgroup'),
                                      lesson_number=kwargs.get('lesson_number'),
                                      lesson_week=kwargs.get('lesson_week'),
                                      day_number=kwargs.get('day_number'),
                                      group=Group.get_by_full_name(kwargs.get('group'))).first()

    @staticmethod
    def add(lesson):
        db.session.add(lesson)
        db.session.commit()

    @staticmethod
    def deactivate(lesson):
        lesson.active = False
        lesson.teachers = []
        db.session.commit()

    @staticmethod
    def update(lesson, **kwargs):
        changes = False

        lesson_name = kwargs.get('lesson_name')
        if lesson_name is not None and lesson.lesson_name != lesson_name:
            lesson.lesson_name = lesson_name
            changes = True
        lesson_type = kwargs.get('lesson_type')
        if lesson_type is not None and lesson.lesson_type != lesson_type:
            lesson.lesson_type = lesson_type
            changes = True
        semester_part = kwargs.get('semester_part')
        if semester_part is not None and lesson.semester_part != int(semester_part):
            lesson.semester_part = int(semester_part)
            changes = True

        room = kwargs.get('room')
        if room is not None and lesson.room != room:
            lesson.room = room
            changes = True

        day_name = kwargs.get('day_name')
        if day_name is not None and lesson.day_name != day_name:
            lesson.day_name = day_name
            changes = True

        teacher = kwargs.get('teacher')
        if teacher is not None and teacher not in lesson.teachers:
            lesson.teachers = []
            lesson.teachers.append(teacher)
            changes = True

        active = kwargs.get('active')
        if active is not None and lesson.active != active:
            lesson.active = active
            changes = True

        if changes:
            db.session.commit()


class Institute(Base, db.Model):
    institute_id = db.Column(db.Integer, primary_key=True)
    institute_abbr = db.Column(db.String(10, convert_unicode=True), unique=True)
    institute_full_name = db.Column(db.String(convert_unicode=True))

    @staticmethod
    def get_by_attr(abbr):
        return Institute.query.filter_by(institute_abbr=abbr).first()

    @staticmethod
    def add(institute):
        db.session.add(institute)
        db.session.commit()


class Group(Base, db.Model):
    group_id = db.Column(db.Integer, primary_key=True)
    group_full_name = db.Column(db.String)
    group_url = db.Column(db.String)
    institute_id = db.Column(db.Integer, db.ForeignKey('institute.institute_id'))
    active = db.Column(db.Boolean, default=True)
    institute = db.relationship('Institute')

    @staticmethod
    def get_by_full_name(group_full_name):
        return Group.query.filter_by(group_full_name=group_full_name).first()

    @staticmethod
    def add(Group):
        db.session.add(Group)
        db.session.commit()


class Time(Base, db.Model):
    time_id = db.Column(db.Integer, primary_key=True)
    time_number = db.Column(db.Integer, unique=True)
    time_start = db.Column(db.Time)
    time_end = db.Column(db.Time)

    @staticmethod
    def get_by_number(time_number):
        return Time.query.filter_by(time_number=time_number).first()

    @staticmethod
    def add(time):
        if time.time_id is None:
            db.session.add(time)
        db.session.commit()


class Teacher(Base, db.Model):
    teacher_id = db.Column(db.Integer, primary_key=True)
    teacher_name = db.Column(db.Unicode, unique=True)
    active = db.Column(db.Boolean, default=True)
    lessons = db.relationship('Lesson', secondary='lesson_teacher', backref='teachers')

    @staticmethod
    def get_by_name(teacher_name):
        return Teacher.query.filter_by(teacher_name=teacher_name).first()

    @staticmethod
    def add(Teacher):
        db.session.add(Teacher)
        db.session.commit()
        return Teacher


class LessonTeacher(Base, db.Model):
    lessonteacher_id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.teacher_id'))
    lesson_id = db.Column(db.Integer, db.ForeignKey('lesson.lesson_id'))

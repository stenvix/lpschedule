# -*- coding: utf-8 -*-
"""App models."""
from sqlalchemy.ext.declarative import declared_attr

from schedule import db

class Base(object):
    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()

class Lesson(Base, db.Model):

    lesson_id = db.Column(db.Integer, primary_key=True)
    lesson_name = db.Column(db.Unicode)
    lesson_number = db.Column(db.Integer)
    lesson_type = db.Column(db.Unicode)
    lesson_week = db.Column(db.Integer, default=-1)
    subgroup = db.Column(db.Integer,default=-1)
    room = db.Column(db.Unicode)
    semester_part = db.Column(db.Integer)

    day_number = db.Column(db.Integer)
    day_name = db.Column(db.Unicode)

    group_id = db.Column(db.Integer, db.ForeignKey('group.group_id'))
    time_id = db.Column(db.Integer, db.ForeignKey('time.time_id'))

    time = db.relationship('Time')
    group = db.relationship('Group')


    @classmethod
    def get_by_attrs(self, lesson_name, lesson_number, lesson_week, day_number):
        return Lesson.query.filter_by(lesson_name=lesson_name, lesson_number=lesson_number,lesson_week=lesson_week,day_number=day_number).first()

    @classmethod
    def add(self, Lesson):
        db.session.add(Lesson)
        db.session.commit()


class Institute(Base, db.Model):
    institute_id = db.Column(db.Integer, primary_key=True)
    institute_abbr = db.Column(db.String(10,convert_unicode=True),unique=True)
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

    active = db.Column(db.Boolean, default=True)

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

class Teacher(Base, db.Model):
    teacher_id = db.Column(db.Integer, primary_key=True)
    teacher_name = db.Column(db.Unicode, unique=True)
    active = db.Column(db.Boolean,default=True)
    lessons = db.relationship('Lesson', secondary='lesson_teacher',backref="teachers")

    @staticmethod
    def get_by_name(teacher_name):
        return Teacher.query.filter_by(teacher_name = teacher_name).first()

    @staticmethod
    def add(Teacher):
        db.session.add(Teacher)
        db.session.commit()
        return Teacher

class LessonTeacher(Base, db.Model):
    lessonteacher_id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.teacher_id'))
    lesson_id = db.Column(db.Integer, db.ForeignKey('lesson.lesson_id'))
# -*- coding: utf-8 -*-
"""App models."""
from schedule import db


class Lesson(db.Model):
    lesson_id = db.Column(db.Integer, primary_key=True)
    lesson_name = db.Column(db.String(100), nullable=False)
    lesson_number = db.Column(db.Integer, nullable=False)
    lesson_type = db.Column(db.String(10), nullable=False)
    lesson_week = db.Column(db.Integer, nullable=False)
    room = db.Column(db.String(50), nullable=False)
    time_start = db.Column(db.Time)
    time_end = db.Column(db.Time)
    day_number = db.Column(db.Integer, nullable=False)
    day_name = db.Column(db.String, nullable=False)

    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.teacher_id'))
    group_id = db.Column(db.Integer, db.ForeignKey('group.group_id'))


class Group(db.Model):
    group_id = db.Column(db.Integer, primary_key=True)


class Teacher(db.Model):
    teacher_id = db.Column(db.Integer, primary_key=True)

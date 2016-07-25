# -*- coding: utf-8 -*-
from flask import jsonify, request
from schedule.api import api
from schedule.models import Group, Institute


def row2dict(row):
    d = {}
    for column in row.__table__.columns:
        d[column.name] = unicode(getattr(row, column.name))
    return d


@api.route('/group', methods=['GET'])
def group():
    group_name = request.args.get('search')
    params = request.args.get('institute_id')

    if params is not None:
        all_groups = Group.query.filter_by(institute_id=params).order_by('group_full_name').all()
    if group_name:
        group_name = group_name.upper()
        all_groups = Group.query.filter(Group.group_full_name.like(group_name+"%")).order_by('group_full_name').all()
    data = []
    for i in all_groups:
        data.append(row2dict(i))
    return jsonify(data=data)

@api.route('/institute', methods=["GET"])
def institute():
    all_institutes = Institute.query.all()
    data = []

    for i in all_institutes:
        data.append(row2dict(i))

    return jsonify(data=data)
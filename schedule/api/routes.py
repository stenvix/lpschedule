# -*- coding: utf-8 -*-
from flask import jsonify,request
from schedule.api import api
from schedule.models import Group

def row2dict(row):
    d = {}
    for column in row.__table__.columns:
        d[column.name] = unicode(getattr(row, column.name))

    return d

@api.route('/group', methods=['GET'])
def group():
    group_name = request.args.get('search')
    if group_name:
        group_name=group_name.upper()
        all_groups = Group.query.filter(Group.group_full_name.like(group_name+"%")).order_by('group_full_name').all()
    else:
        all_groups = Group.query.order_by('group_full_name').all()
    a = []
    for i in all_groups:
        a.append(row2dict(i))

    return jsonify(data = a)


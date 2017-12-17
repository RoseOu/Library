# coding: utf-8
from . import management
from flask import render_template


# test views
@management.route('/test/')
def management_test():
    return "<h1>just tell you everything is ok!</h1>"

@management.route('/login/')
def management_login():
    return render_template("management/login_a.html")

@management.route('/manage/')
def manage():
    return render_template("management/manage.html")


# coding: utf-8
from . import main
from flask import render_template


# test views
@main.route('/test/')
def test():
    return "<h1>just tell you everything is ok!</h1>"

@main.route('/')
def index():
    return render_template("main/index.html")

@main.route('/login/')
def login():
    return render_template("main/login.html")

@main.route('/profile/<int:id>/')
def profile(id):
    return render_template("main/profile.html")

@main.route('/second/')
def second():
    return render_template("main/second.html")

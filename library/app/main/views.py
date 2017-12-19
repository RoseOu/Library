# coding: utf-8
from . import main
from flask import request, render_template


# test views
@main.route('/')
def index():
    return render_template("main/index.html")

@main.route('/login/')
def login():
    return render_template("main/login.html")

@main.route('/profile/<int:id>/')
def profile(id):
    return render_template("main/profile.html")

@main.route('/book/<int:id>/')
def second(id):
    return render_template("main/second.html")

@main.route('/search/',methods=["GET"])
def search():
    way = int(request.args.get("way"))
    page = int(request.args.get("page"))
    body = request.args.get("body")
    num = int(request.args.get("num")) if request.args.get("page") else 10
    return render_template("main/bookList.html")

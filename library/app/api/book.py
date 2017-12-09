#coding:utf-8

from flask import request,jsonify
from . import api
from app import db
from app.models import User,Book,Borrow
from app.decorators import admin_required
from datetime import datetime, timedelta


@api.route('/search/', methods=["GET"])
def search_book():
    body = request.args.get("body")
    page = int(request.args.get('page'))
    num = int(request.args.get('num')) if request.args.get('num') else 10
    way = int(request.args.get("way"))
    if way==1:
        book = Book.query.filter(Book.name.like('%'+body+'%')).order_by(Book.purchase_date.desc()).limit(num).offset((page-1)*num)
        count = Book.query.filter(Book.name.like('%'+body+'%')).count()
    elif way==2:
        book = Book.query.filter(Book.author.like('%'+body+'%')).order_by(Book.purchase_date.desc()).limit(num).offset((page-1)*num)
        count = Book.query.filter(Book.author.like('%'+body+'%')).count()
    book_list = [{
        "book_id":b.id,
        "name":b.name,
        "author":b.author,
        "book_introduction":b.book_introduction,
        "image":b.image
       } for b in book]
    return jsonify({
        "book":book_list,
        "count":count
        })

@api.route('/book/<int:id>/', methods=["GET"])
def get_book(id):
    book = Book.query.get_or_404(id)
    return jsonify({
        "name":book.name,
        "author":book.author,
        "book_introduction":book.book_introduction,
        "press":book.press,
        "publication_time":book.publication_time,
        "book_introduction":book.book_introduction,
        "image":book.image
        })

@api.route('/new/', methods=["GET"])
def get_new():
    book = Book.query.order_by(Book.purchase_date.desc()).limit(5)
    book_list = [{
        "book_id":b.id,
        "name":b.name,
        "author":b.author,
        "book_introduction":b.book_introduction,
        "image":b.image
       } for b in book]
    return jsonify({
        "book":book_list
        })

@api.route('/rank/', methods=["GET"])
def get_rank():
    book = Book.query.order_by(Book.borrowtime.desc()).limit(10)
    book_list = [{
        "book_id":b.id,
        "name":b.name,
        "author":b.author,
        "book_introduction":b.book_introduction,
        "image":b.image,
        "borrowtime":b.borrowtime
       } for b in book]
    return jsonify({
        "book":book_list
        })

@api.route('/changedays/', methods=["GET"])
def change_days():
    borrow = Borrow.query.all()
    now_date = datetime.utcnow()+timedelta(hours=8)
    for b in borrow:
        b.days = (b.return_date-now_date).days+1
        db.session.add(b)
        db.session.commit()
        if b.days < 0:
            b.status = 3
    return jsonify({
        "status":"success"
        })



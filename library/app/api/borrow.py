#coding:utf-8

from flask import request,jsonify
from . import api
from app import db
from app.models import User,Book,Borrow
from app.decorators import admin_required
from datetime import datetime,timedelta


@api.route('/borrow/', methods=["POST"])
def borrow_book():
    user_id = int(request.get_json().get("user_id"))
    book_id = int(request.get_json().get("book_id"))
    book = Book.query.get_or_404(book_id)
    borrow_date = datetime.utcnow()+timedelta(hours=8)
    return_date = borrow_date + timedelta(days=90)
    status = 1
    days = 90
    borrow = Borrow(borrow_date=borrow_date, return_date=return_date, days=days,
                    status=status, user_id=user_id, book_id=book_id)
    db.session.add(borrow)
    db.session.commit()
    book.borrowtime = book.borrowtime + 1
    db.session.add(book)
    db.session.commit()
    return jsonify({
        "borrow_id":borrow.id
        })

@api.route('/return/', methods=["POST"])
def return_book():
    borrow_id = int(request.get_json().get("borrow_id"))
    borrow = Borrow.query.get_or_404(borrow_id)
    borrow.status = 2
    db.session.add(borrow)
    db.session.commit()
    return jsonify({
        "borrow_id":borrow.id
        })


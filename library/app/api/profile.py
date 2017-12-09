#coding:utf-8

from flask import request,jsonify
from . import api
from app import db
from app.models import User,Book,Borrow
from app.decorators import admin_required

@api.route('/profile/<int:id>/', methods=["GET"])
def profile(id):
    status = int(request.args.get('status'))
    page = int(request.args.get('page'))
    num = int(request.args.get('num')) if request.args.get('num') else 10
    user = User.query.get_or_404(id)
    borrow = Borrow.query.filter_by(user_id=id).filter_by(status=status).order_by(Borrow.return_date.asc()).limit(num).offset((page-1)*num)
    count = Borrow.query.filter_by(user_id=id).filter_by(status=status).count()
    book_list = [{
        "borrow_id":b.id,
        "book_id": b.book.id,
        "name": b.book.name,
        "image": b.book.image,
        "borrow": b.borrow_date.strftime('%Y-%m-%d'),
        "return": b.return_date.strftime('%Y-%m-%d'),
        "days": b.days
        } for b in borrow]
    return jsonify({
        "username": user.username,
        "book": book_list,
        "count": count
        })

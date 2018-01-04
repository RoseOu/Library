#coding:utf-8

from flask import request,jsonify
from . import api
from app import db
from app.models import User,Book,Borrow
from app.decorators import admin_required
from datetime import datetime,timedelta

@api.route('/admin/book/add/', methods=["POST"])
@admin_required
def add_book():
    name = request.get_json().get("name") if request.get_json().get("name") else ""
    author = request.get_json().get("author") if request.get_json().get("author") else ""
    isbn = request.get_json().get("isbn") if request.get_json().get("isbn") else ""
    press = request.get_json().get("press") if request.get_json().get("press") else ""
    publication_time = request.get_json().get("publication_time") if request.get_json().get("publication_time") else ""
    book_introduction = request.get_json().get("book_introduction") if request.get_json().get("book_introduction") else ""
    author_introduction = request.get_json().get("author_introduction") if request.get_json().get("author_introduction") else ""
    filed = request.get_json().get("filed") if request.get_json().get("filed") else ""
    image = request.get_json().get("image") if request.get_json().get("image") else ""
    purchase_date = datetime.utcnow()+timedelta(hours=8)
    book = Book(name=name,author=author,isbn=isbn,press=press,publication_time=publication_time,
                book_introduction=book_introduction,author_introduction=author_introduction,
                filed=filed,image=image,purchase_date=purchase_date)
    db.session.add(book)
    db.session.commit()
    return jsonify({
        "book_id":book.id
        })


@api.route('/admin/book/<int:id>/', methods=["POST"])
@admin_required
def edit_book(id):
    book = Book.query.get_or_404(id)
    book.name = request.get_json().get("name") if request.get_json().get("name") else ""
    book.author = request.get_json().get("author") if request.get_json().get("author") else ""
    book.isbn = request.get_json().get("isbn") if request.get_json().get("isbn") else ""
    book.press = request.get_json().get("press") if request.get_json().get("press") else ""
    book.publication_time = request.get_json().get("publication_time") if request.get_json().get("publication_time") else ""
    book.book_introduction = request.get_json().get("book_introduction") if request.get_json().get("book_introduction") else ""
    book.author_introduction = request.get_json().get("author_introduction") if request.get_json().get("author_introduction") else ""
    book.filed = request.get_json().get("filed") if request.get_json().get("filed") else ""
    book.image = request.get_json().get("image") if request.get_json().get("image") else ""
    db.session.add(book)
    db.session.commit()
    return jsonify({
        "book_id":book.id
        })

@api.route('/admin/book/<int:id>/', methods=["DELETE"])
@admin_required
def delete_book(id):
    book = Book.query.get_or_404(id)
    if request.method == "DELETE":
        for borrow in Borrow.query.filter_by(book_id=id).all():
            db.session.delete(borrow)
        db.session.delete(book)
        db.session.commit()
        return jsonify({
            "book_id":id
            })

@api.route('/admin/book/', methods=["GET"])
@admin_required
def list_book():
    page = int(request.args.get('page'))
    num = int(request.args.get('num')) if request.args.get('num') else 10
    book = Book.query.order_by(Book.purchase_date.desc()).limit(num).offset((page-1)*num)
    count = Book.query.count()
    book_list = [{
        "book_id":b.id,
        "name":b.name,
        "author":b.author,
        "book_introduction":b.book_introduction,
        "isbn":b.isbn,
        "author_introduction":b.author_introduction,
        "filed":b.filed,
        "press":b.press,
        "publication_time":b.publication_time,
        "image":b.image
       } for b in book]
    return jsonify({
        "book":book_list,
        "count":count
        })

@api.route('/admin/return/', methods=["GET"])
@admin_required
def get_return():
    page = int(request.args.get('page'))
    num = int(request.args.get('num')) if request.args.get('num') else 10
    borrow = Borrow.query.filter_by(status=2).order_by(Borrow.return_date.asc()).limit(num).offset((page-1)*num)
    count = Borrow.query.filter_by(status=2).count()
    borrow_list = [{
        "borrow_id":b.id,
        "username":b.user.username,
        "user_id":b.user.id,
        "book_id":b.book.id,
        "name":b.book.name,
        "author":b.book.author,
        "book_introduction":b.book.book_introduction,
        "image":b.book.image,
        "borrow_date":b.borrow_date.strftime('%Y-%m-%d'),
        "return_date":b.return_date.strftime('%Y-%m-%d'),
        "days":b.days
        } for b in borrow]
    return jsonify({
        "book":borrow_list,
        "count":count
        })

@api.route('/admin/return/', methods=["POST"])
@admin_required
def ensure_return():
    borrow_id = request.get_json().get("borrow_id")
    borrow = Borrow.query.filter_by(id=borrow_id).first()
    db.session.delete(borrow)
    db.session.commit()
    return jsonify({
        "borrow_id":borrow_id
        })

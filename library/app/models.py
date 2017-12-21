# coding: utf-8
"""
sql models

    use: Flask-SQLAlchemy
    -- http://flask-sqlalchemy.pocoo.org/2.1/

"""

from . import db, login_manager
from flask import current_app
from itsdangerous import JSONWebSignatureSerializer as Serializer
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin, AnonymousUserMixin, current_user
from wtforms.validators import Email
from datetime import datetime,timedelta

# permissions
class Permission:
    """
    1. COMMENT: 0x01
    2. MODERATE_COMMENTS: 0x02
    3. ADMINISTER: 0x04
    """
    COMMENT = 0x01
    MODERATE_COMMENTS = 0x02
    ADMINISTER = 0x04


# user roles
class Role(db.Model):
    """
    1. Administrator
    2. User
    """
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)
    default = db.Column(db.Boolean, default=False, index=True)
    permissions = db.Column(db.Integer)
    users = db.relationship('User', backref='role', lazy='dynamic')

    @staticmethod
    def insert_roles():
        roles = {
            'User': (Permission.COMMENT, True),
            'Administrator': (
                Permission.COMMENT |
                Permission.MODERATE_COMMENTS |
                Permission.ADMINISTER,
                False
            )
        }
        for r in roles:
            role = Role.query.filter_by(name=r).first()
            if role is None:
                role = Role(name=r)
            role.permissions = roles[r][0]
            role.default = roles[r][1]
            db.session.add(role)
        db.session.commit()

    def __repr__(self):
        return '<Role %r>' % self.name


class User(db.Model, UserMixin):
    """user"""
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(164), unique=True, index=True)
    email = db.Column(db.String(164), info={'validator' : Email()},unique=True)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'), default=2)
    password_hash = db.Column(db.String(164))
    borrow = db.relationship('Borrow', backref='user', lazy='dynamic', cascade='all')

    @property
    def password(self):
        raise AttributeError('password is not readable')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    def is_admin(self):
        if self.role_id == 1:
            return True
        return False

    def generate_confirmation_token(self, expiration=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        return s.dumps({'confirm': self.id})

    def generate_auth_token(self):
        s = Serializer(current_app.config['SECRET_KEY'])
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return None
        return User.query.get(data['id'])

    def __repr__(self):
        return "<User %r>" % self.username


class AnonymousUser(AnonymousUserMixin):
    """ anonymous user """
    def is_admin(self):
        return False

login_manager.anonymous_user = AnonymousUser

# you can writing your models here:
class Book(db.Model):
    __tablename__ = 'books'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), default="", index=True)
    author = db.Column(db.String(64), default="")
    isbn = db.Column(db.String(128), default="")
    press = db.Column(db.String(128), default="")
    publication_time = db.Column(db.String(64), default="")
    book_introduction = db.Column(db.Text, default="")
    author_introduction = db.Column(db.Text, default="")
    filed = db.Column(db.String(64), default="")
    image = db.Column(db.String(192), default="")
    purchase_date = db.Column(db.DateTime, default=datetime.utcnow)
    borrowtime = db.Column(db.Integer,default=0)
    borrow = db.relationship('Borrow', backref='book', lazy='dynamic', cascade='all')

    def __repr__(self):
        return "<Book %r>" % self.name

class Borrow(db.Model):
    __tablename__ = 'borrows'
    id = db.Column(db.Integer, primary_key=True)
    borrow_date = db.Column(db.DateTime, default=datetime.utcnow)
    return_date = db.Column(db.DateTime, default=datetime.utcnow)
    days = db.Column(db.Integer,default=90)
    status = db.Column(db.Integer,default=1)
    user_id = db.Column(db.Integer,db.ForeignKey('users.id', ondelete="CASCADE"))
    book_id = db.Column(db.Integer,db.ForeignKey('books.id', ondelete="CASCADE"))

    def __repr__(self):
        return "<Borrow %r>" % self.id
 

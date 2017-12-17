# coding: utf-8

from flask import Blueprint

management = Blueprint(
    'management',
    __name__,
    template_folder = 'templates',
    static_folder = 'static'
)

from . import views, forms

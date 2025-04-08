# instructions/urls.py
from django.urls import path
from . import views

app_name = 'instructions'

urlpatterns = [
    path('', views.instructions, name='index'),  # сторінка з інструкціями
]
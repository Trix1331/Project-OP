# instructions/urls.py
from django.urls import path
from . import views

app_name = 'instructions'

urlpatterns = [
    path('', views.instructions_home, name='home'),  # сторінка з інструкціями
]
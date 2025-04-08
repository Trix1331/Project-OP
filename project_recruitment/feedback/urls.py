# feedback/urls.py
from django.urls import path
from . import views

app_name = 'feedback'

urlpatterns = [
    path('', views.add_feedback, name='add'),  # сторінка для відгуків
]
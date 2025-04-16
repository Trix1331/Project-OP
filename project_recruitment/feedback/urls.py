# feedback/urls.py
from django.urls import path, include
from . import views

app_name = 'feedback'

urlpatterns = [
    path('add/', views.add_feedback, name='add'),
    # path('feedback/', include('feedback.urls')),
]
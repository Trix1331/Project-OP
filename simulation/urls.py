from django.urls import path
from . import views

app_name = 'simulation'

urlpatterns = [
    path('', views.start_simulation, name='start'),
    path('question/<int:question_id>/', views.show_question, name='question'),
    path('results/', views.show_result, name='results'),
]
from django.urls import path
from . import views

app_name = 'simulation'

urlpatterns = [
    path('', views.simulation_start, name='index'),  # або інший маршрут для квізу
]
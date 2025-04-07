from django.urls import path
from . import views

app_name = 'simulation'

urlpatterns = [
    path('', views.simulation_home, name='home'),  # або інший маршрут для квізу
]
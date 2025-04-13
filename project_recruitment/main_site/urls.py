from django.urls import path
from . import views

app_name = 'main_site'


urlpatterns = [
    path('', views.home, name='home'),
    path('article/<int:article_id>/', views.article_detail, name='article_detail'),
]
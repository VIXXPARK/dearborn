from django.contrib import admin
from django.urls import path,include
from . import views

urlpatterns = [
    path('user/login', views.signin),
    path('user/register', views.signup),
    path('user/auth/', views.UserView.as_view()),
    path('user/logout', views.signout),
]
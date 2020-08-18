from django.contrib import admin
from django.urls import path,include
from . import views

urlpatterns = [
    path('user/login', views.signin),
    path('user/register', views.signup),
    path('user/auth/', views.UserView.as_view()),
    path('user/logout', views.signout),
    path('user/activate/<str:uid64>/<str:token>', views.Activate.as_view()),
    path('user/checkEmail', views.emailReVerification),
    path('user/changePassword',views.ChangePassword),
    path('user/sendChangeEmail', views.changeEmailRequest)
]
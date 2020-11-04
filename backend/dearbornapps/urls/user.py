from django.contrib import admin
from django.urls import path,include
from dearbornapp.views import user
urlpatterns = [
    path('user/login', user.signin),
    path('user/register', user.signup),
    path('user/auth/', user.UserView.as_view()),
    path('user/logout', user.signout),
    path('user/activate/<str:uid64>/<str:token>', user.Activate.as_view()),
    path('user/checkEmail', user.emailReVerification),
    path('user/changePassword',user.ChangePassword),
    path('user/sendChangeEmail', user.changeEmailRequest),
    path('user/changeProfile', user.changeProfile),
    path('user/delete', user.deleteUser),
    path('user/getUser',user.GetUserView.as_view()),
]
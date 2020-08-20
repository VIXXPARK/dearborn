from django.urls import path,include
from .views import saveAssess,getAssess

urlpatterns = [
    path('assess/saveValue',saveAssess.as_view()),
    path('assess/getValue',getAssess.as_view()),
]

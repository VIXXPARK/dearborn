from django.urls import path,include
from dearbornApp.views.assess import saveAssess,getAssess

urlpatterns = [
    path('assess/saveValue',saveAssess.as_view()),
    path('assess/getValue',getAssess.as_view()),
]

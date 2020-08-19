from django.urls import path,include
from .views import saveAssess

urlpatterns = [
    path('assess/saveValue',saveAssess.as_view()),
]

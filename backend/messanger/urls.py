from .views import MessageViewSet
from django.urls import path,include
from rest_framework.routers import DefaultRouter
router = DefaultRouter()

saveMessage = MessageViewSet.as_view({"post":"create"})

urlpatterns = [
    path('message/saveMessage',saveMessage,name="saveMessage"),
]

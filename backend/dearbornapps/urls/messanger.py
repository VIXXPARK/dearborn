from dearbornapp.views.messanger import MessageViewSet
from django.urls import path,include
from rest_framework.routers import DefaultRouter
router = DefaultRouter()

saveMessage = MessageViewSet.as_view({"post":"create"})
getMessage = MessageViewSet.as_view({"get":"GetMessage"})

urlpatterns = [
    path('message/saveMessage',saveMessage,name="saveMessage"),
    path('message/getMessage',getMessage, name="getMessage"),
]

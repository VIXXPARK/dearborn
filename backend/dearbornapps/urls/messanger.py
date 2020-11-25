from dearbornapps.views.messanger import MessageViewSet
from django.urls import path,include
from rest_framework.routers import DefaultRouter
router = DefaultRouter()

saveMessage = MessageViewSet.as_view({"post":"create"})
getMessage = MessageViewSet.as_view({"get":"GetMessage"})
read = MessageViewSet.as_view({"post":"Read"})
announce = MessageViewSet.as_view({"post":"Announce"})

urlpatterns = [
    path('message/saveMessage',saveMessage,name="saveMessage"),
    path('message/getMessage',getMessage, name="getMessage"),
    path('message/read',read, name="Read"),
    path('message/announce', announce, name="Announce"),
]
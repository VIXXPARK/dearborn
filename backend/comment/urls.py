from .views import CommentViewSet
from django.urls import path, include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('comment/upComment',CommentViewSet)

urlpatterns = [
    path('',include(router.urls)),
]

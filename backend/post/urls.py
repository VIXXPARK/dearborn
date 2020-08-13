from .views import PostViewSet,PostList, PostImageViewSet
from django.urls import path,include
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('post/uploadPost', PostViewSet)

urlpatterns = [
    path('',include(router.urls)),
    path('post/getPosts/',PostImageViewSet.as_view())
]

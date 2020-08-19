from .views import PostViewSet,PostList,PostImageViewSet
from django.urls import path,include
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('post/uploadPost', PostViewSet)

urlpatterns = [
    path('',include(router.urls)),
    path('post/getPosts/content/',PostList.as_view()),
    path('post/getPosts/image/',PostImageViewSet.as_view())
]

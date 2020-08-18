from .views import PostViewSet,PostList,PostImageViewSet, getProfileView ,upViewSet
from .views import likeView,disLikeView,likeDownView,dislikeDownView,getLikeView
from django.urls import path,include
from usermanagement.models import User
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
# router.register('post/upView',upViewSet)
post_list = PostViewSet.as_view({"get":"list","post":"create"})
post_detail = PostViewSet.as_view(
    {"get":"retrieve","patch":"partial_update","delete":"destroy"}
)

urlpatterns = [
    path('post/uploadPost',post_list,name="post_list"),
    path('post/<int:pk>',post_detail,name="post_detail"),
    path('post/getPosts/content/',PostList.as_view()),
    path('post/getPosts/image/',PostImageViewSet.as_view()),
    path('post/getProfile',getProfileView.as_view()),
    # path('',include(router.urls)),
    path('post/upView',upViewSet.as_view()),
    path('like/up',likeView.as_view()),
    path('dislike/up',disLikeView.as_view()),
    path('like/down',likeDownView.as_view()),
    path('dislike/down',dislikeDownView.as_view()),
    path('like/getlike',getLikeView.as_view())
]
##content
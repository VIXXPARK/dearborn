from .views import PostViewSet, getProfileView ,upViewSet,getDisLikeView,ReposView
from .views import likeView,disLikeView,likeDownView,dislikeDownView,getLikeView,getLikeDetail,PostView,PostDetail
from .views import myVoteView,upVoteView,getWorkView,getWorkLikeView,mySetWork,getMyWork, voteExpired
from django.urls import path,include
from usermanagement.models import User
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
post_list = PostViewSet.as_view({"get":"list","post":"create"})
post_detail = PostViewSet.as_view(
    {"get":"retrieve","patch":"partial_update","delete":"destroy"}
)

urlpatterns = [
    path('post/uploadPost',post_list,name="post_list"),
    path('post/<int:pk>',post_detail,name="post_detail"),
    path('post/getVotes/',PostView.as_view()),
    path('post/getRepos/',ReposView.as_view()),
    path('post/getPostDetail',PostDetail.as_view()),
    path('info/getProfile',getProfileView.as_view()),
    path('info/getWorks/',getWorkView.as_view()),
    path('info/getLikePosts/',getWorkLikeView.as_view()),
    path('post/upView',upViewSet.as_view()),
    path('like/up',likeView.as_view()),
    path('dislike/up',disLikeView.as_view()),
    path('like/down',likeDownView.as_view()),
    path('dislike/down',dislikeDownView.as_view()),
    path('like/getlike',getLikeView.as_view()),
    path('like/getDisliked',getDisLikeView.as_view()),
    path('like/getLikeDetail',getLikeDetail.as_view()),
    path('vote/myVote',myVoteView.as_view()),
    path('vote/upVote',upVoteView.as_view()),
    path('info/setMyWork',mySetWork.as_view()),
    path('info/getAbout',getMyWork.as_view()),
]
voteExpired(repeat=100000,repeat_until=None)

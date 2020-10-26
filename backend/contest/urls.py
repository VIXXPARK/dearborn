from .views import ContestViewSet,ContestPostViewSet,getHostView,getContest,infoContest,contestPostListView,contestPostDetail
from django.urls import path,include
contest_list = ContestViewSet.as_view({"get":"list","post":"create"})
contest_detail = ContestViewSet.as_view(
    {"get":"retrieve","patch":"partial_update","delete":"destroy"}
)
ContestPost_list = ContestPostViewSet.as_view({"get":"list","post":"create"})
ContestPost_detail = ContestPostViewSet.as_view(
    {"get":"retrieve","patch":"partial_update","delete":"destroy"}
)

urlpatterns = [
    path('contest/uploadContest',contest_list,name="contest_list"),
    path('contest/<char:pk>',contest_detail,name="contest_detail"),
    path('contest/post/uploadContest',ContestPost_list,name="ContestPost_list"),
    path('contest/post/<char:pk>',ContestPost_detail,name="ContestPost_detail"),
    path('contest/getContest',getHostView.as_view()),
    path('contest/getContests/',getContest.as_view()),
    path('info/getContests/',infoContest.as_view()),
    path('contest/post/list/',contestPostListView.as_view()),
    path('contest/post/detail',contestPostDetail.as_view())

]
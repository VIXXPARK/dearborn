from dearbornApp.views.contest import ContestViewSet,getHostView,getContest,infoContest,contestDeleteView
from django.urls import path,include
contest_list = ContestViewSet.as_view({"get":"list","post":"create"})
contest_detail = ContestViewSet.as_view(
    {"get":"retrieve","patch":"partial_update","delete":"destroy"}
)


urlpatterns = [
    path('contest/uploadContest',contest_list,name="contest_list"),
    path('contest/<uuid:pk>',contest_detail,name="contest_detail"),
    path('contest/getContest',getHostView.as_view()),
    path('contest/getContests/',getContest.as_view()),
    path('info/getContests/',infoContest.as_view()),
    path('contest/delete',contestDeleteView.as_view()),

]
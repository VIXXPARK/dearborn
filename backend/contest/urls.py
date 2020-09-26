from .views import ContestViewSet,ContestPostViewSet
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
    path('contest/uploadPost',contest_list,name="contest_list"),
    path('contest/<int:pk>',contest_detail,name="contest_detail"),
    path('contest/post/uploadPost',ContestPost_list,name="ContestPost_list"),
    path('contest/post/<int:pk>',ContestPost_detail,name="ContestPost_detail"),
]
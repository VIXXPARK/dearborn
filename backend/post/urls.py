from .views import PostViewSet,PostList,PostImageViewSet
from django.urls import path,include
from usermanagement.models import User
post_list = PostViewSet.as_view({"get":"list","post":"create"})
post_detail = PostViewSet.as_view(
    {"get":"retrieve","patch":"partial_update","delete":"destroy"}
)
getPost_list = getPostViewSet.as_view({"get":"list","post":"create"})
getPost_detail = getPostViewSet.as_view(
    {"get":"retrieve","patch":"partial_update","delete":"destroy"}
)


urlpatterns = [
    path('post/uploadPost',post_list,name="post_list"),
    path('post/<int:pk>',post_detail,name="post_detail"),
    path('post/getPosts/content/',PostList.as_view()),
    path('post/getPosts/image/',PostImageViewSet.as_view()),
]

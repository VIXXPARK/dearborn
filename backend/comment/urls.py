from .views import MakeCommentView,GetCommentView,DeleteCommentView,UpdataCommentView
from django.urls import path, include

urlpatterns = [
    path('comment/upComment', MakeCommentView.as_view()),
    path('comment/getComment',GetCommentView.as_view()),
    path('comment/delComment',DeleteCommentView.as_view()),
    path('comment/fixComment',UpdataCommentView.as_view()),
]

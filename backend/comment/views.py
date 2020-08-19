from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions

from .models import Comment
from .serializers import CommentSerializer

class CommentViewSet(ModelViewSet):
    permission_classes = (permissions.AllowAny, )
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        instance = response.data
        return Response({'success':True})
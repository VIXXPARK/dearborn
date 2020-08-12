from rest_framework.viewsets import ModelViewSet
from .serializers import PostSerializer
from .models import Post,Comment
from rest_framework import filters
from rest_framework.generics import ListAPIView
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser,FormParser
class PostViewSet(ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    parser_classes = (MultiPartParser,FormParser)
    
from rest_framework.viewsets import ModelViewSet
from .serializers import PostSerializer,PostImageSerializer,getPostSerializer
from .models import Post,PostImage
from usermanagement.models import User
from rest_framework import filters
from rest_framework.generics import ListAPIView
from django.views.generic.detail import DetailView
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser,FormParser
from rest_framework.response import Response
from rest_framework.status import(
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_502_BAD_GATEWAY,
    HTTP_500_INTERNAL_SERVER_ERROR
)
from django.db.models import Count
from usermanagement.models import User
from django.shortcuts import get_object_or_404

class PostViewSet(ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    parser_classes = (MultiPartParser,FormParser)
    
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        instance = response.data
        return Response({'success': True})


class getProfileView(ListAPIView):
    queryset = Post.objects.all()
    serializer_class = getPostSerializer

    def get_queryset(self):
        queryset = Post.objects.all()
        return queryset

    def get(self,request):
        try:
            data = getPostSerializer


    
class PostImageViewSet(ListAPIView):
    queryset = PostImage.objects.all()
    serializer_class = PostImageSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        queryset = PostImage.objects.raw('select * from post_postimage group by post_id')
        return queryset

    def get(self,request):
        try:
            data=PostImageSerializer(self.get_queryset(),many=True).data
            context={
                'success':True,
                'data':data
            }
            return Response(context,status=HTTP_200_OK)
        except Exception as error:
            context = {
                'error':str(error)
            }
            return Response(context,status=HTTP_500_INTERNAL_SERVER_ERROR)


            

class PostList(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = (permissions.AllowAny,)
    def get_queryset(self):
        queryset = Post.objects.all()
        return queryset

    def get(self,request):
        try:
            data=PostSerializer(self.get_queryset(),many=True).data
<<<<<<< HEAD
=======
            # user = request.user
            # userdata = user.get_info()
            # data2 = PostImageSerializer(PostImage.get_queryset(),many=True).data
>>>>>>> 88758c73ff6a058a18b586dd809a865324eb9b28
            context = {
                'success':True,
                'data':data,
                'user':userdata,
            }
            return Response(context,status=HTTP_200_OK)
        except Exception as error:
            context = {
                'error':str(error),
                'success':False
            }
            return Response(context,status=HTTP_500_INTERNAL_SERVER_ERROR)


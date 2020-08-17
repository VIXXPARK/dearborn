from rest_framework.viewsets import ModelViewSet
from .serializers import PostSerializer,PostImageSerializer,getPostSerializer,UserCheckSerializer,viewSerializer
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
import json
from rest_framework.decorators import api_view, permission_classes

class upViewSet(ModelViewSet):
    serializer_class = viewSerializer
    queryset = Post.objects.all()
    permission_classes = (permissions.AllowAny,)
    def retrieve(self,request,*args,**kwargs):
        obj = self.get_object()
        Post.objects.filter(pk=obj.id).update(view=F('view')+1)
        serializer = self.get_serializer(obj)
        return Response(serializer.data)



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
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        queryset = PostImage.objects.raw('select * from post_postimage group by post_id')
        return queryset

    def post(self,request):
        userSerializer = UserCheckSerializer(data = request.data)
        if not userSerializer.is_valid():
            return Response({'success':False}, status=HTTP_400_BAD_REQUEST)
            
        userdata = User.object.get(nickname=userSerializer.validated_data['nickname'])
        userid = userdata.get_id()
        postdata = Post.objects.filter(user=userid)
        try:
            profileImage = userdata.profileImage.url(),
        except:
            profileImage = None,
        user = {
            'id' : userdata.id,
            'nickname' : userdata.nickname,
            'profileImage' : profileImage,
        }
        postJson = []
        
        for postraw in postdata:
            image = PostImageSerializer(PostImage.objects.filter(post=postraw.id), many=True).data
            try:
                thumbnail = postraw.thumbnail.url(),
            except:
                thumbnail = None,
            
            post = {
                'title' : postraw.title,
                'content' : postraw.content,
                'updated_dt' : postraw.updated_dt,
                'writer' : postraw.user.id,
                'image' : image,
                'thumbnail' : thumbnail,
                
            }
            postJson.append(post)
        
        context={
            'success': True,
            'postdata': postJson,
            'userdata' : user,
        }
        return Response(context, status=HTTP_200_OK)
        # except Exception as error:
        #     context = {
        #         'success': False,
        #         'error':str(error)
        #     }
        #     return Response(context, status=HTTP_404_NOT_FOUND)

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
                'data':data,
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


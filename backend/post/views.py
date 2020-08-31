# -*- coding: utf-8 -*-
from rest_framework.viewsets import ModelViewSet
from .serializers import PostSerializer,PostImageSerializer,UserCheckSerializer,viewSerializer, PostIdSerializer
from .serializers import likeSerializer,dislikeSerializer,getLikeSerializer,getLikeDetailSerializer
from .models import Post,PostImage,like,disLike
from usermanagement.models import User
from rest_framework import filters
from rest_framework.generics import ListAPIView,DestroyAPIView
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser,FormParser,JSONParser
from rest_framework.response import Response
from rest_framework.status import(
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_502_BAD_GATEWAY,
    HTTP_500_INTERNAL_SERVER_ERROR
)
import json
from rest_framework.views import APIView

class getLikeDetail(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self,request):
        liked = getLikeDetailSerializer(data=request.data)
        if not liked.is_valid():
            return Response({'likeSuccess':False,'data':request.data},status=HTTP_400_BAD_REQUEST)
        try:
            likedata = like.objects.get(user=liked.validated_data['user'],post=liked.validated_data['post'])
            context = {
                'success': True,
                'data' : 1
            }
            return Response(context,status=HTTP_200_OK)
        except:
            disliked = getLikeDetailSerializer(data=request.data)
            if not disliked.is_valid():
                return Response({'disLikeSuccess':False,'data':reqeust.data},status=HTTP_400_BAD_REQUEST)
            try:
                dislikedata = disLike.objects.get(user=disliked.validated_data['user'],post=disliked.validated_data['post'])
                context = {
                    'success':True,
                    'data':2
                }
                return Response(context,status=HTTP_200_OK)
            except:
                context = {
                    'success':True,
                    'data': 0
                }
                return Response(context,status=HTTP_200_OK)

class getLikeView(ListAPIView):
    queryset = like.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = likeSerializer

    def get_queryset(self):
        queryset = like.objects.all()
        queryset.filter(user=self.request.data['user'])
        return queryset

    def get(self,request):
        try:
            data = likeSerializer(self.get_queryset(),many=True).data
            context={
                'success':True,
                'data':data
            }
            return Response(context,status=HTTP_200_OK)
        except Exception as error:
            context={
                'success':False,
                'error':str(error)
            }
            return Response(context,status=HTTP_400_BAD_REQUEST)
    
    def post(self,request):
        liked = getLikeSerializer(data=request.data)
        if not liked.is_valid():
            return Response({'success':False,'data':request.data},status=HTTP_400_BAD_REQUEST)
        likedata = like.objects.filter(user=liked.validated_data['user'])
        postlist=[]
        for likeinstance in likedata:
            postlist.append(likeinstance.post.get_id())
        context = {
            'success':True,
            'data' : postlist
        }
        return Response(context,status=HTTP_200_OK)

class disLikeView(ListAPIView):
    queryset = disLike.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = dislikeSerializer

    def get_queryset(self):
        queryset = disLike.objects.all()
        return queryset

    def get(self,request):
        try:
            data = dislikeSerializer(self.get_queryset,many=True).data
            context = {
                'success':True,
                'data':data
            }
            return Response(context,status=HTTP_200_OK)
        except Exception as error:
            context= {
                'success':False,
                'error':str(error)
            }
            return Response(context,status=HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self,request):
        like = dislikeSerializer(data=request.data)
        if not like.is_valid():
            return Response({'success':False},status=HTTP_400_BAD_REQUEST)
        like.save()
        context = {
            'success':True
        }
        return Response(context,status=HTTP_200_OK)

    
class likeDownView(DestroyAPIView):
    queryset = like.objects.all()
    serializer_class = likeSerializer
    permission_classes = (permissions.AllowAny,)
    def get_object(self,post,user):
        try:
            instance = self.queryset.get(user=user,post=post)
            return instance
        except like.DoesNotExist:
            raise HTTP_404_NOT_FOUND
    
    def delete(self,request,format=None):
        instance = self.get_object(request.data['post'],request.data['user'])
        instance.delete()
        return Response({"success":True},status=HTTP_204_NO_CONTENT)

class dislikeDownView(DestroyAPIView):
    queryset = disLike.objects.all()
    serializer_class = dislikeSerializer
    permission_classes = (permissions.AllowAny,)
    def get_object(self,post,user):
        try:
            instance = self.queryset.get(user=user,post=post)
            return instance
        except dislike.DoesNotExist:
            raise HTTP_404_NOT_FOUND
    
    def delete(self,request,format=None):
        instance = self.get_object(request.data['post'],request.data['user'])
        instance.delete()
        return Response({"success":True},status=HTTP_204_NO_CONTENT)


class likeView(ListAPIView):
    queryset = like.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = likeSerializer

    def get_queryset(self):
        queryset = like.objects.all()
        return queryset

    def get(self,request):
        try:
            data = likeSerializer(self.get_queryset,many=True).data
            context = {
                'success':True,
                'data':data
            }
            return Response(context,status=HTTP_200_OK)
        except Exception as error:
            context= {
                'success':False,
                'error':str(error)
            }
            return Response(context,status=HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self,request):
        like = likeSerializer(data=request.data)
        if not like.is_valid():
            return Response({'success':False,'data':like.data},status=HTTP_400_BAD_REQUEST)
        like.save()
        context = {
            'success':True
        }
        return Response(context,status=HTTP_200_OK)

class upViewSet(ListAPIView):
    queryset = Post.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = viewSerializer

    def get_queryset(self):
        queryset = Post.objects.all()
        return queryset

    def get(self,request):
        try:
            data=viewSerializer(self.get_queryset(),many=True).data
            context = {
                'success':True,
                'data':data,
            }
            return Response(context,status=HTTP_200_OK)
        except Exception as error:
            context = {
                'error':str(error),
                'success':False
            }
            return Response(context,status=HTTP_500_INTERNAL_SERVER_ERROR)



    def post(self,request):
        view = viewSerializer(data=request.data)
        if not view.is_valid():
            return Response({'success':False,'data':view.data},status=HTTP_400_BAD_REQUEST)
        
        postdata = Post.objects.get(id=view.validated_data['id'])
        postView = postdata.get_view()
        postView = postView + 1
        postdata.view = postView
        postdata.save()
        context = {
            'success':True,
            'data': postdata.view
        }
        return Response(context,status=HTTP_200_OK)

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
            profileImage = userdata.profileImage.url,
        except:
            profileImage = None,
        user = {
            'id' : userdata.id,
            'nickname' : userdata.nickname,
            'profileImage' : profileImage,
        }
        postJson = []
        image = []
        for postraw in postdata:
            jpgs = PostImage.objects.filter(post=postraw.id)
            try:
                 for pngs in jpgs:
                    image.append(pngs.image.url)
            except:
                pass

            try:
                thumbnail = postraw.thumbnail.url()
            except:
                thumbnail = None,
            
            post = {
                'title' : postraw.title,
                'content' : postraw.content,
                'updated_dt' : postraw.updated_dt,
                'writer' : postraw.user.id,
                'images' : image,
                'thumbnail' : thumbnail,
                
            }
            postJson.append(post)
        
        context={
            'success': True,
            'repos': postJson,
            'user' : user,
        }
        return Response(context, status=HTTP_200_OK)

class getDetailView(ListAPIView):
    permission_classes = (permissions.AllowAny,)

    def post(self,request):
        mySerializer = viewSerializer(data = request.data)
        if not mySerializer.is_valid():
            return Response({'success':False}, status=HTTP_400_BAD_REQUEST)
            
        try:
            postData = Post.objects.get(id = mySerializer.validated_data['id'])
            userdata = User.object.get(id = postData.user.id)
        except:
            return Response({'success':false}, HTTP_204_NO_CONTENT)

        try:
            userProfile = userdata.profileImage.url,
        except:
            userProfile = None,
            
        user = {
            'id' : userdata.id,
            'nickname' : userdata.nickname,
            'profileImage' : userProfile,
            'content' : userdata.content,
        }


        try:
            image = PostImageSerializer(PostImage.objects.filter(post=postData), many=True).data
        except:
            image = None,
            
            
        postDict = {
            'title' : postData.title,
            'content' : postData.content,
            'updated_dt' : postData.updated_dt,
            'writer' : postData.user.id,
            'images' : image,              
        }
        
        context={
            'success': True,
            'detailPost': postDict,
            'user' : user,
        }
        return Response(context, status=HTTP_200_OK)
       
class PostView(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = (permissions.AllowAny,)

    def get(self,request):
        try:
            data = Post.objects.all()
            postData = []
            for post in data:
                user = User.object.filter(id=post.user.id)
                try:
                    thumb = post.thumbnail.url
                except:
                    thumb=None,
                postDic = {
                    'id' : post.id,
                    'title' : post.title,
                    'content' : post.content,
                    'updated_dt' : post.updated_dt,
                    'userId' : post.user.id,
                    'thumbnail' : thumb,
                    'writer' : user[0].nickname,
                    'profileImage' : user[0].profileImage.url,
                }
                postData.append(postDic)
           
            context = {
                'success':True,
                'data':postData,
               
            }
            return Response(context,status=HTTP_200_OK)
        except Exception as error:
            context = {
                'error':str(error),
                'success':False
            }
            return Response(context,status=HTTP_500_INTERNAL_SERVER_ERROR)

class PostDetail(APIView):

    permission_classes = (permissions.AllowAny,)
    parser_classes = (MultiPartParser,FormParser,JSONParser)
    def post(self,request):
        postID = PostIdSerializer(data=request.data)
        if not postID.is_valid():
            return Response({'success':False,},status = HTTP_400_BAD_REQUEST)

        postdata = Post.objects.get(id=postID.validated_data['id'])
        postimages = PostImage.objects.filter(post=postID.validated_data['id'])
        userdata = User.object.get(id = postdata.user.id)
        userid = userdata.get_id()

        Jpost = []
        jpgs = PostImage.objects.filter(post=postID.validated_data['id'])

        try:
            for pngs in jpgs:
                Jpost.append(pngs.image.url)
        except:
            mainimg = None,

        try:
            profileImage = userdata.profileImage.url,
        except:
            profileImage = None,

        user = {
            'nickname':userdata.nickname,
            'profileImage': profileImage,
            'content': userdata.content,
        }

        detailPost = {
            'id':postdata.id,
            'title':postdata.title,
            'content':postdata.content,
            'updatedAt' : postdata.updated_dt,
            'images':Jpost,
        }

        context = {
            'success' : True,
            'detailPost' : detailPost,
            'user' : user,
        }
        return Response(context,status=HTTP_200_OK)


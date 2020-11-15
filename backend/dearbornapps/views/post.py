# -*- coding: utf-8 -*-
from dearbornapps.serializers.post import(
    PostSerializer,
    PostImageSerializer,
    UserCheckSerializer, 
    PostIdSerializer,
    likeSerializer,
    dislikeSerializer,
    getLikeSerializer,
    getUserPostSerializer,
    myWorkSerializer,
    getUserSerializer,
    getVoteSerializer,
    UserIdSerializer,
    PostFilterSerializer
    )
from dearbornapps.serializers.messanger import SaveMessageSerializer

from dearbornapps.models.post import(
    Post,
    PostImage,
    like,
    disLike,
    vote,
    myWork
)

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView,DestroyAPIView
from rest_framework.viewsets import ModelViewSet

from rest_framework.parsers import MultiPartParser,FormParser,JSONParser

from rest_framework import filters
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.exceptions import APIException
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
from rest_framework.pagination import LimitOffsetPagination
from background_task import background
from datetime import datetime, timedelta
from pytz import timezone
from dearbornapps.models.bid import BidInfo
from dearbornapps.models.user import User
from dearbornapps.models.messanger import Message
from dearbornapps.feature.feature import Similarity,GetFeatureVector,SaveFeatureVector, GetImageArray

class PostViewSet(ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    parser_classes = (MultiPartParser,FormParser)
    def create(self, request, *args, **kwargs):
        
        try:
            response = super().create(request, *args, **kwargs)
        except APIException as e:
            return Response({"success":False,'err':e.detail},status=HTTP_404_NOT_FOUND)
        postId = response.data['id']
        image_array, image_file_name, image_id = GetImageArray(postId)
        vectors = GetFeatureVector(image_array)
        SaveFeatureVector(vectors,image_file_name,postId)
        similarity = Similarity(postId)
        context = {
            'similarity' : similarity,
            'success' : True,
        }
        instance = response.data
        return Response(context,HTTP_201_CREATED)

    def partial_update(self,request,*args,**kwargs):
        try:
            response = super().partial_update(request, *args, **kwargs)
        except APIException as e:
            return Response({"success":False,'err':e.detail},status=HTTP_404_NOT_FOUND)
        postId = response.data['id']
        image_array, image_file_name, image_id = GetImageArray(postId)
        vectors = GetFeatureVector(image_array)
        SaveFeatureVector(vectors,image_file_name,postId)
        similarity = Similarity(response.data.postId)
        context = {
            'similarity' : similarity,
            'success' : True,
        }
        instance = response.data
        return Response(context,HTTP_200_OK)

class postDeleteView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self,request):
        data = PostIdSerializer(data=request.data)
        if not data.is_valid():
            return Response({'success':False,'err':data.error_messages},status=HTTP_400_BAD_REQUEST)

        Post.objects.get(id=data.validated_data['id']).delete()
        PostImage.objects.filter(post=data.validated_data['id']).delete()
        content={
            'success':True,
        }
        return Response(content,status=HTTP_200_OK)

class PostView(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = (permissions.AllowAny,)
    pagination_class = LimitOffsetPagination

    def post(self,request):
        filterSerializer = PostFilterSerializer(data=request.data)
        if not filterSerializer.is_valid():
            return Response({'success':False, 'err':filterSerializer.error_messages},status=HTTP_400_BAD_REQUEST)
        
        try:
            if(filterSerializer.validated_data['sort']==0):
                if filterSerializer.validated_data['ook']==0:
                    data = self.paginate_queryset(Post.objects.filter(is_repo=False).order_by('-updated_dt'))
                else :
                    data = self.paginate_queryset(Post.objects.filter(category=filterSerializer.validated_data['ook'], is_repo=False).order_by('-updated_dt'))
            else:
                if filterSerializer.validated_data['ook']==0:
                    data = self.paginate_queryset(Post.objects.filter(is_repo=False).order_by('updated_dt'))
                else :
                    data = self.paginate_queryset(Post.objects.filter(category=filterSerializer.validated_data['ook'], is_repo=False).order_by('updated_dt'))
            postData = []
            for post in data:
                person = User.object.filter(id=post.user.id)
                try:
                    thumb = post.thumbnail.url
                except:
                    thumb=None,
                try:
                    profile=person[0].profileImage.url
                except:
                    profile=None,
                try:
                    nick = person[0].nickname
                except:
                    nick=None
                postDic = {
                    'id' : post.id,
                    'title' : post.title,
                    'content' : post.content,
                    'updated_dt' : post.updated_dt,
                    'userId' : post.user.id,
                    'thumbnail' : thumb,
                    'writer' : nick,
                    'profileImage' : profile,
                    'view':post.view,
                }
                postData.append(postDic)
           
            context = {
                'success':True,
                'votes':postData,
            }
            return Response(context,status=HTTP_200_OK)
        except APIException as e:
            context = {
                'err':e.detail,
                'success':False
            }
            return Response(context,status=HTTP_500_INTERNAL_SERVER_ERROR)

class ReposView(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = LimitOffsetPagination

    def post(self,request):
        filterSerializer = PostFilterSerializer(data=request.data)
        if not filterSerializer.is_valid():
            return Response({'success':False,'err':filterSerializer.error_messages},status=HTTP_400_BAD_REQUEST)

        try:
            if(filterSerializer.validated_data['sort']==0):
                if filterSerializer.validated_data['ook']==0:
                    data = self.paginate_queryset(Post.objects.filter(is_repo=True).order_by('-updated_dt'))
                else :
                    data = self.paginate_queryset(Post.objects.filter(category=filterSerializer.validated_data['ook'], is_repo=True).order_by('-updated_dt'))
            else:
                if filterSerializer.validated_data['ook']==0:
                    data = self.paginate_queryset(Post.objects.filter(is_repo=True).order_by('updated_dt'))
                else :
                    data = self.paginate_queryset(Post.objects.filter(category=filterSerializer.validated_data['ook'], is_repo=True).order_by('updated_dt'))
            postData = []
            for post in data:
                person = User.object.filter(id=post.user.id)
                try:
                    thumb = post.thumbnail.url
                except:
                    thumb=None,
                try:
                    profile=person[0].profileImage.url
                except:
                    profile=None,
                try:
                    nick = person[0].nickname
                except:
                    nick=None
                postDic = {
                    'id' : post.id,
                    'title' : post.title,
                    'content' : post.content,
                    'updated_dt' : post.updated_dt,
                    'userId' : post.user.id,
                    'thumbnail' : thumb,
                    'writer' : nick,
                    'profileImage' : profile,
                }
                postData.append(postDic)
           
            context = {
                'success':True,
                'repos':postData,
               
            }
            return Response(context,status=HTTP_200_OK)
        except APIException as e:
            context = {
                'err':e.detail,
                'success':False
            }
            return Response(context,status=HTTP_500_INTERNAL_SERVER_ERROR)

class PostDetail(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    parser_classes = (MultiPartParser,FormParser,JSONParser)

    def post(self,request):
        postID = PostIdSerializer(data=request.data)
        if not postID.is_valid():
            return Response({'success':False,'err':postID.error_messages},status = HTTP_400_BAD_REQUEST)

        try:
            postdata = Post.objects.get(id=postID.validated_data['id'])
            userdata = User.object.get(id = postdata.user.id)
        except APIException as e:
            return Response({'success':False, 'err':e.detail}, status=HTTP_204_NO_CONTENT)
        
        
        Jpost = []
        jpgs = PostImage.objects.filter(post=postID.validated_data['id'])

        try:
            for pngs in jpgs:
                Jpost.append(pngs.image.url)
        except:
           pass

        try:
            profileImage = userdata.profileImage.url,
        except:
            profileImage = None,

        try:
            thumbnail=postdata.thumbnail.url,
        except:
            thumbnail=None,
        user = {
            'id':userdata.id,
            'nickname':userdata.nickname,
            'profileImage': profileImage,
            'content': userdata.content,
        }

        detailPost = {
            'id':postdata.id,
            'title':postdata.title,
            'content':postdata.content,
            'updatedAt' : postdata.updated_dt,
            'thumbnail':thumbnail,
            'images':Jpost,
            'category':postdata.category,
            'scope':postdata.scope,
            
        }

        context = {
            'success' : True,
            'detailPost' : detailPost,
            'user' : user,
        }
        return Response(context,status=HTTP_200_OK)

class getProfileView(ListAPIView):
    queryset = Post.objects.all()
    permission_classes = (permissions.IsAuthenticated,)

    def post(self,request):
        userSerializer = UserCheckSerializer(data = request.data)
        if not userSerializer.is_valid():
            return Response({'success':False,'err':userSerializer.error_messages}, status=HTTP_400_BAD_REQUEST)
        try:
            userdata = User.object.get(nickname=userSerializer.validated_data['nickname'])
        except APIException as e:
            return Response({"success":False,'err':e.detail},status=HTTP_404_NOT_FOUND)
        view=0
        work=0
        liked=0

        try:
            postdata = Post.objects.filter(user=userdata.id)
            for x in postdata:
                work=work+1
                view=x.view+view
        except:
            pass

        try:
            likey = like.objects.filter(user=userdata.id)
            for y in likey:
                liked=liked+1
        except:
            pass
       

        try:
            profileImage = userdata.profileImage.url,
        except:
            profileImage = None,
        user = {
            'id' : userdata.id,
            'nickname' : userdata.nickname,
            'profileImage' : profileImage,
            'job':userdata.job,
            'work':work,
            'view':view,
            'like':liked
        }
        
        context={
            'success': True,
            'user' : user,
        }
        return Response(context, status=HTTP_200_OK)

class getWorkView(ListAPIView):
    queryset = Post.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        queryset = PostImage.objects.raw('select * from post_postimage group by post_id')
        return queryset

    def post(self,request):
        userSerializer = UserIdSerializer(data = request.data)
        if not userSerializer.is_valid():
            return Response({'success':False,'err':userSerializer.error_messages}, status=HTTP_400_BAD_REQUEST)
            
        try:
            userdata = User.object.get(id=userSerializer.validated_data['id'])
        except APIException as e:
            return Response({"success":False,'err':e.detail},status=HTTP_404_NOT_FOUND)
        
        postdata = self.paginate_queryset(Post.objects.filter(user=userdata, is_repo=True).order_by('-updated_dt'))
        
        postJson = []
        
        for postraw in postdata:
            image = []
            jpgs = PostImage.objects.filter(post=postraw.id)
            try:
                print(jpgs)
                for pngs in jpgs:
                    image.append(pngs.image.url)
            except:
                pass

            try:
                thumbnail = postraw.thumbnail.url
            except:
                thumbnail = None,
            
            post = {
                'id' : postraw.id,
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
        }
        return Response(context, status=HTTP_200_OK)

class getWorkLikeView(ListAPIView):
    queryset = Post.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        queryset = PostImage.objects.raw('select * from post_postimage group by post_id')
        return queryset

    def post(self,request):
        userSerializer = UserIdSerializer(data = request.data)
        if not userSerializer.is_valid():
            return Response({'success':False,'err':userSerializer.error_messages}, status=HTTP_400_BAD_REQUEST)
        
        userId = User.object.get(id=userSerializer.validated_data['id'])    
        likeObject = self.paginate_queryset(like.objects.filter(user=userId.id))
        postJson = []
        
        for postraw in likeObject:
            image = []
            jpgs = PostImage.objects.filter(post=postraw.post.id)
            try:
                for pngs in jpgs:
                    image.append(pngs.image.url)
            except:
                pass

            try:
                thumbnail = Post.objects.get(id=postraw.post.id).thumbnail.url
            except:
                thumbnail = None,
            temp = Post.objects.get(id=postraw.post.id)
            post = {
                'id' : temp.id,
                'title' : temp.title,
                'content' : temp.content,
                'updated_dt' : temp.updated_dt,
                'writer' : temp.user.id,
                'images' : image,
                'thumbnail' : thumbnail,
                
            }
            postJson.append(post)

        
        context={
            'success': True,
            'repos': postJson
        }
        return Response(context, status=HTTP_200_OK)

class upViewSet(ListAPIView):
    queryset = Post.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = PostIdSerializer

    def get_queryset(self):
        queryset = Post.objects.all()
        return queryset

    def post(self,request):
        view = PostIdSerializer(data=request.data)
        if not view.is_valid():
            return Response({'success':False,'err':view.error_messages},status=HTTP_400_BAD_REQUEST)
        
        try:
            postdata = Post.objects.get(id=view.validated_data['id'])
        except APIException as e:
            return Response({"success":False,'err':e.detail},status=HTTP_404_NOT_FOUND)
        postView = postdata.get_view()
        postView = postView + 1
        postdata.view = postView
        postdata.save()
        context = {
            'success':True,
            'data': postdata.view
        }
        return Response(context,status=HTTP_200_OK)

class likeView(ListAPIView):
    queryset = like.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = likeSerializer

    def get_queryset(self):
        queryset = like.objects.all()
        return queryset
    
    def post(self,request):
        like = likeSerializer(data=request.data)
        if not like.is_valid():
            return Response({'success':False,'err':like.error_messages},status=HTTP_400_BAD_REQUEST)
        like.save()
        context = {
            'success':True
        }
        return Response(context,status=HTTP_200_OK)

class disLikeView(ListAPIView):
    queryset = disLike.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = dislikeSerializer

    def get_queryset(self):
        queryset = disLike.objects.all()
        return queryset
    
    def post(self,request):
        like = dislikeSerializer(data=request.data)
        if not like.is_valid():
            return Response({'success':False,'err':like.error_messages},status=HTTP_400_BAD_REQUEST)
        like.save()
        context = {
            'success':True
        }
        return Response(context,status=HTTP_200_OK)

class likeDownView(DestroyAPIView):
    queryset = like.objects.all()
    serializer_class = likeSerializer
    permission_classes = (permissions.IsAuthenticated,)
    def get_object(self,post,user):
        try:
            instance = self.queryset.get(user=user,post=post)
            return instance
        except like.DoesNotExist:
            raise HTTP_404_NOT_FOUND
    
    def delete(self,request,format=None):
        try:
            instance = self.get_object(request.data['post'],request.data['user'])
            instance.delete()
            return Response({"success":True},status=HTTP_204_NO_CONTENT)
        except APIException as e:
            return Response({"success":False,'err':e.detail},status=HTTP_404_NOT_FOUND)

class dislikeDownView(DestroyAPIView):
    queryset = disLike.objects.all()
    serializer_class = dislikeSerializer
    permission_classes = (permissions.IsAuthenticated,)
    def get_object(self,post,user):
        try:
            instance = self.queryset.get(user=user,post=post)
            return instance
        except dislike.DoesNotExist:
            raise HTTP_404_NOT_FOUND
    
    def delete(self,request,format=None):
        try:
            instance = self.get_object(request.data['post'],request.data['user'])
            instance.delete()
            context={
                'success':True,
            }
            return Response(context,status=HTTP_200_OK)
        except APIException as e:
            return Response({"success":False,'err':e.detail},status=HTTP_404_NOT_FOUND)

class getLikeView(ListAPIView):
    queryset = like.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = likeSerializer

    def get_queryset(self):
        queryset = like.objects.all()
        queryset.filter(user=self.request.data['user'])
        return queryset

    def post(self,request):
        liked = getLikeSerializer(data=request.data)
        if not liked.is_valid():
            return Response({'success':False,'err':liked.error_messages},status=HTTP_400_BAD_REQUEST)
        likedata = like.objects.filter(post=liked.validated_data['post'])
        postlist=[]
        for likeinstance in likedata:
            lik = {
                'post' : likeinstance.post.id,
                'user' : likeinstance.user.id,
            }
            postlist.append(lik)
        context = {
            'success':True,
            'likes' : postlist
        }
        return Response(context,status=HTTP_200_OK)

class getDisLikeView(ListAPIView):
    queryset = disLike.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = getUserPostSerializer
     
    def post(self,request):
        liked = getUserPostSerializer(data=request.data)
        if not liked.is_valid():
            return Response({'success':False,'err':liked.error_messages},status=HTTP_400_BAD_REQUEST)
        likedata = disLike.objects.filter(post=liked.validated_data['post'],user=liked.validated_data['user'])
        postlist=[]
        for likeinstance in likedata:
            lik = {
                'post' : likeinstance.post.id,
                'user' : likeinstance.user.id,
            }
            postlist.append(lik)
        context = {
            'success':True,
            'dislike' : postlist
        }
        return Response(context,status=HTTP_200_OK)

class getLikeDetail(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self,request):
        liked = getUserPostSerializer(data=request.data)
        if not liked.is_valid():
            return Response({'success':False,'err':liked.error_messages},status=HTTP_400_BAD_REQUEST)
        try:
            likedata = like.objects.get(user=liked.validated_data['user'],post=liked.validated_data['post'])
            context = {
                'success': True,
                'data' : 1
            }
            return Response(context,status=HTTP_200_OK)
        except:
            disliked = getUserPostSerializer(data=request.data)
            if not disliked.is_valid():
                return Response({'success':False,'err':disliked.error_messages},status=HTTP_400_BAD_REQUEST)
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

class myVoteView(APIView):
    permission_classes=(permissions.AllowAny,)
    def post(self,request):
        posts = getUserSerializer(data=request.data)
        if not posts.is_valid():
            return Response({'success':False,'err':posts.error_messages},status=HTTP_400_BAD_REQUEST)
        postdata = vote.objects.filter(user=posts.validated_data['user'])
        postID = []
        for postcontent in postdata:
            postID.append(postcontent.post.id)
        context={
            'success':True,
            'posts':postID,
        }
        return Response(context,status=HTTP_200_OK)

class upVoteView(ListAPIView):
    permission_classes=(permissions.IsAuthenticated,)
    def post(self,request):
        voted =getVoteSerializer(data=request.data)
        if not voted.is_valid():
            return Response({'success':False,'err':voted.error_messages},status=HTTP_400_BAD_REQUEST)
        voted.save()
        return Response({'success':True},status=HTTP_200_OK) 


class mySetWork(ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self,request):
        worked =myWorkSerializer(data=request.data,partial=True)
        if not worked.is_valid():
            return Response({'success':False,'err':worked.error_messages},status=HTTP_400_BAD_REQUEST)
        try:
            userdata = User.object.get(email=request.user)
            workdata = myWork.objects.filter(user=userdata.id)
            work=0
            for x in workdata:
                work=work+1
            if work>=1:
                workdata.update(post=worked.data['post'])
            else:
                worked.save(user=request.user)    
        except:
            pass
        return Response({'success':True},status=HTTP_200_OK)

class getMyWork(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self,request):
        username = getUserSerializer(data=request.data)
        if not username.is_valid():
            return Response({'success':False,'err':username.error_messages},status=HTTP_400_BAD_REQUEST)

        
        
        try:
            work = myWork.objects.get(user=username.validated_data['user'])
            postdata = Post.objects.get(id=work.post.id)
            thumbnail=postdata.thumbnail.url
            about = {
            'id':postdata.id,
            'thumbnail':thumbnail,
            'title':postdata.title,
            'content':postdata.content
            }
            content={
                'success':True,
                'about':about,
            }
        except:
            about = {
            'id': None,
            'thumbnail': None,
            'title':None,
            'content':None
            }
            content={
                'success': True,
                'about':about,
            }
        
        return Response(content,status=HTTP_200_OK)


# @background()
# def voteExpired():
#     posts = Post.objects.filter(is_repo=False)
#     users = User.object.all()
#     for user in users:
#         user.now_updating = False
        
#     for post in posts:

#         KST = timezone('Asia/Seoul')
#         now = datetime.now(tz=KST)
#         expired_dt = post.expire_dt

#         if expired_dt <= now:

#             votes = vote.objects.filter(post = post.id).count()
#             try:
#                 postUser = User.object.get(id = post.user.id)
#             except APIException as e:
#                 raise e                
            
#             try:
#                 user = User.object.get(nickname='admin', is_superuser=True)    
#             except APIException as e:
#                 raise e      
            
#             if not postUser.now_updating:
#                 postUser.now_updating = True
#                 postUser.rankData = 0
#             postUser.rankData += votes
            
#             bid = BidInfo.objects.filter(post=post).order_by('-price')
#             try:
#                 price = bid[0].price
#                 message = price + "가격으로 판매됐읍니다\n Vote -> Repo로 넘어갑니다."
#             except:
#                 message = "판매로 넘어갑니다\n Vote -> Repo로 넘어갑니다."
#             data = {
#                 'userFrom' : user.id,
#                 'userTo' : post.user.id,
#                 'message' : message,
#             }
#             messageSerializer = SaveMessageSerializer(data = data)
#             if not messageSerializer.is_valid():
#                 raise messageSerializer.errors

#             try:
#                 messageSerializer.create(messageSerializer.validated_data)
#                 postUser.save()
#                 post.is_repo = True
#                 post.save()
#             except APIException as e:
#                 raise e




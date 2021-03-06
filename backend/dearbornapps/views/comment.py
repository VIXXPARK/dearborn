from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.exceptions import APIException
from rest_framework.status import(
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_502_BAD_GATEWAY,
    HTTP_500_INTERNAL_SERVER_ERROR
)
from dearbornapps.models.post import Post
from dearbornapps.models.comment import Comment
from dearbornapps.serializers.comment import CommentSerializer, GetCommentSerializer, DeleteCommentSerializer, UpdateCommentSerializer
from dearbornapps.models.user import User

class MakeCommentView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request):
        commentSerializer = CommentSerializer(data=request.data)
        if not commentSerializer.is_valid():
            return Response({'success':False, 'err' : commentSerializer.error_messages},status=HTTP_400_BAD_REQUEST)
        try:
            comment = commentSerializer.create(commentSerializer.validated_data)
            user = comment.user
            post = comment.post
            score = comment.score
            commentCount = Comment.objects.filter(post=post).count()
            postScore = post.score
            postScore = (postScore * (commentCount - 1) + score) / (commentCount)
            post.score = postScore
            post.save()
            try:
                profile = user.profileImage.url
            except:
                profile = None
            userDict = {
                'nickname' : user.nickname,
                'profileImage' : profile,
            }
        except APIException as e:
            return Response({'success':False, 'err' : e.detail},HTTP_400_BAD_REQUEST)

        context = {
            'success':True,
            'user' : userDict,
            'id' : comment.id,
            'score' : comment.score,
        }
        return Response(context, HTTP_201_CREATED)

class GetCommentView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request):
        getCommentSerializer = GetCommentSerializer(data=request.data)
        if not getCommentSerializer.is_valid():
            return Response({'success':False, 'err':getCommentSerializer.error_messages}, status=HTTP_400_BAD_REQUEST)
        postId = getCommentSerializer.validated_data['postId']
        commentQuery = Comment.objects.filter(post=postId)
        commentData = []
        for query in commentQuery:
            user = query.user
            try:
                profileImage = user.profileImage.url
            except:
                profileImage = None
            
            data = {
                'id' : query.id,
                'contents':query.contents,
                'userId':user.id,
                'profileImage':profileImage,
                'nickname':user.nickname, 
                'score' : query.score,
            }
            commentData.append(data)

        content = {
            'comments' : commentData,
            'success' : True
        }
        return Response(content, status=HTTP_200_OK)

class DeleteCommentView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request):
        deleteCommentSerializer = DeleteCommentSerializer(data=request.data)
        if not deleteCommentSerializer.is_valid():
            return Response({'success':False, 'err':deleteCommentSerializer.error_messages}, status=HTTP_400_BAD_REQUEST)
        commentId = deleteCommentSerializer.validated_data['commentId']
        try:
            commentObj = Comment.objects.filter(id=commentId)[0]
            postObj = commentObj.post
            currentPostScore = postObj.score
            commentCount = Comment.objects.filter(post=postObj).count()
            newPostScore = (currentPostScore * commentCount - commentObj.score) / (commentCount - 1)
            postObj.score = newPostScore
            postObj.save()
            commentObj.delete()
            return Response({'success':True},HTTP_200_OK)
        except APIException as e:
            return Response({'success':False, 'err':e.detail},HTTP_400_BAD_REQUEST)

class UpdataCommentView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request):
        updateCommentSerializer = UpdateCommentSerializer(data=request.data)
        if not updateCommentSerializer.is_valid():
            return Response({'success':False, 'err':updateCommentSerializer.error_messages},status=HTTP_400_BAD_REQUEST)
        commentId = updateCommentSerializer.validated_data['commentId']
        contents = updateCommentSerializer.validated_data['contents']
        score = updateCommentSerializer.validated_data['score']
        try:
            
            commentObj = Comment.objects.filter(id=commentId)[0]
            postObj = commentObj.post
            currentPostScore = postObj.score
            commentCount = Comment.objects.filter(post=postObj).count()
            currentScore = commentObj.score
            newPostScore = (currentPostScore * commentCount - currentScore + commentObj.score) / commentCount
            postObj.score = newPostScore
            postObj.save()
            commentObj.contents = contents
            commentObj.score = score
            commentObj.save()
            return Response({'success':True},status=HTTP_200_OK)
        except APIException as e:
            return Response({'success':False,'err':e.detail},status=HTTP_400_BAD_REQUEST)
            
from rest_framework import serializers
from dearbornApp.models.comment import Comment
from dearbornApp.models.user import User
from dearbornApp.models.post import Post
from django.db import IntegrityError

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['user', 'post', 'contents']

    def create(self, validated_data):
        user = validated_data['user']
        post = validated_data['post']
        contents = validated_data['contents']
        try: 
            result = Comment.objects.create(user=user, post=post, contents=contents)
            return result
        except:
            raise IntegerityError
        

class GetCommentSerializer(serializers.Serializer):
    postId = serializers.CharField()

class DeleteCommentSerializer(serializers.Serializer):
    commentId = serializers.CharField()

class UpdateCommentSerializer(serializers.Serializer):
    commentId = serializers.CharField()
    contents = serializers.CharField()
from rest_framework import serializers
from .models import Comment
from usermanagement.models import User
from post.models import Post
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
from rest_framework import serializers
from dearbornapps.models.comment import Comment
from dearbornapps.models.user import User
from dearbornapps.models.post import Post
from django.db import IntegrityError

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['user', 'post', 'contents', 'score']

    def create(self, validated_data):
        user = validated_data['user']
        post = validated_data['post']
        contents = validated_data['contents']
        score = validated_data['score']
        try: 
            result = Comment.objects.create(user=user, post=post, contents=contents, score=score)
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
    score = serializers.FloatField()
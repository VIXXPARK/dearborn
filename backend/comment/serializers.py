from rest_framework import serializers
from .models import Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['user', 'post', 'comment']
    def create(self, validated_data):
        comment = Comment.objects.create(**validated_data)
        return comment
from rest_framework import serializers
from dearbornapps.models.extraction import Taste


class CategorySerializer(serializers.Serializer):
    category = serializers.IntegerField()

class FilterSerializer(serializers.Serializer):
    postList = serializers.ListField(
        child=serializers.UUIDField()
    )
class SaveTasteSerializer(serializers.ModelSerializer):
    postList = serializers.ListField(
        child = serializers.DictField()
    )

    def create(self, validated_data):
        postList = validated_data['postList']
        for post in postList:
            postId = post['postId']
            userId = post['userId']
            taste = Taste.objects.create(user=userId, post=postId)
        return taste
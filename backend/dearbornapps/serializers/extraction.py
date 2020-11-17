from rest_framework import serializers
from dearbornapps.models.extraction import Taste


class CategorySerializer(serializers.Serializer):
    category = serializers.IntegerField()

class FilterSerializer(serializers.Serializer):
    postList = serializers.ListField(
        child=serializers.UUIDField()
    )
class SaveTasteSerializer(serializers.Serializer):
    postList = serializers.ListField(
        child = serializers.DictField()
    )

class RecommendPostSerializer(serializers.Serializer):
    postId = serializers.UUIDField()
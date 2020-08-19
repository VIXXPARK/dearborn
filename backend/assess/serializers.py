from rest_framework import serializers
from .models import Assess

class saveValueSerializer(serializers.Serializer):
    aesthetics =serializers.IntegerField()
    originality = serializers.IntegerField()
    convienience = serializers.IntegerField()
    massProductionPossibility = serializers.IntegerField()
    popularity = serializers.IntegerField()
    user = serializers.CharField()
    post= serializers.CharField()

    def create(self, validated_data):
        return Assess.objects.create(**validated_data)

class getValueSerializer(serializers.Serializer):
    post = serializers.CharField()


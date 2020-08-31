from rest_framework import serializers
from .models import Assess

class saveValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assess
        fields = '__all__'

class getValueSerializer(serializers.Serializer):
    post = serializers.CharField()

class designSerializer(serializers.Serializer):
    design = serializers.FloatField()

class individualitySerializer(serializers.Serializer):
    individuality = serializers.FloatField()

class practicalitySerializer(serializers.Serializer):
    practicality = serializers.FloatField()

class trendSerializer(serializers.Serializer):
    trend = serializers.FloatField()

class colorSerializer(serializers.Serializer):
    color = serializers.FloatField()

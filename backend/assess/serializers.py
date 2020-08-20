from rest_framework import serializers
from .models import Assess

class saveValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assess
        fields = '__all__'

class getValueSerializer(serializers.Serializer):
    post = serializers.CharField()

class aestheticsSerializer(serializers.Serializer):
    aesthetics = serializers.IntegerField()

class originalitySerializer(serializers.Serializer):
    originality = serializers.IntegerField()

class convienienceSerializer(serializers.Serializer):
    convienience = serializers.IntegerField()

class massProductionPossibilitySerializer(serializers.Serializer):
    massProductionPossibility = serializers.IntegerField()

class popularitySerializer(serializers.Serializer):
    popularity = serializers.IntegerField()

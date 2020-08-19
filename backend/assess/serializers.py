from rest_framework import serializers
from .models import Assess

class saveValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assess
        fields = '__all__'


class getValueSerializer(serializers.Serializer):
    post = serializers.CharField()


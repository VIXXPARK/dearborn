from rest_framework import serializers
from .models import Message

class SaveMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

    def create(self, validated_data):
        message = Message.objects.create(**validated_data)
        return message
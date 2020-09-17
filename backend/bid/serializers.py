from rest_framework import serializers
from .models import BidInfo

class MakeBidSerializer(serializers.ModelSerializer):
    class Meta:
        model = BidInfo
        fields = '__all__'
    
    def create(self, validated_data):
        bid = BidInfo.objects.create(**validated_data)
        return bid
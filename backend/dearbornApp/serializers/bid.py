from rest_framework import serializers
from dearbornApp.models.bid import BidInfo

class MakeBidSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        try:
            bid = BidInfo.objects.get(user = validated_data['user'],post = validated_data['post'])  
            bid.price = validated_data['price']
            bid.save()
            return bid
        except:
            try:
                bid = BidInfo.objects.create(**validated_data)
                return bid
            except:
                raise self.errors()

    class Meta:
        model = BidInfo
        fields = '__all__'

class GetBidSerializer(serializers.Serializer):
    uid = serializers.CharField(required=True)
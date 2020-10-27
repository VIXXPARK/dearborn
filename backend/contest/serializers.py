from rest_framework import serializers
from .models import Contest



class ContestSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Contest
        fields = ('id','user','title','description','contest_expire' ,'image','banner')

class getContestIdSerializer(serializers.Serializer):
    id = serializers.UUIDField()

class getUserSerializer(serializers.Serializer):
    user = serializers.CharField()

class sortSerializer(serializers.Serializer):
    sort = serializers.IntegerField()

from rest_framework import serializers
from .models import Contest,ContestPost



class ContestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contest
        fields = ('id','user','title','description','expire_dt' ,'image',)


class ContestPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContestPost
        fields= ('id','event','user','description','expire_dt','image',)

    
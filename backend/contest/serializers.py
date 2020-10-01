from rest_framework import serializers
from .models import Contest,ContestPost,ContestPostImage



class ContestSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Contest
        fields = ('id','user','title','description','contest_expire' ,'image',)

class ContestPostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContestPostImage
        fields=['image']
    


class ContestPostSerializer(serializers.ModelSerializer):
    images = ContestPostImageSerializer(many=True,read_only=True)
    class Meta:
        model = ContestPost
        fields= ('id','contest','user','description','expire_dt','thumbnail','images',)
    
    def create(self,validated_data):
        images_data = self.context['request'].FILES
        contestPost = ContestPost.objects.create(**validated_data)
        for image_data in images_data.getlist('images'):
            ContestPostImage.objects.create(contestPost=contestPost,image=image_data)
        
        return contestPost
    

class getContestIdSerializer(serializers.Serializer):
    id = serializers.IntegerField()

class getUserSerializer(serializers.Serializer):
    user = serializers.CharField()

class sortSerializer(serializers.Serializer):
    sort = serializers.IntegerField()

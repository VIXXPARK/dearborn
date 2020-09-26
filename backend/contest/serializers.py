from rest_framework import serializers
from .models import Contest,ContestPost,ContestPostImage



class ContestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contest
        fields = ('id','user','title','description','expire_dt' ,'image',)

class ContestPostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContestPostImage
        fields=['image']
    
    def get_image(self,contestimage:ContestPostImage):
        return ContestPostImage.image.url


class ContestPostSerializer(serializers.ModelSerializer):
    images = ContestPostImageSerializer(many=True,read_only=True)
    class Meta:
        model = ContestPost
        fields= ('id','event','user','description','expire_dt','thumbnail','images',)
    
    def create(self,validated_data):
        images_data = self.context['request'].FILES
        contestPost = ContestPost.objects.create(**validated_data)
        for image_data in images_data.getlist('images'):
            ContestPostImage.objects.create(contestpost=contestPost,image=image_data)
        
        return contestPost
    

class getContestIdSerializer(serializers.Serializer):
    id = serializers.IntegerField()
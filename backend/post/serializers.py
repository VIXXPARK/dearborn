from rest_framework import serializers
from .models import Post,PostImage,like,disLike,vote,myWork

class getVoteSerializer(serializers.ModelSerializer):
   class Meta:
      model = vote
      fields = '__all__'

class getUserSerializer(serializers.Serializer):
   user = serializers.CharField()

class getUserPostSerializer(serializers.Serializer):
   user = serializers.CharField()
   post = serializers.CharField()

class getLikeSerializer(serializers.Serializer):
   post = serializers.CharField()

class likeSerializer(serializers.ModelSerializer):
   class Meta:
      model = like
      fields = '__all__'

class dislikeSerializer(serializers.ModelSerializer):
   class Meta:
      model = disLike
      fields = '__all__'

class UserCheckSerializer(serializers.Serializer):
   nickname = serializers.CharField()

class PostImageSerializer(serializers.ModelSerializer):
   class Meta:
      model = PostImage
      fields = ['image']

   def get_image(self,postimage:PostImage):
      return postimage.image.url


class PostSerializer(serializers.ModelSerializer):
   images = PostImageSerializer(many=True, read_only=True)
   class Meta:
      model = Post
      fields = ('id', 'title','thumbnail', 'content','user','images','category','sell','scope')
   def create(self, validated_data):
      images_data = self.context['request'].FILES
      post = Post.objects.create(**validated_data)
      for image_data in images_data.getlist('images'):
         PostImage.objects.create(post=post, image=image_data)
       
      return post

class PostFilterSerializer(serializers.Serializer):
   ook = serializers.IntegerField()
   sort = serializers.IntegerField()
   

class LikeViewSerializer(serializers.ModelSerializer):
   class Meta:
      model=like
      fields = '__all__',


class PostIdSerializer(serializers.Serializer):
   id = serializers.IntegerField()

class UserIdSerializer(serializers.Serializer):
   id = serializers.CharField()

class likeUserSerializer(serializers.Serializer):
   id = serializers.CharField()

class myWorkSerializer(serializers.ModelSerializer):
   class Meta:
      model = myWork
      fields= '__all__'

      
   # Post = serializers.IntegerField()
   # User = serializers.CharField()
   # def create(self,validated_data):
   #    return myWork(**validated_data)

   # def update(self,instance,validated_data):
   #    instance.Post = validated_data.get('post',instance.Post)
   #    instance.User = validated_data.get('User',instance.User)
   #    return instance

from rest_framework import serializers
from .models import Event,EventImage,EventPost,EventPostImage

class EventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventImage
        fields= ['image']

class EventSerializer(serializers.ModelSerializer):
    images = EventImageSerializer(many=True,read_only=True)
    class Meta:
        model = Event
        fields = ('id','user','title','description','expire_dt' ,'images',)

    def create(self,validated_data):
        images_data = self.context['request'].FILES
        event = Event.objects.create(**validated_data)
        for image_data in images_data.getlist('images'):
            EventImage.objects.create(event=event,image=image_data)

        return event

class EventPostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventPostImage
        fields = ['image']

class EventPostSerializer(serializers.ModelSerializer):
    images = EventPostImageSerializer(many=True,read_only=True)
    class Meta:
        model = EventPost
        fields= ('id','event','user','description','expire_dt','images',)

    def create(self,validated_data):
        images_data = self.context['request'].FILES
        eventPost = EventPost.objects.create(**validated_data)
        for image_data in images_data.getlist('images'):
            EventPostImage.objects.objects.create(eventPost=eventPost,image=image_data)

        return eventPost
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.db import IntegrityError
from .models import User

class DeleteUserSerializer(serializers.Serializer):
    uid = serializers.CharField()

class ChangeProfileSerializer(serializers.Serializer):
    job = serializers.CharField()
    major = serializers.CharField()
    profileImage = serializers.ImageField()
    content = serializers.CharField()
    uid = serializers.CharField()

class ChangePasswordSeriallizer(serializers.Serializer):
    uid = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
    token = serializers.CharField(required=True)

class EmailVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

class UserSigninSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(min_length=8, write_only=True)
    nickname = serializers.CharField()
    job = serializers.CharField()
    major = serializers.CharField()
    profileImage = serializers.ImageField()
    content = serializers.CharField()
    
    def create(self, validated_data):
        new_user = User()
        myManager = new_user.objects()
        email = validated_data['email']
        password = validated_data['password']
        nickname = validated_data['nickname']
        job = validated_data['job']
        major = validated_data['major']
        profileImage = validated_data['profileImage']
        content = validated_data['content']
        
        try:
            new_user = myManager.create_user(email, password, nickname = nickname,
                       job = job, major = major,profileImage=profileImage, content=content)
            return new_user
        except:
            raise IntegrityError

    class Meta:
        model = User
        fields = ['email', 'password', 'nickname', 'job', 'major','profileImage','content']
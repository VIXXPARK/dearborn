from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import User

class UserSigninSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required = True)
    password = serializers.CharField(min_length=8)
    confirmPassword = serializers.CharField(min_length=8)

    def create(self):
        Mymanager = User.object
        myUser = Mymanager.create_user(self.email, self.password)
        return myUser
    class Meta:
        model = User
        fields = ['email', 'password', 'confirmPassword', 'nickname', 'job', 'major']
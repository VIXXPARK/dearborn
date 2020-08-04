# from django.shortcuts import render
# from rest_framework.viewsets import ReadOnlyModelViewSet,ModelViewSet
# from .models import Profile
# from .serializers import ProfileSerializer

# class ProfileViewSet(ModelViewSet):
#     queryset = Profile.objects.all()
#     serializer_class = ProfileSerializer


# profile_list = ProfileViewSet.as_view({
#     'get':'list',
#     'post':'create',
# })

# profile_detail = ProfileViewSet.as_view({
#     'get':'retrieve',
#     'put':'update',
#     'patch':'partial_update',
#     'delete':'destroy',
# })

# from rest_framework import generics
# from . import models
# form . import serializers

# class UserList(generics.ListAPIView):
#     queryset = models.User.objects.all()
#     serializer_class = serializers.ProfileSerializer

# class UserDetail(generics.RetrieveUpdateDestroyAPIView):
#     queryset = models.User.objects.all()
#     serializer_class = serializers.

from rest_framework import viewsets
from .models import User
from .serializers import ProfileSerializer
#from rest_framework.permissions import IsAuthenticated #about auth

class UserViewSet(viewsets.ModelViewSet):
    #permission_classes = (IsAuthenticated,) #about auth
    queryset = User.objects.all()
    serializer_class = ProfileSerializer


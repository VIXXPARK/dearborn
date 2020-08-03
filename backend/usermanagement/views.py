from django.shortcuts import render
from rest_framework.viewsets import ReadOnlyModelViewSet,ModelViewSet
from .models import Profile
from .serializers import ProfileSerializer

class ProfileViewSet(ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


profile_list = ProfileViewSet.as_view({
    'get':'list',
    'post':'create',
})

profile_detail = ProfileViewSet.as_view({
    'get':'retrieve',
    'put':'update',
    'patch':'partial_update',
    'delete':'destroy',
})
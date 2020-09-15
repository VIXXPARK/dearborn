from rest_framework.viewsets import ModelViewSet
from .serializers import EventImageSerializer,EventSerializer,EventPostImageSerializer,EventPostSerializer
from .models import Event,EventImage,EventPost,EventPostImage
from usermanagement.models import User
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser,FormParser,JSONParser
from rest_framework.response import Response
from rest_framework import status

class EventViewSet(ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    parser_classes = (MultiPartParser,FormParser)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        instance = response.data
        return Response({'success': True})

class EventPostViewSet(ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = EventPost.objects.all()
    serializer_class = EventPostSerializer
    parser_classes = (MultiPartParser,FormParser)

    def create(self,request,*args,**kwargs):
        response = super().create(request, *args, **kwargs)
        instance = response.data
        return Response({'success': True})
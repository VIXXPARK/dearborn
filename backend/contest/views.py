from rest_framework.viewsets import ModelViewSet
from .serializers import ContestSerializer,ContestPostSerializer
from .models import Contest,ContestPost
from usermanagement.models import User
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser,FormParser,JSONParser
from rest_framework.response import Response
from rest_framework import status

class ContestViewSet(ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Contest.objects.all()
    serializer_class = ContestSerializer
    parser_classes = (MultiPartParser,FormParser)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        instance = response.data
        return Response({'success': True})

class ContestPostViewSet(ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = ContestPost.objects.all()
    serializer_class = ContestPostSerializer
    parser_classes = (MultiPartParser,FormParser)

    def create(self,request,*args,**kwargs):
        response = super().create(request, *args, **kwargs)
        instance = response.data
        return Response({'success': True})
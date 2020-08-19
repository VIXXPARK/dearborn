from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import saveValueSerializer,getValueSerializer
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.status import(
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_502_BAD_GATEWAY,
    HTTP_500_INTERNAL_SERVER_ERROR
)
import json
from .models import Assess

class saveAssess(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self,request):
        assessed = saveValueSerializer(data=request.data)
        if not assessed.is_valid():
            return Response({'Success':False,'data':request.data},status=HTTP_400_BAD_REQUEST)
        assessed.save()
        context={
            'success':True
        }
        return Response(context,status=HTTP_200_OK)
        

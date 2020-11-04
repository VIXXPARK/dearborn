from django.shortcuts import render
from rest_framework.views import APIView, View
from dearbornapps.serializers.assess import saveValueSerializer,getValueSerializer
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework import authentication
from django.views.decorators.csrf import csrf_exempt
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
from dearbornapps.models.assess import Assess

class saveAssess(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self,request):
        assessed = saveValueSerializer(data=request.data)
        if not assessed.is_valid():
            return Response({'Success':False,'err':assessed.error_messages},status=HTTP_400_BAD_REQUEST)
        assessed.save()
        context={
            'success':True
        }
        return Response(context,status=HTTP_200_OK)


class getAssess(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self,request):
        design=0
        color=0
        individuality=0
        trend = 0
        practicality=0
        count=0
        assessed = getValueSerializer(data=request.data)
        if not assessed.is_valid():
            return Response({'Success':False,'err':assessed.error_messages},status=HTTP_400_BAD_REQUEST)
        assessData = Assess.objects.filter(post=assessed.validated_data['post'])
        List=[]
        
        for assessValue in assessData:
            design = design+assessValue.design
            color = color+assessValue.color
            individuality = individuality+assessValue.individuality
            trend = trend+assessValue.trend
            practicality = practicality+assessValue.practicality
            count=count+1
        if count!=0:
            context = {
                'success':True,
                'design': design/count,
                'color': color/count,
                'individuality': individuality/count,
                'practicality':practicality/count,
                'trend':trend/count,
            }
        else:
            context = {
                'success':True,
                'design': 0,
                'color': 0,
                'individuality': 0,
                'practicality':0,
                'trend':0,
            }
        return Response(context,status=HTTP_200_OK)
from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import saveValueSerializer,getValueSerializer
from .serializers import aestheticsSerializer,originalitySerializer,convienienceSerializer,massProductionPossibilitySerializer
from .serializers import popularitySerializer
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

class getAssess(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self,request):
        assessed = getValueSerializer(data=request.data)
        if not assessed.is_valid():
            return Response({'Success':False,'data':request.data},status=HTTP_400_BAD_REQUEST)
        assessData = Assess.objects.filter(post=assessed.validated_data['post'])
        List=[]
        for assessValue in assessData:
            aesthetics = aestheticsSerializer(Assess.objects.filter(user=assessValue.user),many=True).data
            originality = originalitySerializer(Assess.objects.filter(user=assessValue.user),many=True).data
            convienience = convienienceSerializer(Assess.objects.filter(user=assessValue.user),many=True).data
            massProductionPossibility = massProductionPossibilitySerializer(Assess.objects.filter(user=assessValue.user),many=True).data
            popularity = popularitySerializer(Assess.objects.filter(user=assessValue.user),many=True).data

            post = {
                'aesthetics': aesthetics,
                'originiality': originality,
                'convienience': convienience,
                'massProductionPossibility':massProductionPossibility,
                'popularity':popularity,
            }
            List.append(post)
        context = {
            'success':True,
            'data': List
        }
        return Response(context,status=HTTP_200_OK)
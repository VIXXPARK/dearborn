from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView,DestroyAPIView
from rest_framework.views import APIView
from .serializers import ContestSerializer,ContestPostSerializer,getContestIdSerializer
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

class getHostView(ListAPIView):
    permission_classes = (permissions.AllowAny,)

    def post(self,request):
        contestId = getContestIdSerializer(data=request.data)
        if not contestId.is_valid():
            return Response({'success':False},status=status.HTTP_400_BAD_REQUEST)
       
        contestdata = Contest.objects.get(id=contestId.validated_data['id'])
        userdata = User.object.get(email=contestdata.user)
        try:
            thumbnail=userdata.profileImage.url
        except:
            thumbnail=None,
        try:
            conimage=contestdata.image.url
        except:
            conimage=None,
        data={
            'id':userdata.id,
            'nickname':userdata.nickname,
            'profileImage':thumbnail,
        }
        data2={
            'id':contestdata.id,
            'title':contestdata.title,
            'description':contestdata.description,
            'image':conimage
        }
        context={
            'success':True,
            'host':data,
            'contest': data2
        }
        return Response(context,status=status.HTTP_200_OK)

class getContest(ListAPIView):
    permission_classes=(permissions.AllowAny,)
    def get(self,request):
        contestVal = Contest.objects.all()

        postJson = []
        for x in contestVal:
            try:
                conimage=x.image.url
            except:
                conimage=None,
            context={
                'id':x.id,
                'title':x.title,
                'description':x.description,
                'image':conimage
            }
            postJson.append(context)
        content={
            'success':True,
            'contest':postJson
        }
        return Response(content,status=status.HTTP_200_OK)


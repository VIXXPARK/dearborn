from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView,DestroyAPIView
from rest_framework.views import APIView

from dearbornapp.serializers.contest import ContestSerializer,getContestIdSerializer,sortSerializer,getUserSerializer

from dearbornapp.models.contest import Contest
from dearbornapp.models.user import User

from rest_framework import permissions
from rest_framework.parsers import MultiPartParser,FormParser,JSONParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.pagination import LimitOffsetPagination

class ContestViewSet(ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Contest.objects.all()
    serializer_class = ContestSerializer
    parser_classes = (MultiPartParser,FormParser)

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            instance = response.data
            return Response({'success': True})
        except APIException as e:
            return Response({'success':True, 'err':e.detail}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def partial_update(self,request,*args,**kwargs):
        try:
            response = super().partial_update(request, *args, **kwargs)
        except APIException as e:
            return Response({"success":False,'err':e.detail},status=status.HTTP_404_NOT_FOUND)
        context = {
            'success' : True,
        }
        instance = response.data
        return Response(context,status.HTTP_200_OK)
        
class contestDeleteView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self,request):
        data = getContestIdSerializer(data=request.data)
        if not data.is_valid():
            return Response({'success':False,'err':data.error_messages},status=status.HTTP_400_BAD_REQUEST)
        
        Contest.objects.get(id=data.validated_data['id']).delete()
        content={
            'succes':True
        }
        return Response(content,status=status.HTTP_200_OK)



        
class getHostView(ListAPIView):
    permission_classes = (permissions.AllowAny,)

    def post(self,request):
        contestId = getContestIdSerializer(data=request.data)
        if not contestId.is_valid():
            return Response({'success':False,'err':contestId.error_messages},status=status.HTTP_400_BAD_REQUEST)
       
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
    pagination_class = LimitOffsetPagination

    def post(self,request):
        sortdata = sortSerializer(data=request.data)
        if not sortdata.is_valid():
            return Response({'succes':False,'err':sortdata.error_messages},status=status.HTTP_400_BAD_REQUEST)
        if(sortdata.validated_data['sort']==0):
            contestVal = self.paginate_queryset(Contest.objects.all().order_by('-updated_dt'))
        else:
            contestVal = self.paginate_queryset(Contest.objects.all().order_by('updated_dt'))
        postJson = []
        for x in contestVal:
            try:
                conimage=x.banner.url
            except:
                conimage=None,
            context={
                'id':x.id,
                'title':x.title,
                'description':x.description,
                'banner':conimage,
                'updated_dt':x.updated_dt,
                'expired_dt':x.contest_expire
            }
            postJson.append(context)
        content={
            'success':True,
            'contests':postJson
        }
        return Response(content,status=status.HTTP_200_OK)

class infoContest(ListAPIView):
    permission_classes = (permissions.AllowAny,)
    pagination_class = LimitOffsetPagination

    def post(self,request):
        userdata = getUserSerializer(data=request.data)
        if not userdata.is_valid():
            return Response({'success':False,'err':userdata.error_messages},status=status.HTTP_400_BAD_REQUEST)
        data = self.paginate_queryset(Contest.objects.filter(user=userdata.validated_data['user']).order_by('-updated_dt'))
        postJson = []
        for x in data:
            try:
                ximage=x.banner.url
            except:
                ximage=None,
            context={
                'id':x.id,
                'title':x.title,
                'description':x.description,
                'banner':ximage,
                'updated_dt':x.updated_dt,
                'expired_dt':x.contest_expire
            }
            postJson.append(context)
        content={
            'success':True,
            'contests':postJson
        }
        return Response(content,status=status.HTTP_200_OK)


class ContestDetail(APIView):

    permission_classes = (permissions.AllowAny,)
    parser_classes = (MultiPartParser,FormParser,JSONParser)
    def post(self,request):
        contestID = getContestIdSerializer(data=request.data)
        if not contestID.is_valid():
            return Response({'success':False,'err':contestID.error_messages},status = status.HTTP_400_BAD_REQUEST)

        contestdata = Contest.objects.get(id=contestID.validated_data['id'])
        userdata = User.object.get(id = contestdata.user.id)

        
        try:
            profileImage = userdata.profileImage.url,
        except:
            profileImage = None,

        try:
            banner=contestdata.thumbnail.url,
        except:
            banner=None,
        
        try:
            image = contestdata.banner.url,
        except:
            image=None,
        user = {
            'id':userdata.id,
            'nickname':userdata.nickname,
            'profileImage': profileImage,
            'content': userdata.content,
        }

        detailContest = {
            'id':contestdata.id,
            'title':contestdata.title,
            'content':contestdata.content,
            'updatedAt' : contestdata.updated_dt,
            'banner':banner,
            'image':image,
        }

        context = {
            'success' : True,
            'detailContest' : detailContest,
            'user' : user,
        }
        return Response(context,status=status.HTTP_200_OK)

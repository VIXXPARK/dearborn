from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import ListAPIView,DestroyAPIView
from rest_framework.views import APIView
from .serializers import ContestSerializer,ContestPostSerializer,getContestIdSerializer,sortSerializer,getUserSerializer
from .models import Contest,ContestPost,ContestPostImage
from usermanagement.models import User
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser,FormParser,JSONParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import LimitOffsetPagination
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
    pagination_class = LimitOffsetPagination

    def post(self,request):
        sortdata = sortSerializer(data=request.data)
        if not sortdata.is_valid():
            return Response({'succes':False},status=status.HTTP_400_BAD_REQUEST)
        if(sortdata.validated_data['sort']==0):
            contestVal = self.paginate_queryset(Contest.objects.all().order_by('-updated_dt'))
        else:
            contestVal = self.paginate_queryset(Contest.objects.all().order_by('updated_dt'))
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
            'contests':postJson
        }
        return Response(content,status=status.HTTP_200_OK)

class infoContest(ListAPIView):
    permission_classes = (permissions.AllowAny,)
    pagination_class = LimitOffsetPagination

    def post(self,request):
        userdata = getUserSerializer(data=request.data)
        if not userdata.is_valid():
            return Response({'success':False},status=status.HTTP_400_BAD_REQUEST)
        data = self.paginate_queryset(Contest.objects.filter(user=userdata.validated_data['user']).order_by('-updated_dt'))
        postJson = []
        for x in data:
            try:
                ximage=x.image.url
            except:
                ximage=None,
            context={
                'id':x.id,
                'title':x.title,
                'description':x.description,
                'image':ximage
            }
            postJson.append(context)
        content={
            'success':True,
            'contests':postJson
        }
        return Response(content,status=status.HTTP_200_OK)


class contestPostListView(ListAPIView):
    permission_classes = (permissions.AllowAny,)
    pagination_class = LimitOffsetPagination

    def post(self,request):
        contestdata =getContestIdSerializer(data=request.data)
        if not contestdata.is_valid():
            return Response({'success':False},status=status.HTTP_400_BAD_REQUEST)
        print("++++++++++++++++++")
        print(contestdata.data)
        print("++++++++++++++++++")
        contestPostdata = self.paginate_queryset(ContestPost.objects.filter(contest=contestdata.validated_data['id']).order_by('-updated_dt'))
        postJson = []
        for x in contestPostdata:
            try:
                ximage = x.thumbnail.url
            except:
                ximage=None,
            context={
                'id':x.id,
                'thumbnail':ximage
            }
            postJson.append(context)
        content={
            'success':True,
            'posts':postJson
        }
        return Response(content,status=status.HTTP_200_OK)

class contestPostDetail(APIView):
        permission_classes=(permissions.AllowAny,)
        
        def post(self,request):
            itemdata = getContestIdSerializer(data=request.data)
            if not itemdata.is_valid():
                return Response({'success':False},status=status.HTTP_400_BAD_REQUEST)
            contestItemData = ContestPost.objects.get(id=itemdata.validated_data['id'])
            contestImageData = ContestPostImage.objects.filter(contestPost=contestItemData.id)
            images = []
            for x in contestImageData:
                try:
                    image = x.image.url
                    images.append(image)
                except:
                    pass
            content={
                'success':True,
                'id':contestItemData.id,
                'images':images
            }
            return Response(content,status=status.HTTP_200_OK)


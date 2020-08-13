from rest_framework.viewsets import ModelViewSet
from .serializers import PostSerializer
from .models import Post
from rest_framework import filters
from rest_framework.generics import ListAPIView
from rest_framework import permissions
from rest_framework.parsers import MultiPartParser,FormParser
from rest_framework.response import Response
from rest_framework.status import(
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_502_BAD_GATEWAY,
    HTTP_500_INTERNAL_SERVER_ERROR
)
class PostViewSet(ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    parser_classes = (MultiPartParser,FormParser)
    

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        instance = response.data
        return Response({'success': True})
    
    
class PostList(ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = PostSerializer
    def get_queryset(self):
        queryset = Post.objects.all()
        return queryset

    def get(self,request):
        try:
            data=PostSerializer(self.get_queryset(),many=True).data
            context = {
                'success':True,
                'data':data
            }
            return Response(context,status=HTTP_200_OK)
        except Exception as error:
            context = {
                'error':str(error),
                'success':False
            }
            return Response(context,status=HTTP_500_INTERNAL_SERVER_ERROR)

        
    
    
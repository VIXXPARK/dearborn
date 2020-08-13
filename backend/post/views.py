from rest_framework.viewsets import ModelViewSet
from .serializers import PostSerializer,PostImageSerializer
from .models import Post,PostImage
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
    
class PostImageViewSet(ListAPIView):    
    serializer_class = PostImageSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        queryset = PostImage.objects.all()
        return queryset

    def get(self,request):
        try:
            queryset = PostImage.objects.all()
            postIterator = queryset.iterator()

            # try:
            #     first_atom = next(postIterator)
            # except StopIteration:
            #     pass
            # else:
            #     from itertools import chain
            #     images = list()
            #     for post in chain([first_atom], postIterator):
            #         images.append(post.image)

            if queryset.exists():
                images = []
                for posts in queryset.iterator():
                    images.append(posts)
            if not images.count:
                return Response({'message': "No Images"}, status=HTTP_404_NOT_FOUND)

            context={
                'success': True,
                'posts':images,
            }
            return Response(context,status=HTTP_200_OK)
        except Exception as error:
            context = {
                'error':str(error)
            }
            return Response(context,status=HTTP_500_INTERNAL_SERVER_ERROR)



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

        
    
    
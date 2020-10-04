from .serializers import MakeBidSerializer,GetBidSerializer
from .models import BidInfo
from usermanagement.models import User
from post.models import Post
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.generics import ListAPIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet
from rest_framework.status import(
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_502_BAD_GATEWAY,
    HTTP_500_INTERNAL_SERVER_ERROR,
)

class BidViewSet(ModelViewSet):
    queryset = BidInfo.objects.all()
    serializer_class = MakeBidSerializer
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        instance = response.data
        return Response({'success':True})

'''
expire 수정 필요
'''

@api_view(['POST'])
@permission_classes((AllowAny, ))
def GetBid(request):
        my_serializer = GetBidSerializer(data = request.data)
        paginator = LimitOffsetPagination()
        if not my_serializer.is_valid():
            return Response({'success':False}, status = HTTP_400_BAD_REQUEST)
        uid = my_serializer.validated_data['uid']
        try:
            user = User.object.get(id = uid)
        except:
            return Response({'success' : False}, HTTP_400_BAD_REQUEST)
        job = user.job
        
        if job == 1:
            postData = paginator.paginate_queryset(Post.objects.filter(user = user.id,sell=1), request)
            sellPost = []
            for item in postData:
                if item.sell == 1:
                    bid = BidInfo.objects.filter(post = item.id).order_by('-price')
                    post = {
                        'thumbnail' : item.thumbnail.url,
                        'id' : item.id,
                        'title' : item.title,
                        'price' : bid[0].price,
                    }
                    sellPost.append(post)
            context = {
                'posts' : sellPost,
                'success' : True,
            }
            return Response(context, status = HTTP_200_OK)
        elif job == 2:
            bids = paginator.paginate_queryset(BidInfo.objects.filter(user=user.id), request)
            sellPost = []
            for item in bids:
                try:
                    post = Post.objects.get(id = item.post.id)
                except:
                    return Response({'success' : False}, HTTP_400_BAD_REQUEST)
                bidData = BidInfo.objects.filter(post = post.id).order_by('-price')
                bid = {
                    'price' : bidData[0].price,
                    'bidder' : bidData[0].user.id,
                }
                postData = {
                    'thumbnail' : post.thumbnail.url,
                    'postid' : post.id,
                    'title' : post.title,
                    'bid' : bid,
                }
                sellPost.append(postData)
            context = {
                'posts' : sellPost,
                'success' : True,
            }
            return Response(context, status = HTTP_200_OK)
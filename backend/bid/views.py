from .serializers import MakeBidSerializer
from .models import BidInfo
from rest_framework import permissions
from rest_framework.response import Response
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
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        instance = response.data
        return Response({'success':True})
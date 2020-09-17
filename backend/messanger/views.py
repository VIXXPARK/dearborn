from .serializers import SaveMessageSerializer
from .models import Message
from datetime import timedelta

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

from background_task import background

class MessageViewSet(ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = SaveMessageSerializer
    permission_classes = (permissions.AllowAny, )

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        instance = response.data
        self.AutoDelete(instance['id'])
        return Response({'success':True})
    
    #use "python manage.py process_tasks"
    @background(schedule=5)
    def AutoDelete(messageID):
        message = Message.objects.filter(id=messageID)
        message[0].delete()

    def GetMessage(self, request):
        pass
from .serializers import SaveMessageSerializer
from .models import Message
from datetime import timedelta

from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import APIException
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
    permission_classes = (permissions.IsAuthenticated,)
    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            instance = response.data
            self.AutoDelete(instance['id'])
            return Response({'success':True})
        except APIException as e:
            return Response({'success':False, 'err':e.detail})
       
    
    #use "python manage.py process_tasks"
    @background(schedule=5)
    def AutoDelete(messageID):
        message = Message.objects.filter(id=messageID)
        message[0].delete()

    def GetMessage(self, request):
        user = request.user
        messages = Message.objects.filter(userTo = user)
        
        messageList = []
        for message in messages:
            context1 = {
                'fromNickname' : message.userFrom.nickname,
                'fromId' : message.userFrom.id,
                'message' : message.message,
                'date' : message.updated_dt,
            }
            messageList.append(context1)
        
        context = {
            'success' : True,
            'messages' : messageList,
        }
        return Response(context, status=HTTP_200_OK)
        
        

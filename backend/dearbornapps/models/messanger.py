from django.db import models
from .user import User


class Message(models.Model):
    message = models.TextField(max_length=1000)
    userFrom = models.ForeignKey(User, on_delete=models.CASCADE, related_name = 'From')
    userTo = models.ForeignKey(User, on_delete=models.CASCADE, related_name = 'To')
<<<<<<< HEAD
    updated_dt = models.TimeField(auto_now_add=True)
    isRead = models.BooleanField(default=False)
=======
    updated_dt = models.TimeField(auto_now_add=True)
>>>>>>> ee15560e104601809ac8f3f318a811dc34ee29ad

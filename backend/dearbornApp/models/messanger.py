from django.db import models
from .user import User


class Message(models.Model):
    message = models.TextField(max_length=1000)
    userFrom = models.ForeignKey(User, on_delete=models.CASCADE, related_name = 'From')
    userTo = models.ForeignKey(User, on_delete=models.CASCADE, related_name = 'To')
    updated_dt = models.TimeField(auto_now_add=True)

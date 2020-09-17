from django.db import models
from usermanagement.models import User
class Contest(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(default=None)
    updated_dt = models.DateTimeField(auto_now_add=True)
    expire_dt = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to="event/")


class ContestPost(models.Model):
    event = models.ForeignKey(Contest,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    description = models.TextField(default=None)
    updated_dt = models.DateTimeField(auto_now_add=True)
    expire_dt = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to="eventPost/")


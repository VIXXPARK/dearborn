from django.db import models
from usermanagement.models import User
class Event(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(default=None)
    updated_dt = models.DateTimeField(auto_now_add=True)
    expire_dt = models.DateTimeField(auto_now_add=True)

class EventImage(models.Model):
    event = models.ForeignKey(Event,on_delete=models.CASCADE)
    image = models.ImageField(upload_to="event/")

    def get_image(self):
        return self.image

class EventPost(models.Model):
    event = models.ForeignKey(Event,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    description = models.TextField(default=None)
    updated_dt = models.DateTimeField(auto_now_add=True)
    expire_dt = models.DateTimeField(auto_now_add=True)

class EventPostImage(models.Model):
    eventPost = models.ForeignKey(EventPost,on_delete=models.CASCADE)
    image = models.ImageField(upload_to="eventPost/")

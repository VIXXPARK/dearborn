from django.db import models
from usermanagement.models import User
from backend.settings import MEDIA_URL
import os
from django.dispatch import receiver

def _delete_file(path):
   if os.path.isfile(path):
      os.remove(path)


class Post(models.Model):
   title = models.CharField(max_length=500)
   content = models.TextField()
   updated_dt = models.DateTimeField(auto_now_add=True)
   user = models.ForeignKey(User,on_delete=models.CASCADE)
   thumbnail = models.ImageField(upload_to="thumb/",null=True)
   view = models.IntegerField(default=0)
   siteType = models.IntegerField(default=0)
   def get_id(self):
      return self.id
   
   def get_view(self):
      return self.view

@receiver(models.signals.post_delete, sender=Post)
def delete_file(sender,instance,*args,**kwargs):
   if instance.thumbnail:
      _delete_file(instance.thumbnail.path)
   
       
   

class PostImage(models.Model):
   post = models.ForeignKey(Post, on_delete=models.CASCADE)
   image = models.ImageField(upload_to="images/")
   def get_image(self):
      return self.image

@receiver(models.signals.post_delete, sender=PostImage)
def delete_file(sender,instance,*args,**kwargs):
   if instance.image:
      _delete_file(instance.image.path)

class like(models.Model):
   user = models.ForeignKey(User,on_delete=models.CASCADE)
   post = models.ForeignKey(Post,on_delete=models.CASCADE)

class disLike(models.Model):
   user = models.ForeignKey(User,on_delete=models.CASCADE)
   post = models.ForeignKey(Post,on_delete=models.CASCADE)



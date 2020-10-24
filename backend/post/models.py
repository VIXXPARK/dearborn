from django.db import models
from usermanagement.models import User
from backend.settings.base import MEDIA_URL
import os
from django.dispatch import receiver

def _delete_file(path):
   if os.path.isfile(path):
      os.remove(path)

def postUpload_to(instance,filename):
   return 'thumb/{0}/{1}/{2}'.format(instance.user,instance.id,filename)

class Post(models.Model):
   title = models.CharField(max_length=500)
   content = models.TextField()
   updated_dt = models.DateTimeField(auto_now_add=True)
   user = models.ForeignKey(User,on_delete=models.CASCADE)
   thumbnail = models.ImageField(upload_to=postUpload_to,null=True)
   view = models.IntegerField(default=0)
   scope = models.IntegerField(default=0)
   sell = models.IntegerField(default=0)
   category = models.IntegerField(default=None)
   expire_dt = models.DateTimeField()
   is_repo = models.BooleanField(default=False)
   bidPrice = models.IntegerField()
   sellPrice = models.IntegerField()

   def get_id(self):
      return self.id
   
   def get_view(self):
      return self.view

@receiver(models.signals.post_delete, sender=Post)
def delete_file(sender,instance,*args,**kwargs):
   if instance.thumbnail:
      _delete_file(instance.thumbnail.path)

def postImageUpload_to(instance,filename):
   return 'images/{0}/{1}/{2}'.format(instance.user,instance.post,filename)
     
class PostImage(models.Model):
   post = models.ForeignKey(Post, on_delete=models.CASCADE)
   image = models.ImageField(upload_to=postImageUpload_to)
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


class vote(models.Model):
   user = models.ForeignKey(User,on_delete=models.CASCADE)
   post = models.ForeignKey(Post,on_delete=models.CASCADE)

class myWork(models.Model):
   post = models.ForeignKey(Post,on_delete=models.CASCADE)
   user = models.ForeignKey(User,on_delete=models.CASCADE)
   def get_post(self):
      return self.post
from django.db import models
from .user import User
from dearbornConfig.settings.base import MEDIA_URL
import os
from django.dispatch import receiver
import uuid
def _delete_file(path):
   if os.path.isfile(path):
      os.remove(path)

def postUpload_to(instance,filename):
   return 'thumb/{0}/{1}/{2}'.format(instance.user.id,instance.id,filename)

class Post(models.Model):
   id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
   title = models.CharField(max_length=500)
   content = models.TextField()
   updated_dt = models.DateTimeField(auto_now_add=True)
   user = models.ForeignKey(User,on_delete=models.CASCADE)
   thumbnail = models.ImageField(upload_to=postUpload_to,null=True)
   view = models.IntegerField(default=0)
   scope = models.IntegerField(default=0)
   category = models.IntegerField(default=None)
   score = models.FloatField(default=0)
   # expire_dt = models.DateTimeField()
   # is_repo = models.BooleanField(default=False)
   # bidPrice = models.IntegerField()
   # sellPrice = models.IntegerField()
   # sell = models.IntegerField(default=0)
   def get_id(self):
      return self.id
   
   def get_view(self):
      return self.view
   



@receiver(models.signals.post_delete, sender=Post)
def remove_file_from_s3(sender,instance,*args,**kwargs):
   instance.thumbnail.delete(save=False)

def postImageUpload_to(instance,filename):
   return 'images/{0}/{1}'.format(instance.post,filename)
     
class PostImage(models.Model):
   id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
   post = models.ForeignKey(Post, on_delete=models.CASCADE)
   image = models.ImageField(upload_to=postImageUpload_to)
   def get_image(self):
      return self.image


@receiver(models.signals.post_delete, sender=PostImage)
def remove_file_from_s3_image(sender,instance,*args,**kwargs):
   instance.image.delete(save=False)

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
      

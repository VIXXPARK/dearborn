from django.db import models
from usermanagement.models import User
from django.utils.timezone import now
import uuid
def contestUpload_to(instance,filename):
    return 'event/{0}/{1}/{2}'.format(instance.user,instance.id,filename)

def bannerUpload_to(instance,filename):
   return 'banner/{0}/{1}/{2}'.format(instance.user,instance.id,filename)

class Contest(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(default=None)
    updated_dt = models.DateTimeField(auto_now_add=True)
    contest_expire = models.DateTimeField()
    image = models.ImageField(upload_to=contestUpload_to)
    banner = models.ImageField(upload_to=bannerUpload_to,null=True)

def contestPostUpload_to(instance,filename):
   return 'contestPost/{0}/{1}/{2}'.format(instance.user,instance.id,filename)


class ContestPost(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    contest = models.ForeignKey(Contest,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    updated_dt = models.DateTimeField(auto_now_add=True)
    thumbnail = models.ImageField(upload_to=contestPostUpload_to)

def contestPostImageUpload_to(instance,filename):
   return 'contestImages/{0}/{1}'.format(instance.id,filename)


class ContestPostImage(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    contestPost = models.ForeignKey(ContestPost,on_delete=models.CASCADE)
    image = models.ImageField(upload_to=contestPostImageUpload_to)
    



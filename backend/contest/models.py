from django.db import models
from usermanagement.models import User
from django.utils.timezone import now

def contestUpload_to(instance,filename):
    return 'event/{0}/{1}/{2}'.format(instance.user,instance.title,filename)

def bannerUpload_to(instance,filename):
   return 'banner/{0}/{1}/{2}'.format(instance.user,instance.title,filename)

class Contest(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(default=None)
    updated_dt = models.DateTimeField(auto_now_add=True)
    contest_expire = models.DateTimeField()
    image = models.ImageField(upload_to=contestUpload_to)
    banner = models.ImageField(upload_to=bannerUpload_to,null=True)

def contestPostUpload_to(instance,filename):
   return 'contestPost/{0}/{1}/{2}'.format(instance.user,instance.contest,filename)


class ContestPost(models.Model):
    contest = models.ForeignKey(Contest,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    description = models.TextField(default=None)
    updated_dt = models.DateTimeField(auto_now_add=True)
    expire_dt = models.DateTimeField()
    thumbnail = models.ImageField(upload_to="contestPost/")

def contestPostImageUpload_to(instance,filename):
   return 'contestImages/{0}/{1}'.format(instance.contestPost,filename)


class ContestPostImage(models.Model):
    contestPost = models.ForeignKey(ContestPost,on_delete=models.CASCADE)
    image = models.ImageField(upload_to="contestImages/")
    



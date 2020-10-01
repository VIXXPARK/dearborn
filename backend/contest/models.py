from django.db import models
from usermanagement.models import User
from django.utils.timezone import now

class Contest(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(default=None)
    updated_dt = models.DateTimeField(auto_now_add=True)
    contest_expire = models.DateTimeField()
    image = models.ImageField(upload_to="event/")



class ContestPost(models.Model):
    contest = models.ForeignKey(Contest,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    description = models.TextField(default=None)
    updated_dt = models.DateTimeField(auto_now_add=True)
    expire_dt = models.DateTimeField()
    thumbnail = models.ImageField(upload_to="contestPost/")


class ContestPostImage(models.Model):
    contestPost = models.ForeignKey(ContestPost,on_delete=models.CASCADE)
    image = models.ImageField(upload_to="contestImages/")
    



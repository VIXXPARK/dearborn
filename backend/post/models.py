from django.db import models
from usermanagement.models import User
from backend.settings import MEDIA_URL

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

class PostImage(models.Model):
   post = models.ForeignKey(Post, on_delete=models.CASCADE)
   image = models.ImageField(upload_to="images/")
   def get_image(self):
      return self.image

class like(models.Model):
   user = models.ForeignKey(User,on_delete=models.CASCADE)
   post = models.ForeignKey(Post,on_delete=models.CASCADE)

class disLike(models.Model):
   user = models.ForeignKey(User,on_delete=models.CASCADE)
   post = models.ForeignKey(Post,on_delete=models.CASCADE)



from django.db import models
from usermanagement.models import User

class Post(models.Model):
   title = models.CharField(max_length=500)
   content = models.TextField()
   updated_dt = models.DateTimeField(auto_now_add=True)
   user = models.ForeignKey(User,on_delete=models.CASCADE)
<<<<<<< HEAD
   thumbnail = models.ImageField(upload_to="thumb/",null=True)
=======
   def get_id(slef):
      return self.id

>>>>>>> 88758c73ff6a058a18b586dd809a865324eb9b28
class PostImage(models.Model):
   post = models.ForeignKey(Post, on_delete=models.CASCADE)
   image = models.ImageField(upload_to="images/")
   def get_image(self):
      return self.image

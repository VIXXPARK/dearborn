from django.db import models
from .user import User
from .post import Post

class Comment(models.Model):
    contents = models.CharField(max_length=1000)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post,on_delete=models.CASCADE)
    score = models.FloatField(default=0)


from django.db import models
from .user import User
from .post import Post
class Assess(models.Model):
    design = models.FloatField(default = 0)
    color = models.FloatField(default = 0)
    individuality = models.FloatField(default = 0)
    practicality = models.FloatField(default = 0)
    trend = models.FloatField(default = 0)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    post = models.ForeignKey(Post,on_delete=models.CASCADE)


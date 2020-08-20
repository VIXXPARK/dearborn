from django.db import models
from usermanagement.models import User
from post.models import Post
class Assess(models.Model):
    aesthetics = models.PositiveIntegerField(default = 0)
    originality = models.PositiveIntegerField(default = 0)
    convienience = models.PositiveIntegerField(default = 0)
    massProductionPossibility = models.PositiveIntegerField(default = 0)
    popularity = models.PositiveIntegerField(default = 0)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    post = models.ForeignKey(Post,on_delete=models.CASCADE)

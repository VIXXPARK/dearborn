from django.db import models
from usermanagement.models import User
from post.models import Post

class BidInfo(models.Model):
    price = models.IntegerField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    updated_dt = models.TimeField(auto_now_add=True)
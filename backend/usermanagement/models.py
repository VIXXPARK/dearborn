from django.db import models
from django.contrib.auth.models import AbstractUser
from django_mysql.models import ListCharField

class User(AbstractUser):
    nickname = models.CharField(max_length=50)
    profileImage = models.ImageField(blank=True)
    token = models.CharField(max_length=1000)
    tokenExp = models.IntegerField(null=True)
    job = models.CharField(max_length=100)
    major = ListCharField(base_field=models.CharField(max_length=10),size=20,max_length=(11*20))
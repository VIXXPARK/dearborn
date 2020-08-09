from django.contrib.auth.models import AbstractUser
from django.db import models
from . import manager

class User(AbstractUser):
    JOB_CHOICES = (
        ('1','무관'),
        ('2','학생'),
        ('3','디자이너'),
    )
    MAJOR_CHOICES = (
        ('1','없음'),
        ('2','상의'),
        ('3','하의'),
        ('4','모자'),
        ('5','신발'),
        ('6','악세사리'),
    )
    nickname = models.CharField(max_length=50)
    profileImage = models.ImageField(blank=True)
    job = models.CharField(max_length=100,choices=JOB_CHOICES)
    major = models.CharField(max_length=20,choices=MAJOR_CHOICES)
    email = models.EmailField(('email address'), unique=True)
    is_active = models.BooleanField(default = True)
    is_admin = models.BooleanField(default = False)
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    object = manager.MyUserManager
        
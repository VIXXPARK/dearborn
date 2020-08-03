from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django_mysql.models import ListCharField

class Profile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    nickname = models.CharField(max_length=50)
    profileImage = models.ImageField(blank=True)
    token = models.CharField(max_length=1000)
    tokenExp = models.IntegerField()
    job = models.CharField(max_length=100)
    major = ListCharField(base_field=models.CharField(max_length=10),size=20,max_length=(11*20))

@receiver(post_save,sender=User)
def create_user_profile(sender,instance,created,**kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save,sender=User)
def save_user_profile(sender,instance,**kwargs):
    instance.profile.save()
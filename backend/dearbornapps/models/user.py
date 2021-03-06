from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ObjectDoesNotExist
from django.db import models, IntegrityError
from django.dispatch import receiver
from django.contrib.auth.base_user import BaseUserManager
import uuid
import django

class MyUserManager(BaseUserManager):
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        # try:
        email = self.normalize_email(email)
        user = User()
        user.set_email(email)
        user.set_extra(job = extra_fields['job'], nickname = extra_fields['nickname'], is_staff = extra_fields['is_staff'], is_superuser = extra_fields['is_superuser'])
        user.is_active = extra_fields['is_activate']
        user.content = extra_fields['content']
        user.profileImage = extra_fields['profileImage']
        user.set_password(password)
        user.save(using = self._db)
        return user
        # except IntegrityError:
            # raise IntegrityError

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        extra_fields.setdefault('is_activate', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_activate', True)
        extra_fields.setdefault('profileImage',None)
        extra_fields.setdefault('content', "hello")
        extra_fields.setdefault('job', 3)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff = True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser = True')
        
        return self._create_user(email, password, **extra_fields)

def profileUploadTo(instance, filename):
    return 'profileImage/{0}/{1}'.format(instance.id,filename)

class User(AbstractUser):
    def make_uuid():
        return str(uuid.uuid4())
            
    id = models.CharField(editable=False, max_length=36, db_index=True, unique=True, default=make_uuid, primary_key=True)
    nickname = models.CharField(max_length=50, unique=True)
    profileImage = models.ImageField(blank=True, upload_to=profileUploadTo,null=True, default=None)
    job = models.IntegerField()
    email = models.EmailField(unique=True)
    content = models.TextField(max_length=1000)
    rankData = models.IntegerField(null=True,default=1)
    now_updating = models.BooleanField(default=False)
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nickname']
    objects = MyUserManager
    object = MyUserManager()

    def set_email(self, email):
        self.email = email

    def get_id(self):
        return self.id

    def set_extra(self, **extra_fields):
        self.is_staff = extra_fields['is_staff']
        self.is_superuser = extra_fields['is_superuser']
        self.job = extra_fields['job']
        self.nickname = extra_fields['nickname']
    
    class Meta:
        ordering = ['nickname']

@receiver(models.signals.post_delete, sender=User)
def remove_file_from_s3(sender,instance,*args,**kwargs):
    instance.profileImage.delete(save=False)

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from backend import settings

class MyUserManager(BaseUserManager):
    use_in_migrations = True
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = User()
        user.set_email(email)
        user.set_nickname(extra_fields['nickname'])
        user.set_major(extra_fields['major'])
        user.set_job(extra_fields['job'])
        user.set_password(password)
        user.save(using = self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff = True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser = True')
        return self._create_user(email, password, **extra_fields)


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
    email = models.EmailField(unique=True)
    username = None
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = MyUserManager

    def set_email(self, email):
        self.email = email

    def set_major(self, major):
        self.major = major

    def set_job(self, job):
        self.job = job

    def set_nickname(self, nickname):
        self.nickname = nickname

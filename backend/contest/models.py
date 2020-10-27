from django.db import models
from usermanagement.models import User
from django.utils.timezone import now
import uuid
def contestUpload_to(instance,filename):
    return 'event/{0}/{1}/{2}'.format(instance.user,instance.id,filename)

def bannerUpload_to(instance,filename):
   return 'banner/{0}/{1}/{2}'.format(instance.user,instance.id,filename)

class Contest(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(default=None)
    updated_dt = models.DateTimeField(auto_now_add=True)
    contest_expire = models.DateTimeField()
    image = models.ImageField(upload_to=contestUpload_to)
    banner = models.ImageField(upload_to=bannerUpload_to,null=True)


    



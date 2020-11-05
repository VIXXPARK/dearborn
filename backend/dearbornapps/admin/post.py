from django.contrib import admin
from dearbornapps.models import Post,PostImage,like,disLike,vote, myWork
admin.site.register(Post)
admin.site.register(PostImage)
admin.site.register(like)
admin.site.register(disLike)
admin.site.register(vote)
admin.site.register(myWork)

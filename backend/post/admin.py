from django.contrib import admin
from .models import Post,PostImage,like,disLike,vote
admin.site.register(Post)
admin.site.register(PostImage)
admin.site.register(like)
admin.site.register(disLike)
admin.site.register(vote)





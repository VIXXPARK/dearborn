from django.contrib import admin
from django.urls import path,include
from dearbornapps.views import extraction
urlpatterns = [
    path('feature/getCategory', extraction.getCategory),
    path('feature/selectFilter', extraction.selectFilter),
    path('feature/saveType', extraction.saveTasteInfo),
    path('feature/recommend', extraction.recommend),
]
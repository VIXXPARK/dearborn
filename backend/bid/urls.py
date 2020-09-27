from .views import BidViewSet
from django.urls import path,include
from rest_framework.routers import DefaultRouter
router = DefaultRouter()

save_bid = BidViewSet.as_view({"post":"create"})

urlpatterns = [
    path('bid/saveBid',save_bid,name="saveBid"),
]

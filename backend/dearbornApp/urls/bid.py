from dearbornApp.views.bid import BidViewSet, GetBid
from django.urls import path,include
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
saveBid = BidViewSet.as_view({"post" : "create"})

urlpatterns = [
    path('bid/setBid',saveBid),
    path('info/getBid/',GetBid),
]

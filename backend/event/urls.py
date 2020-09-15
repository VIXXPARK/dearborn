from .views import EventViewSet,EventPostViewSet
from django.urls import path,include
event_list = EventViewSet.as_view({"get":"list","post":"create"})
event_detail = EventViewSet.as_view(
    {"get":"retrieve","patch":"partial_update","delete":"destroy"}
)
eventPost_list = EventPostViewSet.as_view({"get":"list","post":"create"})
eventPost_detail = EventPostViewSet.as_view(
    {"get":"retrieve","patch":"partial_update","delete":"destroy"}
)

urlpatterns = [
    path('event/uploadPost',event_list,name="event_list"),
    path('event/<int:pk>',event_detail,name="event_detail"),
    path('eventPost/uploadPost',eventPost_list,name="eventPost_list"),
    path('eventPost/<int:pk>',eventPost_detail,name="eventPost_detail"),
]
from django.urls import include, path
from rest_framework import routers

from photobank import views

router = routers.DefaultRouter()
router.register(r'photos', views.PhotoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

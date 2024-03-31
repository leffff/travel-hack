from django.urls import include, path
from rest_framework import routers

from photobank import views
from photobank.admin.recover_view import RecoverView

router = routers.DefaultRouter()
router.register(r'photos', views.PhotoViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('deleted/recover/<int:pk>/', RecoverView.as_view(), name='photobank_deleted_modeladmin_recover'),
]

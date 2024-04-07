from django.urls import include, path
from rest_framework import routers

from photobank import views
from photobank.admin.hide_view import HideView
from photobank.admin.home import PhotobankHomeView
from photobank.admin.multiple_edit_view import PhotoMultipleEditView
from photobank.admin.recover_view import RecoverView
from photobank.admin.add_view import PhotoAddView

router = routers.DefaultRouter()
router.register(r'photos', views.PhotoViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('admin/photobank/hidden/recover/<int:pk>/', RecoverView.as_view(), name='photobank_hidden_modeladmin_recover'),
    path('admin/photobank/photos/hide/<int:pk>/', HideView.as_view(), name='photobank_photos_modeladmin_hide'),
    path('admin/photobank/photos/multiple/<int:pk>', PhotoMultipleEditView.as_view(),
         name='photobank_photos_modeladmin_multiple_edit'),
    path('admin/photobank/photos/create_new/', PhotoAddView.as_view(), name='photobank_photos_modeladmin_create_new'),
    path('admin/', PhotobankHomeView.as_view(), name='photobank_home'),
]

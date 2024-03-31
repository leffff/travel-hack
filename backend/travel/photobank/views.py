from rest_framework import viewsets

from photobank.models import Photo
from photobank.serializers import PhotoSerializer


class PhotoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Photo.objects.filter(deleted=False)
    serializer_class = PhotoSerializer

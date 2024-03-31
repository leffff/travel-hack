from rest_framework import serializers

from photobank.models import Photo


class PhotoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Photo
        fields = ['id', 'title', 'width', 'height', 'created_at', 'status', 'file', 'file_size']

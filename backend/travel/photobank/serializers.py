from rest_framework import serializers

from photobank.models import Photo


class PhotoSerializer(serializers.ModelSerializer):

    rendition_url = serializers.SerializerMethodField(source='get_rendition_url')

    class Meta:
        model = Photo
        fields = ['id', 'title', 'width', 'height', 'created_at', 'status', 'file', 'file_size', 'rendition_url']

    def get_rendition_url(self, obj: Photo):
        url = obj.get_rendition('fill-1536x1536|jpegquality-60').url
        return url

import uuid
from functools import cached_property

from django.conf import settings
from django.http import HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from taggit.models import Tag

from photobank.models import Photo
from photobank.serializers import PhotoSerializer
from photobank.utils import BUCKET, S3_CLIENT, S3_PREFIX, S3_BUCKET_URL_PREFIX
from tools.clients.retriever import RetrieverClient

from rest_framework.authentication import SessionAuthentication


class CsrfExemptSessionAuthentication(SessionAuthentication):

    def enforce_csrf(self, request):
        return  # To not perform the csrf check previously happening


class PhotoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Photo.objects.filter(hidden=False)
    serializer_class = PhotoSerializer
    authentication_classes = (CsrfExemptSessionAuthentication,)

    @cached_property
    def retriever_client(self) -> RetrieverClient:
        return RetrieverClient(settings.YAML_CONFIG['retriever']['host'])

    @action(detail=False, methods=['GET'], name='Get photos by query', url_path='query')
    def query(self, request: Request):
        text = request.query_params.get('text')
        tags = request.query_params.get('tags')
        filters = dict()
        if orientation := request.query_params.get('orientation'):
            filters['orientation_filter'] = orientation
        if extension := request.query_params.get('extension'):
            filters['extension_filter'] = extension
        if daytime_filter := request.query_params.get('daytime'):
            filters['daytime_filter'] = daytime_filter
        if season_filter := request.query_params.get('season'):
            filters['season_filter'] = season_filter
        if text is None and tags is None and not filters:
            return HttpResponseBadRequest('Either img_url or text/tags/filters must be provided')
        data = self.retriever_client.query(text=text, tags=tags, filters=filters or None)
        objects = Photo.objects.in_bulk(data.ids, field_name='id')
        sorted_objects = [objects[id] for id in data.ids]
        serializer = self.get_serializer(sorted_objects, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], name='Find tags', url_path='tags')
    def find_tags(self, request: Request):
        query = request.query_params.get('query', '')
        limit = int(request.query_params.get('limit', 10))
        queryset = Tag.objects.filter(name__startswith=query)
        cnt = queryset.count()
        tags = queryset.values_list('name', flat=True)[:limit]
        return Response({'tags': tags, 'count': cnt})

    @csrf_exempt
    @action(detail=False, methods=['POST'], name='Find picture', url_path='picture')
    def find_picture(self, request: Request):
        file_obj = request.FILES['file']
        key = '/'.join((S3_PREFIX, 'tmp', uuid.uuid4().hex + '-' + file_obj.name))
        print(key)
        S3_CLIENT.upload_fileobj(file_obj, BUCKET, key)
        data = self.retriever_client.query(img_url=S3_BUCKET_URL_PREFIX + key)
        objects = Photo.objects.in_bulk(data.ids, field_name='id')
        sorted_objects = [objects[id] for id in data.ids]
        serializer = self.get_serializer(sorted_objects, many=True)
        return Response(serializer.data)

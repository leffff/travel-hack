from functools import cached_property

import boto3
from celery import Task
from django.conf import settings

from photobank.models import Photo
from tools.clients.retriever import RetrieverClient
from tools.clients.superresolution import SuperResolutionClient
from travel import celery_app


class ProcessPhotoTask(Task):
    name = 'tasks.ProcessPhotoTask'
    max_retries = 5
    default_retry_delay = 5

    @cached_property
    def s3_client(self):
        return boto3.client(
            's3',
            aws_access_key_id=settings.STORAGES['default']['OPTIONS']['access_key'],
            aws_secret_access_key=settings.STORAGES['default']['OPTIONS']['secret_key'],
            endpoint_url=settings.STORAGES['default']['OPTIONS']['endpoint_url'],
        )

    def get_upload_presigned_data(self, key: str) -> dict:
        prefix = settings.STORAGES['default']['OPTIONS']['location']
        key = '/'.join((prefix, key))
        bucket = settings.STORAGES['default']['OPTIONS']['bucket_name']
        return self.s3_client.generate_presigned_post(bucket, key, ExpiresIn=30 * 60)

    @cached_property
    def superresolution_client(self) -> SuperResolutionClient:
        return SuperResolutionClient(settings.YAML_CONFIG['superresolution']['host'])

    def proceed_superresolution(self, photo: Photo) -> None:
        source = photo.file.url
        key = '/'.join(('superresolution', photo.filename))
        presigned_post = self.get_upload_presigned_data(key)
        data = self.superresolution_client.proceed(source, presigned_post)
        photo.width = data.width
        photo.height = data.height
        photo.file_size = data.size
        photo.file = key
        photo.file_hash = data.hash
        photo.save(update_fields=('width', 'height', 'file_size', 'file', 'file_hash'))

    @cached_property
    def retriever_client(self) -> RetrieverClient:
        return RetrieverClient(settings.YAML_CONFIG['retriever']['host'])

    def retriever_add(self, photo: Photo) -> None:
        data = self.retriever_client.add(photo.id, photo.file.url, photo.title)
        photo.orientation = data.orientation
        photo.extension = data.extension
        photo.daytime = data.daytime
        photo.season = data.season
        photo.tags.set(data.tags)
        photo.is_duplicate = bool(data.duplicates)
        photo.save()

    def run(self, photo_pk: int) -> None:
        photo = Photo.objects.get(pk=photo_pk)
        photo.status = Photo.PhotoStatus.IN_PROGRESS
        photo.save(update_fields=('status',))

        if photo.superresolution:
            self.proceed_superresolution(photo)

        self.retriever_add(photo)

        photo.status = Photo.PhotoStatus.READY
        photo.save(update_fields=('status',))


celery_app.register_task(ProcessPhotoTask())

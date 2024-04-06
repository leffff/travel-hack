from celery import Task

from photobank.models import Photo
from travel import celery_app


class ProcessPhotoTask(Task):
    name = 'tasks.ProcessPhotoTask'
    max_retries = 5
    default_retry_delay = 5

    def run(self, photo_pk: int) -> None:
        photo = Photo.objects.get(pk=photo_pk)
        photo.status = Photo.PhotoStatus.IN_PROGRESS
        photo.save(update_fields=('status',))

        # TODO: взаимодействия с api


celery_app.register_task(ProcessPhotoTask())

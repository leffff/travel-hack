from django.db.models.signals import post_save
from django.dispatch import receiver

from photobank.models import Photo
from photobank.tasks import ProcessPhotoTask


@receiver(post_save, sender=Photo)
def custom_action_after_image_upload(instance: Photo, **kwargs) -> None:
    if instance.status == Photo.PhotoStatus.NEW:
        ProcessPhotoTask().apply_async(kwargs={'photo_pk': instance.id})

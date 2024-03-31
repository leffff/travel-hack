from django.db import models

from wagtail.images.models import Image, AbstractImage, AbstractRendition


class Photo(AbstractImage):
    class PhotoStatus(models.TextChoices):
        NEW = 'NEW'
        IN_PROGRESS = 'INP'
        READY = 'RED'
        DELETED = 'DEL'

    status = models.CharField(max_length=3, choices=PhotoStatus, default=PhotoStatus.NEW)
    deleted = models.BooleanField(default=False)

    # admin_form_fields = tuple(filter(lambda item: item not in ('tags', ),
    #                                  Image.admin_form_fields))
    admin_form_fields = Image.admin_form_fields

    def delete(self, *args, **kwargs):
        self.deleted = True
        # TODO: delete in clickhouse
        self.save(update_fields=('deleted', ))


class PhotoRendition(AbstractRendition):
    image = models.ForeignKey(Photo, on_delete=models.CASCADE, related_name='renditions')

    class Meta:
        unique_together = (
            ('image', 'filter_spec', 'focal_point_key'),
        )

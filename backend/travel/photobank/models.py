from django.db import models
from django.utils.translation import gettext as _

from wagtail.images.models import Image, AbstractImage, AbstractRendition


class Photo(AbstractImage):
    class Meta:
        verbose_name = _('Photo')
        verbose_name_plural = _('Photos')

    class PhotoStatus(models.TextChoices):
        NEW = 'NEW'
        IN_PROGRESS = 'INP'
        READY = 'RED'

    status = models.CharField(max_length=3, choices=PhotoStatus, default=PhotoStatus.NEW)
    deleted = models.BooleanField(default=False)

    def delete(self, *args, **kwargs):
        self.deleted = True
        # TODO: delete in clickhouse
        self.save(update_fields=('deleted', ))

    def recover(self):
        self.deleted = False
        # TODO: recover in clickhouse
        self.save(update_fields=('deleted', ))


class PhotoRendition(AbstractRendition):
    image = models.ForeignKey(Photo, on_delete=models.CASCADE, related_name='renditions')

    class Meta:
        unique_together = (
            ('image', 'filter_spec', 'focal_point_key'),
        )

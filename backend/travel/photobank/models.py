import uuid

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
    hidden = models.BooleanField(default=False)

    admin_form_fields = ('title', 'file')

    def hide(self) -> None:
        self.hidden = True
        # TODO: delete in clickhouse
        self.save(update_fields=('hidden', ))

    def recover(self) -> None:
        self.hidden = False
        # TODO: recover in clickhouse
        self.save(update_fields=('hidden', ))

    def get_upload_to(self, filename: str) -> str:
        parts = filename.rsplit('.', 1) or ['']
        ext = parts[-1]
        return super().get_upload_to(uuid.uuid4().hex + '.' + ext)

    def delete(self, *args, **kwargs) -> None:
        # TODO: delete in clickhouse
        super().delete()


class PhotoRendition(AbstractRendition):
    image = models.ForeignKey(Photo, on_delete=models.CASCADE, related_name='renditions')

    class Meta:
        unique_together = (
            ('image', 'filter_spec', 'focal_point_key'),
        )

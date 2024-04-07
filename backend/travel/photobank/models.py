import uuid

from django.db import models
from django.utils.translation import gettext as _
from wagtail.images.models import Image, AbstractImage, AbstractRendition

from photobank.utils import RETRIEVER_CLIENT


class Photo(AbstractImage):
    class Meta:
        verbose_name = _('Photo')
        verbose_name_plural = _('Photos')

    class PhotoStatus(models.TextChoices):
        NEW = 'NEW', _('New')
        WAIT_PROCESSING = 'WPR', _('Wait processing')
        IN_PROGRESS = 'INP', _('In progress')
        READY = 'RED', _('Ready')
        FAIL = 'FAL', _('Fail')

    class Season(models.TextChoices):
        WINTER = 'зима', _('Winter')
        SPRING = 'весна', _('Spring')
        SUMMER = 'лето', _('Summer')
        FALL = 'осень', _('Fall')

    class Daytime(models.TextChoices):
        NIGHT = 'ночь', _('Night')
        MORNING = 'утро', _('Morning')
        DAY = 'день', _('Day')
        EVENING = 'вечер', _('Evening')

    status = models.CharField(max_length=3, choices=PhotoStatus, default=PhotoStatus.NEW)
    hidden = models.BooleanField(default=False)
    superresolution = models.BooleanField(default=False, verbose_name=_('Improve quality'))
    is_duplicate = models.BooleanField(default=False, verbose_name=_('Duplicate'))
    orientation = models.CharField(max_length=16, null=True)
    extension = models.CharField(max_length=8, null=True)
    daytime = models.CharField(max_length=16, choices=Daytime, null=True)
    season = models.CharField(max_length=16, choices=Season, null=True)

    admin_form_fields = ('title', 'file', 'superresolution')

    def hide(self) -> None:
        self.hidden = True
        RETRIEVER_CLIENT.hide(self.id)
        self.save(update_fields=('hidden',))

    def get_upload_to(self, filename: str) -> str:
        parts = filename.rsplit('.', 1) or ['']
        ext = parts[-1]
        return super().get_upload_to(uuid.uuid4().hex + '.' + ext)


class PhotoRendition(AbstractRendition):
    image = models.ForeignKey(Photo, on_delete=models.CASCADE, related_name='renditions')

    class Meta:
        unique_together = (
            ('image', 'filter_spec', 'focal_point_key'),
        )

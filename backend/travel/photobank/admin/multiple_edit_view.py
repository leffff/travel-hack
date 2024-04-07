from django.db import transaction
from wagtail.images.views.multiple import EditView

from photobank.models import Photo


class PhotoMultipleEditView(EditView):
    edit_object_url_name = 'photobank_photos_modeladmin_multiple_edit'
    pk_url_kwarg = 'pk'

    def save_object(self, form):
        with transaction.atomic():
            form.save()
            self.object.status = Photo.PhotoStatus.WAIT_PROCESSING
            self.object.save(update_fields=('status',))

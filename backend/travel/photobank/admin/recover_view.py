from django.db import transaction
from django.utils.translation import gettext_lazy
from django.utils.translation import gettext as _
from wagtail.admin.views.generic import DeleteView

from photobank.models import Photo


class RecoverView(DeleteView):
    model = Photo
    page_title = _("Recover Photo")
    index_url_name = 'photobank_photos_modeladmin_index'
    delete_url_name = 'photobank_deleted_modeladmin_recover'
    success_url = 'photobank_photos_modeladmin_list'
    success_message = gettext_lazy("%(model_name)s '%(object)s' recovered.")
    template_name = 'photobank/recover_photo_view.html'

    def delete_action(self):
        """Переопределяем delete action под recover"""
        with transaction.atomic():
            self.object.recover()

    @property
    def confirmation_message(self):
        return _("Are you sure you want to recover this %(model_name)s?") % {
            "model_name": self.object._meta.verbose_name
        }
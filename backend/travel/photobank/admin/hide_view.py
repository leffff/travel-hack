from django.db import transaction
from django.utils.translation import gettext_lazy
from django.utils.translation import gettext as _
from wagtail.admin.views.generic import DeleteView

from photobank.models import Photo


class HideView(DeleteView):
    model = Photo
    page_title = _("Hide Photo")
    index_url_name = 'photobank_photos_modeladmin_index'
    delete_url_name = 'photobank_hidden_modeladmin_hide'
    success_url = 'photobank_photos_modeladmin_list'
    success_message = gettext_lazy("%(model_name)s '%(object)s' was hidden.")
    template_name = 'hide_photo_view.html'

    def delete_action(self):
        """Переопределяем delete action под hide"""
        with transaction.atomic():
            self.object.hide()

    @property
    def confirmation_message(self):
        return _("Are you sure you want to hide this %(model_name)s?") % {
            "model_name": self.object._meta.verbose_name
        }

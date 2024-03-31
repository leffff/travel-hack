from wagtail_modeladmin.helpers import ButtonHelper
from wagtail_modeladmin.views import IndexView
from django.contrib.admin.utils import quote
from django.utils.translation import gettext as _


class BasePhotoAdminIndexView(IndexView):
    pass


class PhotoAdminIndexView(BasePhotoAdminIndexView):
    page_title = _('Actual photobank')


class DeletedPhotoAdminIndexView(BasePhotoAdminIndexView):
    page_title = _('Удаленные фотографии')


class BaseButtonHelper(ButtonHelper):
    pass


class DeletedViewButtonHelper(BaseButtonHelper):
    delete_button_classnames = ["warning"]

    def add_button(self, classnames_add=None, classnames_exclude=None):
        return None

    def edit_button(self, pk, classnames_add=None, classnames_exclude=None):
        return None

    def delete_button(self, pk, classnames_add=None, classnames_exclude=None):
        default = super().delete_button(pk, classnames_add, classnames_exclude)
        default.update({
            "url": self.url_helper.get_action_url("delete", quote(pk)),  # TODO: recover
            "label": _("Recover"),
            "title": _("Recover %(object)s") % {"object": self.verbose_name},
        })
        return default
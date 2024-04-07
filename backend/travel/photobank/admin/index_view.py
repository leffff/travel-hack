from wagtail_modeladmin.helpers import ButtonHelper
from wagtail_modeladmin.views import IndexView
from django.contrib.admin.utils import quote
from django.utils.translation import gettext as _


class BasePhotoAdminIndexView(IndexView):
    pass


class PhotoAdminIndexView(BasePhotoAdminIndexView):
    page_title = _('Actual photobank')


class HiddenPhotoAdminIndexView(BasePhotoAdminIndexView):
    page_title = _('Hidden photos')


class BaseButtonHelper(ButtonHelper):
    pass


class IndexViewButtonHelper(BaseButtonHelper):
    def add_button(self, classnames_add=None, classnames_exclude=None):
        default = super().add_button()
        default['url'] = self.url_helper.get_action_url('create_new')
        return default

    def delete_button(self, pk, classnames_add=None, classnames_exclude=None):
        # Переопределяем delete-action на hide
        default = super().delete_button(pk, classnames_add, classnames_exclude)
        default.update({
            "url": self.url_helper.get_action_url("hide", quote(pk)),
            "label": _("Hide"),
            "title": _("Hide %(object)s") % {"object": self.verbose_name},
        })
        return default


class HiddenViewButtonHelper(BaseButtonHelper):
    def add_button(self, classnames_add=None, classnames_exclude=None):
        return None

    def edit_button(self, pk, classnames_add=None, classnames_exclude=None):
        return None

from functools import cached_property

from django.forms.utils import flatatt
from django.templatetags.static import static
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.utils.translation import gettext as _
from wagtail import hooks
from wagtail.admin.panels import FieldPanel, FieldRowPanel, MultiFieldPanel, Panel
from wagtail.images.shortcuts import get_rendition_or_not_found
from wagtail_modeladmin.mixins import ThumbnailMixin
from wagtail_modeladmin.options import ModelAdmin, ModelAdminGroup, modeladmin_register

from photobank.admin.index_view import (
    HiddenViewButtonHelper, IndexViewButtonHelper, PhotoAdminIndexView,
    HiddenPhotoAdminIndexView,
)
from photobank.models import Photo
from photobank.utils import human_size

ENABLED_MENU_ITEMS = ('photos',)


class ReadOnlyPanel(FieldPanel):
    def __init__(self, *args, **kwargs):
        kwargs['read_only'] = True
        super().__init__(*args, **kwargs)


class ImageDisplayPanel(ReadOnlyPanel):
    class BoundPanel(Panel.BoundPanel):

        def render_html(
                self,
                parent_context: "Optional[RenderContext]" = None,
        ) -> "SafeString":
            if self.instance is not None:
                return get_rendition_or_not_found(self.instance, 'original').img_tag()


class HumanSizePanel(ReadOnlyPanel):
    class BoundPanel(FieldPanel.BoundPanel):
        @cached_property
        def value_from_instance(self) -> str:
            return human_size(super().value_from_instance)


class MappingPanel(FieldPanel):
    class BoundPanel(FieldPanel.BoundPanel):
        MAPPING: dict

        @cached_property
        def value_from_instance(self) -> str:
            return self.MAPPING[super().value_from_instance]


class BasePhotoAdmin(ThumbnailMixin, ModelAdmin):
    model = Photo
    menu_icon = 'image'
    list_display = ('admin_thumb', 'title', 'display_tags', 'created_at')
    thumb_image_width = 60
    list_display_add_buttons = 'title'
    ordering = ('-created_at',)
    list_filter = ('tags',)

    def admin_thumb(self, obj):
        # hacked version of ThumbnailMixin.admin_thumb but image=obj
        img_attrs = {
            'src': self.thumb_default,
            'width': self.thumb_image_width,
            'class': self.thumb_classname,
        }
        # try to get a rendition of the image to use
        spec = self.thumb_image_filter_spec
        rendition = get_rendition_or_not_found(obj, spec)
        img_attrs.update({'src': rendition.url})
        return mark_safe('<img{}>'.format(flatatt(img_attrs)))

    def display_tags(self, obj):
        return format_html(', '.join([tag.name for tag in obj.tags.all()]) or '–')

    display_tags.short_description = _('Tags')

    panels = [
        MultiFieldPanel(
            (
                FieldPanel('title'),
                ReadOnlyPanel('status', heading=_('Status')),
                FieldPanel('tags'),
                ReadOnlyPanel('created_at'),
                ReadOnlyPanel('hidden'),
                ReadOnlyPanel('superresolution', heading=_('Improved quality')),
            ),
            classname='col6',
        ),
        MultiFieldPanel(
            (
                ImageDisplayPanel('file', classname='col6'),
                FieldRowPanel(children=(
                    HumanSizePanel('file_size', heading=_('File size')),
                    ReadOnlyPanel('width'),
                    ReadOnlyPanel('height'),
                ), classname='col6'),
                ReadOnlyPanel('orientation', classname='col6'),
                ReadOnlyPanel('extension', classname='col6'),
                FieldPanel('season', classname='col6'),
                FieldPanel('daytime', classname='col6'),
            ),
        )
    ]


class PhotoAdmin(BasePhotoAdmin):
    menu_label = _('Actual photobank')
    menu_item_name = 'photos'
    index_view_class = PhotoAdminIndexView
    base_url_path = 'photobank/photos'
    button_helper_class = IndexViewButtonHelper

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(hidden=False)


class HiddenPhotoAdmin(BasePhotoAdmin):
    menu_label = _('Hidden photos')
    menu_item_name = 'hidden_photos'
    index_view_class = HiddenPhotoAdminIndexView
    base_url_path = 'photobank/hidden'
    button_helper_class = HiddenViewButtonHelper

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(hidden=True)


class PhotoGroupAdmin(ModelAdminGroup):
    items = (PhotoAdmin, HiddenPhotoAdmin)
    menu_label = _('Photobank')
    menu_item_name = 'photos'


modeladmin_register(PhotoGroupAdmin)


@hooks.register('construct_main_menu')
def hide_menu_items(request, menu_items):
    menu_items[:] = [item for item in menu_items if item.name in ENABLED_MENU_ITEMS]


@hooks.register('insert_global_admin_css')
def global_admin_css():
    return format_html('<link rel="stylesheet" href="{}">', static('photobank_wagtail_theme.css'))

from functools import cached_property

from django.forms.utils import flatatt
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.utils.translation import gettext as _
from wagtail import hooks
from wagtail.admin.panels import FieldPanel, FieldRowPanel, MultiFieldPanel, Panel
from wagtail.images.shortcuts import get_rendition_or_not_found
from wagtail_modeladmin.mixins import ThumbnailMixin
from wagtail_modeladmin.options import ModelAdmin, ModelAdminGroup, modeladmin_register

from photobank.admin.index_view import DeletedViewButtonHelper, PhotoAdminIndexView, DeletedPhotoAdminIndexView
from photobank.admin.edit_view import DeletedPhotoEditView, PhotoEditView
from photobank.models import Photo
from photobank.utils import human_size

ENABLED_MENU_ITEMS = ('images', 'photos')


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
            return get_rendition_or_not_found(self.instance, 'original').img_tag()


class HumanSizePanel(ReadOnlyPanel):
    class BoundPanel(FieldPanel.BoundPanel):
        @cached_property
        def value_from_instance(self) -> str:
            return human_size(super().value_from_instance)


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
        # Assuming `tags` is a ManyToManyField or similar in your model
        return format_html(', '.join([tag.name for tag in obj.tags.all()]) or '–')

    display_tags.short_description = _('Tags')

    panels = [
        MultiFieldPanel(
            (
                FieldPanel('title'),
                FieldPanel('tags'),
                ReadOnlyPanel('created_at'),
                ReadOnlyPanel('deleted'),
            ),
            classname='col6',
        ),
        MultiFieldPanel(
            (
                ImageDisplayPanel('file', classname='col6'),
                FieldRowPanel(children=(
                    HumanSizePanel('file_size'),
                    ReadOnlyPanel('width'),
                    ReadOnlyPanel('height'),
                ), classname='col6'),
            ),
        )
    ]


class PhotoAdmin(BasePhotoAdmin):
    menu_label = _('Actual photobank')
    menu_item_name = 'photos'
    index_view_class = PhotoAdminIndexView
    edit_view_class = PhotoEditView
    base_url_path = 'photobank/photos'

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(deleted=False)


class DeletedPhotoAdmin(BasePhotoAdmin):
    menu_label = _('Deleted photos')
    menu_item_name = 'deleted_photos'
    index_view_class = DeletedPhotoAdminIndexView
    edit_view_class = DeletedPhotoEditView
    base_url_path = 'photobank/deleted'
    button_helper_class = DeletedViewButtonHelper

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(deleted=True)


class PhotoGroupAdmin(ModelAdminGroup):
    items = (PhotoAdmin, DeletedPhotoAdmin)
    menu_label = _('Photobank')
    menu_item_name = 'photos'


modeladmin_register(PhotoGroupAdmin)


@hooks.register('construct_main_menu')
def hide_menu_items(request, menu_items):
    menu_items[:] = [item for item in menu_items if item.name in ENABLED_MENU_ITEMS]

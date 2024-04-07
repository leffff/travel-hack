from wagtail.images.views.multiple import AddView

MAX_RESOLUTION_PER_AXIS = 512


class PhotoAddView(AddView):
    edit_object_url_name = 'photobank_photos_modeladmin_multiple_edit'

    def get_edit_form_class(self):
        BaseFormClass = super().get_edit_form_class()  # noqa

        extra_exclude = list(BaseFormClass.Meta.exclude)
        if self.object.width > MAX_RESOLUTION_PER_AXIS or self.object.height > MAX_RESOLUTION_PER_AXIS:
            extra_exclude.append('superresolution')

        class Form(BaseFormClass):
            class Meta(BaseFormClass.Meta):
                model = self.model
                exclude = tuple(extra_exclude)

        return Form

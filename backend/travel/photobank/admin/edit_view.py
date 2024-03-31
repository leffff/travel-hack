
from wagtail_modeladmin.views import EditView

from photobank.models import Photo


class BasePhotoEditView(EditView):
    # model_admin = Photo
    pass


class PhotoEditView(BasePhotoEditView):
    pass


class DeletedPhotoEditView(BasePhotoEditView):
    pass

from wagtail.admin.navigation import get_site_for_user
from wagtail.admin.site_summary import SiteSummaryPanel
from wagtail.admin.views.home import HomeView
from wagtail.images.wagtail_hooks import SummaryItem

from photobank.models import Photo


class PhotobankHomeView(HomeView):
    def get_panels(self):
        return [Dashboard(self.request)]  # TODO PhotosPanel


class Dashboard(SiteSummaryPanel):
    def __init__(self, request):
        self.request = request
        self.summary_items = [PhotosSummary(self.request)]


class PhotosSummary(SummaryItem):
    template_name = 'photos_summary_item.html'

    def get_context_data(self, parent_context):
        site_name = get_site_for_user(self.request.user)["site_name"]

        return {
            "total_images": Photo.objects.filter(hidden=False).count(),
            "site_name": site_name,
        }

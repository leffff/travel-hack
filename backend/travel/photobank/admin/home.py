from wagtail.admin.views.home import HomeView


class PhotobankHomeView(HomeView):
    def get_panels(self):
        return []  # TODO PhotosPanel

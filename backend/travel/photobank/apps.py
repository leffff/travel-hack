from django.apps import AppConfig


class PhotobankConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'photobank'


    def ready(self):
        import photobank.signals
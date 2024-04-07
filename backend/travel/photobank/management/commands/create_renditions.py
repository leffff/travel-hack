from django.core.management import BaseCommand
from django.core.paginator import Paginator

from photobank.models import Photo


class Command(BaseCommand):
    help = 'Description of my custom command'

    def handle(self, *args, **options):
        i = 0
        for page in Paginator(Photo.objects.all(), 10):
            for photo in page:
                photo.get_rendition('fill-1536x1536|jpegquality-60')
                print(f'done {i}')
                i += 1

import boto3
from django.conf import settings
from django.utils.translation import gettext as _

from tools.clients.retriever import RetrieverClient

UNITS = (
    _('bytes'),
    _('KB'),
    _('MB'),
    _('GB'),
    _('TB'),
    _('PB'),
    _('EB'),
)


def human_size(bytes: int, unit_level: int = 0):
    """ Returns a human readable string representation of bytes """
    if bytes < 1024:
        return f'{bytes} {UNITS[unit_level]}'
    else:
        return human_size(bytes >> 10, unit_level + 1)


RETRIEVER_CLIENT = RetrieverClient(settings.YAML_CONFIG['retriever']['host'])
S3_CLIENT = boto3.client(
    's3',
    aws_access_key_id=settings.STORAGES['default']['OPTIONS']['access_key'],
    aws_secret_access_key=settings.STORAGES['default']['OPTIONS']['secret_key'],
    endpoint_url=settings.STORAGES['default']['OPTIONS']['endpoint_url'],
)
S3_PREFIX = settings.STORAGES['default']['OPTIONS']['location']
BUCKET = settings.STORAGES['default']['OPTIONS']['bucket_name']
S3_BUCKET_URL_PREFIX = f"{settings.STORAGES['default']['OPTIONS']['endpoint_url']}/{BUCKET}/"

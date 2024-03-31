from .base import *

DEBUG = False

SECRET_KEY = YAML_CONFIG['SECRET_KEY']['prod']

DATABASES = {
    'default': YAML_CONFIG['DATABASES']['prod'],
}

STORAGES['default']['OPTIONS'] = YAML_CONFIG['STORAGES']['S3']['prod']


try:
    from .local import *
except ImportError:
    pass

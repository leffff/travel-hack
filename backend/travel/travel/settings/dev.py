from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

SECRET_KEY = YAML_CONFIG['SECRET_KEY']['dev']

# SECURITY WARNING: define the correct hosts in production!
ALLOWED_HOSTS = ["*"]

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

DATABASES = {
    'default': YAML_CONFIG['DATABASES']['dev'],
}

STORAGES['default']['OPTIONS'] = YAML_CONFIG['STORAGES']['S3']['dev']

CELERY_BROKER_URL = YAML_CONFIG['celery']['dev']['CELERY_BROKER_URL']

try:
    from .local import *
except ImportError:
    pass

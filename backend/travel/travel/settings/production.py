from .base import *

DEBUG = False

SECRET_KEY = YAML_CONFIG['SECRET_KEY']['prod']

DATABASES = {
    'default': YAML_CONFIG['DATABASES']['prod'],
}

try:
    from .local import *
except ImportError:
    pass

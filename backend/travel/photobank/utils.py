from django.utils.translation import gettext as _

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

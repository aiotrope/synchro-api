from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class ItemsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'items'
    verbose_name = _('Items')

    def ready(self):
        try:
            import items.signals  # noqa F401
        except ImportError:
            pass
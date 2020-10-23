import dj_database_url
import django_heroku
import os
from .base import *
from .base import EMAIL

DEBUG = True

ALLOWED_HOSTS = ['*']

MIDDLEWARE.append('whitenoise.middleware.WhiteNoiseMiddleware')

EMAIL_BACKEND = os.environ.get("EMAIL_BACKEND")
EMAIL_HOST = os.environ.get("EMAIL_HOST")
# EMAIL_HOST_USER = os.environ.get("SENDGRID_USERNAME")
# EMAIL_HOST_PSSSWORD = os.environ.get("SENDGRID_PASSWORD")
EMAIL_HOST_USER = 'apikey'
EMAIL_HOST_PSSSWORD = os.environ.get("SENDGRID_API_KEY")
EMAIL_PORT = os.environ.get("EMAIL_PORT")
EMAIL_USE_TLS = os.environ.get("EMAIL_USE_TLS")
DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL")
REDIRECT_PAGE = os.environ.get("REDIRECT_PAGE")
REDIRECT_PAGE_FAILED = os.environ.get("REDIRECT_PAGE_FAILED")
SECRET_KEY = os.environ.get("SECRET_KEY")




EMAIL['EMAIL_BACKEND'] = EMAIL_BACKEND
EMAIL['EMAIL_HOST'] = EMAIL_HOST
EMAIL['EMAIL_HOST_USER'] = EMAIL_HOST_USER
EMAIL['EMAIL_HOST_PSSSWORD'] = EMAIL_HOST_PSSSWORD
EMAIL['EMAIL_PORT'] = EMAIL_PORT
EMAIL['EMAIL_USE_TLS'] = EMAIL_USE_TLS
EMAIL['DEFAULT_FROM_EMAIL'] = DEFAULT_FROM_EMAIL

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
    }
}

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)

django_heroku.settings(locals())
#heroku!!
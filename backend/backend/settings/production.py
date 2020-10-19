import dj_database_url
import django_heroku
import os
from .base import *
from .base import EMAIL

DEBUG = True

ALLOWED_HOSTS = ['*']

MIDDLEWARE.append('whitenoise.middleware.WhiteNoiseMiddleware')

EMAIL_BACKEND = os.environ.get("EMAIL_BACKEND")
EMAIL_USE_TLS = os.environ.get("EMAIL_USE_TLS")
EMAIL_PORT = os.environ.get("EMAIL_PORT")
EMAIL_HOST = os.environ.get("EMAIL_HOST")
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER")
EMAIL_HOST_PSSSWORD = os.environ.get("EMAIL_HOST_PSSSWORD")
REDIRECT_PAGE = os.environ.get("REDIRECT_PAGE")
REDIRECT_PAGE_FAILED = os.environ.get("REDIRECT_PAGE_FAILED")
DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL")
SECRET_KEY = os.environ.get("SECRET_KEY")


CLOUD_NAME= os.environ.get('CLOUD_NAME')
API_KEY = os.environ.get('API_KEY')
API_SECRET = os.environ.get('API_SECRET')

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
    }
}

EMAIL['REDIRECT_PAGE'] = REDIRECT_PAGE
EMAIL['REDIRECT_PAGE_FAILED'] = REDIRECT_PAGE_FAILED
EMAIL['EMAIL_HOST_USER'] = EMAIL_HOST_USER
EMAIL['EMAIL_HOST_PSSSWORD'] = EMAIL_HOST_PSSSWORD

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': 'CLOUD_NAME',
    'API_KEY': 'API_KEY',
    'API_SECRET' : 'API_SECRET',
}

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)

django_heroku.settings(locals())
#heroku!!
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
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD")
SERVER_EMAIL = os.environ.get("SERVER_EMAIL")
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

EMAIL['EMAIL_BACKEND'] = EMAIL_BACKEND
EMAIL['EMAIL_USE_TLS'] = EMAIL_USE_TLS
EMAIL['EMAIL_PORT'] = EMAIL_PORT
EMAIL['EMAIL_HOST'] = EMAIL_HOST
EMAIL['EMAIL_HOST_USER'] = EMAIL_HOST_USER
EMAIL['EMAIL_HOST_PASSWORD'] = EMAIL_HOST_PASSWORD
EMAIL['SERVER_EMAIL'] = SERVER_EMAIL
EMAIL['REDIRECT_PAGE'] = REDIRECT_PAGE
EMAIL['REDIRECT_PAGE_FAILED'] = REDIRECT_PAGE_FAILED

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': 'YOUR_CLOUD_NAME',
    'API_KEY': 'YOUR_API_KEY',
    'API_SECRET' : 'YOUR_API_SECRET',
}

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)

django_heroku.settings(locals())
#heroku!!
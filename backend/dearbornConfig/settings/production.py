import dj_database_url
import django_heroku
import os
from .base import *
from .base import EMAIL, Is_Local

ALLOWED_HOSTS = ['*']

DEBUG = True

Is_Local.append(False)

MIDDLEWARE.append('whitenoise.middleware.WhiteNoiseMiddleware')

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
    }
}

SECRET_KEY = os.getenv("SECRET_KEY")

EMAIL_BACKEND = os.getenv("EMAIL_BACKEND")
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")
REDIRECT_PAGE = os.getenv("REDIRECT_PAGE")
REDIRECT_PAGE_FAILED = os.getenv("REDIRECT_PAGE_FAILED")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL")

EMAIL['REDIRECT_PAGE'] = REDIRECT_PAGE
EMAIL['REDIRECT_PAGE_FAILED'] = REDIRECT_PAGE_FAILED

AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.environ.get("AWS_S3_REGION_NAME")
AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME")

AWS_S3_CUSTOM_DOMAIN='%s.s3.%s.amazonaws.com' % (AWS_STORAGE_BUCKET_NAME, AWS_REGION)
AWS_DEFAULT_ACL = None
AWS_LOCATION='static'
STATIC_URL = 'https://%s/%s/' %(AWS_S3_CUSTOM_DOMAIN,AWS_LOCATION)

STATICFILES_STORAGE = 'dearbornConfig.storage.S3StaticStorage'
DEFAULT_FILE_STORAGE = 'dearbornConfig.storage.S3MediaStorage'


db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)
django_heroku.settings(locals())

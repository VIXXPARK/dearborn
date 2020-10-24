import dj_database_url
import django_heroku
import os
from .base import *
from .base import EMAIL

ALLOWED_HOSTS = ['*']

DEBUG = True

MIDDLEWARE.append('whitenoise.middleware.WhiteNoiseMiddleware')

SECRET_KEY = os.getenv("SECRET_KEY")

AWS_ACCESS_KEY_ID = os.environ.get("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.environ.get("AWS_S3_REGION_NAME")
AWS_STORAGE_BUCKET_NAME = os.environ.get("AWS_STORAGE_BUCKET_NAME")

AWS_S3_CUSTOM_DOMAIN='%s.s3.%s.amazonaws.com' % (AWS_STORAGE_BUCKET_NAME, AWS_REGION)
AWS_DEFAULT_ACL = None
AWS_LOCATION='static'
STATIC_URL = 'https://%s/%s/' %(AWS_S3_CUSTOM_DOMAIN,AWS_LOCATION)

STATICFILES_STORAGE = 'backend.storage.S3StaticStorage'
DEFAULT_FILE_STORAGE = 'backend.storage.S3MediaStorage'

EMAIL_BACKEND = os.getenv("EMAIL_BACKEND")
DEFAULT_FROM_EMAIL = 'dearborn0819@gmail.com'
REDIRECT_PAGE = os.getenv("REDIRECT_PAGE")
REDIRECT_PAGE_FAILED = os.getenv("REDIRECT_PAGE_FIALED")

EMAIL['REDIRECT_PAGE'] = REDIRECT_PAGE
EMAIL['REDIRECT_PAGE_FAILED'] = REDIRECT_PAGE_FAILED

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
    }
}

db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)
django_heroku.settings(locals())

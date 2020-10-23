import dj_database_url
import django_heroku
import os
from .base import *
from .base import EMAIL

DEBUG = True

ALLOWED_HOSTS = ['*']

MIDDLEWARE.append('whitenoise.middleware.WhiteNoiseMiddleware')

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
    }
}

SECRET_KEY = os.environ.get("SECRET_KEY")
SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')
EMAIL_BACKEND = os.getenv('EMAIL_BACKEND')
EMAIL_HOST = 'apikey'
EMAIL_HOST_USER = SENDGRID_API_KEY
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
EMAIL_PORT = 587
EMAIL_USE_TLS = True
REDIRECT_PAGE = os.getenv('REDIRECT_PAGE')
REDIRECT_PAGE_FAILED = os.getenv('REDIRECT_PAGE_FAILED')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL')

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

STATICFILES_STORAGE = 'backend.storage.S3StaticStorage'
DEFAULT_FILE_STORAGE = 'backend.storage.S3MediaStorage'


db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)

django_heroku.settings(locals())
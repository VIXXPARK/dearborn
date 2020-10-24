import dj_database_url
import django_heroku
import os
from .base import *
from .base import EMAIL

ALLOWED_HOSTS = ['*']

DEBUG = True

MIDDLEWARE.append('whitenoise.middleware.WhiteNoiseMiddleware')

SECRET_KEY = "q447m#bi8j30@q(72b2-kxr^ubb241g596&epaazu^6fu95$l8"

AWS_ACCESS_KEY_ID = "AKIA6I7Y2CWZK2ZRXRMJ"
AWS_SECRET_ACCESS_KEY = "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"
AWS_REGION = "ap-northeast-2"
AWS_STORAGE_BUCKET_NAME = "dearbornstorage"

AWS_S3_CUSTOM_DOMAIN='%s.s3.%s.amazonaws.com' % (AWS_STORAGE_BUCKET_NAME, AWS_REGION)
AWS_DEFAULT_ACL = None
AWS_LOCATION='static'
STATIC_URL = 'https://%s/%s/' %(AWS_S3_CUSTOM_DOMAIN,AWS_LOCATION)

STATICFILES_STORAGE = 'backend.storage.S3StaticStorage'
DEFAULT_FILE_STORAGE = 'backend.storage.S3MediaStorage'

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_USE_SSL = True
EMAIL_PORT = 465
EMAIL_HOST = "smtp.gmail.com"
EMAIL_HOST_USER = "dearborn0819@gmail.com"
EMAIL_HOST_PASSWORD = "jinminsu0819!@"
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

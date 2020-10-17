import dj_database_url
import django_heroku
from .base import *

DEBUG = False

ALLOWED_HOSTS = ['*']

MIDDLEWARE.append('whitenoise.middleware.WhiteNoiseMiddleware')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME':'dearborn',
        'USER': 'dearborn',
        'PASSWORD': '0000',
        'HOST': 'localhost',
        'PORT': ''
    }
}

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'


db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)

django_heroku.settings(locals())

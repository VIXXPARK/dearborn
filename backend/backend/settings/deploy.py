from .base import *
import dj_database_url
import django_heroku

DEBUG = False

MIDDLEWARE += 'whitenoise.middleware.WhiteNoiseMiddleware'

STATICFILES_STORAGE = 

MIDDLEWARE = [
    'whitenoise.storage.CompressedManifestStaticFilesStorage',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    
]

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

db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY','q447m#bi8j30@q(72b2-kxr^ubb241g596&epaazu^6fu95$l8')
django_heroku.settings(locals())
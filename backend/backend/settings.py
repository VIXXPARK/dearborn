"""
Django settings for backend project.
Generated by 'django-admin startproject' using Django 3.0.8.
For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/
For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os
import datetime
from backend import my_settings
import dj_database_url
import django_heroku

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REACT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# DEBUG = bool(os.environ.get('DJANGO_DEBUG',True))
DEBUG = False

ALLOWED_HOSTS = ['*']


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'background_task',

    'usermanagement.apps.UsermanagementConfig',
    'post.apps.PostConfig',
    'assess.apps.AssessConfig',
    'comment.apps.CommentConfig',
    'bid.apps.BidConfig',
    'messanger.apps.MessangerConfig',
    'contest.apps.ContestConfig',

]

MIDDLEWARE = [
    'whitenoise.middleware.WhiteNoiseMiddleware',
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

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'



AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]



LANGUAGE_CODE = 'ko-kr'

TIME_ZONE = 'Asia/Seoul'

USE_I18N = True

USE_L10N = True

USE_TZ = True


STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(BASE_DIR,'staticfiles')

# STATIC_ROOT = os.path.join(REACT_DIR,'build','static')

STATICFILES_DIRS = (
    os.path.join(REACT_DIR,'build','static'),
    # os.path.join(REACT_DIR,'build'),
    # os.path.join(REACT_DIR,'build','static','css'),
)

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

AUTH_USER_MODEL = 'usermanagement.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'usermanagement.authentication.ExpiringTokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'EXCEPTION_HANDLER': 'backend.my_exc.custom_exception_handler'
}

TOKEN_EXPIRED_AFTER_SECONDS = 86400
PASSWORD_RESET_TIMEOUT = 3600

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


DATABASES = my_settings.DATABASES

EMAIL_BACKEND = my_settings.EMAIL['EMAIL_BACKEND']
EMAIL_USE_TLS = my_settings.EMAIL['EMAIL_USE_TLS']
EMAIL_PORT = my_settings.EMAIL['EMAIL_PORT']
EMAIL_HOST = my_settings.EMAIL['EMAIL_HOST']
EMAIL_HOST_USER = my_settings.EMAIL['EMAIL_HOST_USER']
EMAIL_HOST_PASSWORD = my_settings.EMAIL['EMAIL_HOST_PASSWORD']
SERVER_EMAIL = my_settings.EMAIL['SERVER_EMAIL']

SECRET_KEY = my_settings.SECRET_KEY
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'dearborn',
#         'USER': 'jinminsu200703',
#         'PASSWORD': 'H0@6340@8740$801',
#         'HOST': 'localhost',
#         'PORT': '3306',
#     }
# }


db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY','q447m#bi8j30@q(72b2-kxr^ubb241g596&epaazu^6fu95$l8')
django_heroku.settings(locals())

# heroku start!!!
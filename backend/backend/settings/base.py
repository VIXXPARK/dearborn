import os,json
import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
REACT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

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

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(REACT_DIR,"build")],
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

ROOT_URLCONF = 'backend.urls'

LANGUAGE_CODE = 'ko-kr'

TIME_ZONE = 'Asia/Seoul'

USE_I18N = True

USE_L10N = True

USE_TZ = True


STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(BASE_DIR,'staticfiles')



STATICFILES_DIRS = (
    os.path.join(REACT_DIR,'build','static'),
)



TOKEN_EXPIRED_AFTER_SECONDS = 86400
PASSWORD_RESET_TIMEOUT = 3600

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')



secret_file = os.path.join(BASE_DIR, 'secrets.json')

with open(secret_file) as f:
    secrets = json.loads(f.read())

def get_secret(setting, secrets=secrets):
    try:
        print("check",secrets[setting])
        return secrets[setting]
    except:
        pass
SECRET_KEY = get_secret("SECRET_KEY")

EMAIL_BACKEND = get_secret("EMAIL_BACKEND")
EMAIL_USE_TLS = get_secret("EMAIL_USE_TLS")
EMAIL_PORT = get_secret("EMAIL_PORT")
EMAIL_HOST = get_secret("EMAIL_HOST")
EMAIL_HOST_USER = get_secret("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = get_secret("EMAIL_HOST_PASSWORD")
SERVER_EMAIL = get_secret("SERVER_EMAIL")

EMAIL = {
    'EMAIL_BACKEND' : EMAIL_BACKEND,
    'EMAIL_USE_TLS' : EMAIL_USE_TLS,
    'EMAIL_PORT' : EMAIL_PORT,
    'EMAIL_HOST' : EMAIL_HOST,
    'EMAIL_HOST_USER' : EMAIL_HOST_USER,
    'EMAIL_HOST_PASSWORD' : EMAIL_HOST_PASSWORD,
    'SERVER_EMAIL' : SERVER_EMAIL,

}
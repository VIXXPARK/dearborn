from .base import *
from .base import EMAIL

DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'dearborn',
        'USER': 'jinminsu200703',
        'PASSWORD': 'H0@6340@8740$801',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

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
REDIRECT_PAGE = get_secret("REDIRECT_PAGE")
REDIRECT_PAGE_FAILED = get_secret("REDIRECT_PAGE_FAILED")


EMAIL['EMAIL_BACKEND'] = EMAIL_BACKEND
EMAIL['EMAIL_USE_TLS'] = EMAIL_USE_TLS
EMAIL['EMAIL_PORT'] = EMAIL_PORT
EMAIL['EMAIL_HOST'] = EMAIL_HOST
EMAIL['EMAIL_HOST_USER'] = EMAIL_HOST_USER
EMAIL['EMAIL_HOST_PASSWORD'] = EMAIL_HOST_PASSWORD
EMAIL['SERVER_EMAIL'] = SERVER_EMAIL
EMAIL['REDIRECT_PAGE'] = REDIRECT_PAGE
EMAIL['REDIRECT_PAGE_FAILED'] = REDIRECT_PAGE_FAILED

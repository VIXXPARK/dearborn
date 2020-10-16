from .base import *

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
        print("111")
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
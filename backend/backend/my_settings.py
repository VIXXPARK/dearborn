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

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
#     }
# }


EMAIL = {
    'EMAIL_BACKEND' : "django.core.mail.backends.smtp.EmailBackend",
    'EMAIL_USE_TLS' : True,
    'EMAIL_PORT' : 587,
    'EMAIL_HOST' : "smtp.gmail.com",
    'EMAIL_HOST_USER' : "dearborn0819@gmail.com",
    'EMAIL_HOST_PASSWORD' : "jinminsu0819!@",
    'SERVER_EMAIL' : "dearborn0819",
    'REDIRECT_PAGE' : "http://localhost:3000",
}

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'q447m#bi8j30@q(72b2-kxr^ubb241g596&epaazu^6fu95$l8'
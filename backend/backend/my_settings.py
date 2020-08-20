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

SECRET_KEY = {
    'secret' : '1',
    'algorithm': 'HS256'
}

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
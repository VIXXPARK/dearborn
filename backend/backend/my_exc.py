from rest_framework import exceptions, status, views
from rest_framework.response import Response

def custom_exception_handler(exc, context):

    if isinstance(exc, (exceptions.AuthenticationFailed, exceptions.NotAuthenticated)):
        response = Response({'isAuth':False})
    else:
        response = response = views.exception_handler(exc, context)

    return response
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed

from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model
from dearbornapp.models.user import User

def expires_in(token):
    time_elapsed = timezone.now() - token.created
    left_time = timedelta(seconds = settings.TOKEN_EXPIRED_AFTER_SECONDS) - time_elapsed
    return left_time

def is_token_expired(token):
    return expires_in(token) < timedelta(seconds=0)

def token_expire_handler(token):
    is_expired = is_token_expired(token)
    if is_expired:
        token.delete()
        token = Token.objects.create(user = token.user)
    return is_expired, token

class ExpiringTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        try:
            token = Token.objects.get(key = key)
        except Token.DoesNotExist:
            raise AuthenticationFailed("Invalid Token")

        if not token.user.is_active:
            raise AuthenticationFailed("User is not active")

        is_expired, token = token_expire_handler(token)
        if is_expired:
            raise AuthenticationFailed("The token is expired")

        return (token.user, token)
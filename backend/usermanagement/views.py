from rest_framework.authtoken.models import  Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import(
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_502_BAD_GATEWAY
)

from .serializers import UserSerializer, UserSigninSerializer
from .authentication import token_expire_handler, expires_in
from django.contrib.auth import authenticate
from django.core.cache import cache

@api_view(["POST"])
@permission_classes((AllowAny, ))
def signin(request):
    signin_serializer = UserSigninSerializer(data = request.data)
    if not signin_serializer.is_valid():
        return Response(signin_serializer.errors, status = HTTP_400_BAD_REQUEST)
    
    try:
        user = authenticate(
            request = request,
            email = signin_serializer.validated_data['email'],
            password = signin_serializer.validated_data['password'],
        )
    except:
        return Response({'message': 'Invalid Password'}, status=HTTP_502_BAD_GATEWAY)
    if not user:
        return Response({'message': 'Invalid Credentials or activate account'}, status = HTTP_404_NOT_FOUND)
    
    token, _ = Token.objects.get_or_create(user = user)

    is_expired, token = token_expire_handler(token)
    user_serialized = UserSerializer(user)

    response = Response({
        'success' : True,
        'userId' : user.get_id(),
    }, status=HTTP_200_OK)

    response.set_cookie('w_auth',token)
    return response

@api_view(["POST"])
@permission_classes((AllowAny, ))
def signup(request):
    signup_serializer = UserSerializer(data = request.data)
    if not signup_serializer.is_valid():
        return Response(signup_serializer.errors, status = HTTP_400_BAD_REQUEST)
    signup_serializer.create(signup_serializer.validated_data)
    
    
    return Response({'success': True}, status = HTTP_201_CREATED)
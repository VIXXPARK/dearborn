from .authentication import SettingsBackend
from rest_framework.authtoken.models import  Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import(
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_201_CREATED
)

from .serializers import UserSerializer, UserSigninSerializer
from .authentication import token_expire_handler, expires_in

@api_view(["POST"])
@permission_classes((AllowAny, ))
def signin(request):
    signin_serializer = UserSigninSerializer(data = request.data)
    if not signin_serializer.is_valid():
        return Response(signin_serializer.errors, status = HTTP_400_BAD_REQUEST)
    
    user = SettingsBackend.authenticate(
        email = signin_serializer.data['email'],
        password = signin_serializer.data['password'],
    )
    if not user:
        return Response({'detail': 'Invalid Credentials or activate account'}, status = HTTP_404_NOT_FOUND)
    
    token, _ = Token.objects.get_or_create(user = user)
    

    is_expired, token = token_expire_handler(token)
    user_serialized = UserSerializer(user)

    return Response({
        'user' : user_serialized.data,
        'expires_in': expires_in(token),
        'token': token.key,
    }, status=HTTP_200_OK)

@api_view(["POST"])
@permission_classes((AllowAny, ))
def signup(request):
    signup_serializer = UserSerializer(data = request.data)
    if not signup_serializer.is_valid():
        return Response(signup_serializer.errors, status = HTTP_400_BAD_REQUEST)
    password = signup_serializer.data['password']
    confirmpassword = signup_serializer.data['confirmPassword']
    if not password == confirmpassword:
        return Response({'detail': "Passwords don't match"}, status = HTTP_404_NOT_FOUND)
    signup_serializer.create()
    
    return Response({'detail': "Created"}, status = HTTP_201_OK)
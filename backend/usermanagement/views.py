#-*- coding: utf-8 -*-
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.parsers import MultiPartParser,FormParser
from rest_framework.exceptions import APIException
from rest_framework.authentication import HTTP_HEADER_ENCODING
from rest_framework.status import(
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_502_BAD_GATEWAY,
    HTTP_500_INTERNAL_SERVER_ERROR
)

from django.shortcuts import redirect
from django.views import View
from django.contrib.auth import logout, authenticate
from django.contrib.sites.shortcuts import get_current_site
from django.core.cache import cache
from django.core.mail import EmailMessage
from django.core.exceptions import ValidationError
from django.db.models import F
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_text

from .serializers import UserSerializer, UserSigninSerializer, EmailVerificationSerializer
from .serializers import DeleteUserSerializer, ChangeProfileSerializer, ChangePasswordSeriallizer
from .authentication import token_expire_handler, expires_in
from .models import User
from .token import account_activation_token
from .text import message, changeMessage
from backend.settings.base import TOKEN_EXPIRED_AFTER_SECONDS, MEDIA_ROOT
from backend.settings.base import EMAIL
from smtplib import SMTPException
import jwt, json
import os


@api_view(["POST"])
@permission_classes((AllowAny, ))
def signin(request):
    signin_serializer = UserSigninSerializer(data = request.data)
    if not signin_serializer.is_valid():
        return Response({'success' : False, 'err':signin_serializer.errors}, status = HTTP_400_BAD_REQUEST)
    
    try:
        user = authenticate(
            request = request,
            email = signin_serializer.validated_data['email'],
            password = signin_serializer.validated_data['password'],
        )
    except APIException as e:
        return Response({'success': False, 'err':e.detail}, status=HTTP_502_BAD_GATEWAY)
    if user is None:
        user = User.object.get(email = signin_serializer.validated_data['email'])
        if not getattr(user,'is_active',False):
            return Response({'success':True,'message' : 'Non active'},status=HTTP_200_OK)
        return Response({'success': False, 'err': 'Invalid Credential'}, status=HTTP_400_BAD_REQUEST)

    
    result = Token.objects.get_or_create(user = user)
    token = result[0]

    is_expired, token = token_expire_handler(token)
    user_serialized = UserSerializer(user)

    response = Response({
        'success' : True,
        'isActive' : True,
        'userId' : user.get_id(),
    }, status=HTTP_200_OK)

    response.set_cookie('w_auth',token)
    return response

@api_view(["get"])
def signout(request):
    logout(request)
    response = Response({'success' : True}, HTTP_200_OK)
    response.delete_cookie('w_auth')
    return response

@api_view(["POST"])
@permission_classes((AllowAny, ))
def signup(request):
    signup_serializer = UserSerializer(data = request.data)
    if not signup_serializer.is_valid():
        return Response({'success':False, 'err':signup_serializer.errors}, status = HTTP_400_BAD_REQUEST)

    try :
        user = signup_serializer.create(signup_serializer.validated_data)
    except APIException as e:
        return Response({'success' : False, 'err' : e.detail}, HTTP_400_BAD_REQUEST)


    current_site = get_current_site(request)
    email = signup_serializer.validated_data['email']

    result = emailVerification(current_site, user, email)
    if not result:
        return Response({'success':False,'err':result}, status=HTTP_200_OK)
    return Response({'success': True}, status = HTTP_201_CREATED)

def emailVerification(current_site, user, email):
    # try:    
    current_site = current_site
    domain = current_site.domain
    uid64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = account_activation_token.make_token(user)
    message_data = message(domain, uid64, token)

    mail_title = "이메일 인증을 완료해주세요"
    mail_to = email

    sendEmail = EmailMessage(mail_title, message_data, to=[mail_to], from_email='dearborn0819@gmail.com')
    sendEmail.send()
    return True
    # except SMTPException as smtpE:
    #     raise smtpE


@api_view(["POST"])
@permission_classes((AllowAny, ))
def emailReVerification(request):
    serializer = EmailVerificationSerializer(data = request.data)
    if not serializer.is_valid():
        return Response({'success':False, 'err':serializer.errors}, status = HTTP_400_BAD_REQUEST)
    email = serializer.validated_data['email']
    user = User.object.get(email = email)
    current_site = get_current_site(request)
    result = emailVerification(current_site, user, email)
    if not result:
        return Response({'success':False,'err':result}, status=HTTP_200_OK)
    return Response({'success':True}, status=HTTP_200_OK)

def passwordChangeEmail(current_site, user, email):
    # try:    
    current_site = current_site
    domain = current_site.domain
    uid64 = urlsafe_base64_encode(force_bytes(user.pk))
    token = account_activation_token.make_token(user)
    message_data = changeMessage(domain, uid64, token)

    mail_title = "비밀번호 변경 메일입니다"
    mail_to = email
    
    sendEmail = EmailMessage(mail_title, message_data, to=[mail_to], from_email='dearborn0819@gmail.com')
    sendEmail.send()
    #     return True
    # except SMTPException as smtpE:
    #     return smtpE.strerror

@api_view(["POST"])
@permission_classes((AllowAny, ))
def changeEmailRequest(request):
    serializer = EmailVerificationSerializer(data = request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status = HTTP_400_BAD_REQUEST)
    email = serializer.validated_data['email']
    user = User.object.get(email = email)
    current_site = get_current_site(request)

    result = passwordChangeEmail(current_site, user, email)
    if not result:
        return Response({'success':False, 'err':result}, status=HTTP_200_OK)
    return Response({'success':True}, status=HTTP_200_OK)

class UserView(APIView):
    def get(self, request, format=None):
        user = request.user
        try:
            profile = user.profileImage.url
        except:
            profile = None
        content = {
            '_id': user.id,
            'email': user.email,
            'nickname': user.nickname,
            'job' : user.job,
            'profileImage' : profile,
            'isAuth': True,
        }
        return Response(content)

@permission_classes((AllowAny, ))
class Activate(View):
    def get(self, request, uid64, token):
        try:
            uid = force_text(urlsafe_base64_decode(uid64))
            user = User.object.get(pk=uid)
            
            if account_activation_token.check_token(user, token):
                user.is_active = True
                user.save()
                return redirect(EMAIL['REDIRECT_PAGE'])
            return redirect(EMAIL['REDIRECT_PAGE_FAILED'])
        except:
            return redirect(EMAIL['REDIRECT_PAGE_FAILED'])

@api_view(["POST"])
@permission_classes((AllowAny, ))
def ChangePassword(request):
    try:
        serializer = ChangePasswordSeriallizer(data=request.data)
        if not serializer.is_valid():
            return Response({'success':False,'err' : serializer.error_messages}, status=HTTP_400_BAD_REQUEST)
        uid = force_text(urlsafe_base64_decode(serializer.validated_data['uid']))
        token = serializer.validated_data['token']
        password = serializer.validated_data['password']
        user = User.object.get(id=uid)

        if account_activation_token.check_token(user, token):
            user.set_password(password)
            user.save()
            return Response({'success':True},status=HTTP_200_OK)
        return Response({'success':False, 'err' : 'token failed'}, status=HTTP_400_BAD_REQUEST)
    except APIException as e: 
        return Response({'success':False, 'err' : e.detail},status=HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@permission_classes((AllowAny, ))
def changeProfile(request):
    profileSerializer = ChangeProfileSerializer(data = request.data)
    if not profileSerializer.is_valid():
        return Response(profileSerializer.errors, status = HTTP_400_BAD_REQUEST)
    job = profileSerializer.validated_data['job']
    major = profileSerializer.validated_data['major']
    profileImage = profileSerializer.validated_data['profileImage']
    content = profileSerializer.validated_data['content']
    uid = profileSerializer.validated_data['uid']

    user = User.object.filter(id = uid)
    image = user[0].profileImage
    os.remove(os.path.join(settings.MEDIA_ROOT, + image.storage + image.path))

    user[0].major = major
    user[0].profileImage = profileImage
    user[0].job = job
    user[0].content = content
    user[0].save()
    return Response({'success': True}, status = HTTP_201_CREATED)

@api_view(["get"])
def deleteUser(request):
    try:
        user = request.user
        image = user.profileImage
        os.remove(image.path)
        user.delete()
        return Response({'success':True}, HTTP_200_OK)
    except APIException as e:
        return Response({'success': False, 'err':e.detail}, HTTP_400_BAD_REQUEST)
def message(domain, uid64, token):
    return f"아래 링크를 클릭하면 회원가입 인증이 완료됩니다.\n\n회원가입 링크 : http://{domain}/api/user/activate/{uid64}/{token}\n\n감사합니다."

def changeMessage(domain, uid64, token):
    return f"아래 링크를 클릭하면 비밀번호 변경 페이지로 이동합니다\n\n비밀번호 변경 링크 : http://{domain}/changePassword/{uid64}/{token}\n\n감사합니다."
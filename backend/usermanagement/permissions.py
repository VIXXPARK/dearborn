from rest_framework.permissions import IsAuthenticated

class APIPermission(IsAuthenticated):

    def has_permission(self, request, view):
        print("-------------------------custom0---------------------")
        value = request.data('some_integer_field', None)
        user = request.user

        if user.is_Authenticated:
            print("-------------------------------custom1------------------------------")
            return True
        print("---------------------------custom--------------------")
        return bool(1)
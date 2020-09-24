from rest_framework.pagination import LimitOffsetPagination

class PostPageNumberPagination(LimitOffsetPagination):
    max_limit = 1000
    default_limit = 8
    limit_query_param = 'limit'
    offset_query_param = 'offset'
    template = None
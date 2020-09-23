from rest_framework.pagination import LimitOffsetPagination

class PostPageNumberPagination(LimitOffsetPagination):
    page_size_query_param = 'page_size'
    max_limit = 1000
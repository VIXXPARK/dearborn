"""backend URL Configuration
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include,re_path
from django.conf.urls.static import static
from django.conf import settings
from django.views.generic import TemplateView
urlpatterns = [
    path('jet/',include('jet.urls','jet')),
    path('admin/', admin.site.urls),
    path('api/', include('dearbornapps.urls.user')),
    path('api/', include('dearbornapps.urls.post')),
    path('api/', include('dearbornapps.urls.comment')),
    path('api/', include('dearbornapps.urls.messanger')),
    path('api/', include('dearbornapps.urls.contest')),
    path('api/', include('dearbornapps.urls.assess')),
    path('api/', include('dearbornapps.urls.extraction')),
    re_path('^(?:.*)/?$', TemplateView.as_view(template_name='index.html'), name='index'),
    re_path('^service-worker.js$',
        TemplateView.as_view(template_name='service-worker.js',
                             content_type='application/javascript'), name='service-worker_js'),
]

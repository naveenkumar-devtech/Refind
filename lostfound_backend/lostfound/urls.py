"""
URL configuration for lostfound project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
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
from django.urls import path, include
from django.http import JsonResponse, HttpResponse
from django.conf import settings
from django.conf.urls.static import static
import os
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.views.generic import TemplateView
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

def home(request):
    return TemplateView.as_view(template_name='home.html')(request)

def chat_page(request):
    return TemplateView.as_view(template_name='chat_page.html')(request)

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('lost-found/', serve, {'document_root': settings.STATIC_ROOT, 'path': 'LostFoundMatches.html'}, name='lost-found'),
    path('report-lost/', serve, {'document_root': settings.STATIC_ROOT, 'path': 'ReportLost.html'}, name='report-lost'),
    path('report-found/', serve, {'document_root': settings.STATIC_ROOT, 'path': 'ReportFound.html'}, name='report-found'),
    path('ai-matches/', serve, {'document_root': settings.STATIC_ROOT, 'path': 'AIMatches.html'}, name='ai-matches'),
    path('chat-page/', chat_page, name='chat-page'),
    path('api/', include('api.urls')),
    path('chat/', include('chatbot.urls')),
     path('api/chat/', include('chatbot.urls')), # From 'chat/' to 'api/chat/'
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
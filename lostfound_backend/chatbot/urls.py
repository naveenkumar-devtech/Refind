from django.urls import path
from .views import MatchAssistantView, ChatBotSupportView

urlpatterns = [
    path('match/', MatchAssistantView.as_view(), name='match-assistant'),
    path('support/', ChatBotSupportView.as_view(), name='chat-support'),
]
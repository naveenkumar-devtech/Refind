from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from .views import (
    RegisterView, LoginView, CategoryListView, ItemListCreateView, ItemDetailView,
    MyItemsView,ClaimItemView, MyClaimsView, MyMessageItemsView,
    MessageRecipientsView, SendMessageView, ChatThreadView, DashboardView,
    AIMatchesView, UserProfileView, MaskedItemDetailView, NotificationSummaryView,
    UnreadNotificationsView, ClaimApprovalView, ItemStatusUpdateView  # Added
)

def api_root(request):
    """
    API Root endpoint that shows available endpoints
    """
    return JsonResponse({
        'message': 'Welcome to LostFound API',
        'version': '1.0',
        'endpoints': {
            'authentication': {
                'register': '/api/register/',
                'login': '/api/login/',
            },
            'items': {
                'list_create': '/api/items/',
                'detail': '/api/items/<id>/',
                'my_items': '/api/my-items/',
                'update_status': '/api/items/<id>/update-status/',  # Added
            },
            'categories': '/api/categories/',
            'claims': {
                'claim_item': '/api/claim/<item_id>/',
                'my_claims': '/api/my-claims/',
                'approve_claim': '/api/claim/<item_id>/approve/',
            },
            'messages': {
                'send': '/api/messages/',
                'chat': '/api/chat/',
                'my_message_items': '/api/my-messages/items/',
                'recipients': '/api/my-messages/recipients/<item_id>/',
            },
            'dashboard': '/api/dashboard/',
            'ai_matches': '/api/ai-matches/',
            'profile': '/api/profile/',
            'notifications': {
                'summary': '/api/notifications/summary/',
                'unread': '/api/notifications/',
            }
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('items/', ItemListCreateView.as_view(), name='item-list-create'),
    path('items/<int:pk>/', ItemDetailView.as_view(), name='item-detail'),
    path('items/<int:pk>/update-status/', ItemStatusUpdateView.as_view(), name='item-status-update'),  # Added
    path('my-items/', MyItemsView.as_view(), name='my-items'),
    path('claim/<int:item_id>/', ClaimItemView.as_view(), name='claim-item'),
    path('claim/<int:item_id>/approve/', ClaimApprovalView.as_view(), name='claim-approve'),
    path('my-claims/', MyClaimsView.as_view(), name='my-claims'),
    path('my-messages/items/', MyMessageItemsView.as_view(), name='my-message-items'),
    path('my-messages/recipients/<int:item_id>/', MessageRecipientsView.as_view(), name='message-recipients'),
    path('messages/', SendMessageView.as_view(), name='send-message'),
    path('notifications/summary/', NotificationSummaryView.as_view(), name='notification-summary'),
    path('chat/', ChatThreadView.as_view(), name='chat-thread'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('view-item/<int:item_id>/', MaskedItemDetailView.as_view(), name='masked-item-detail'),
    path('notifications/', UnreadNotificationsView.as_view(), name='unread-notifications'),
    path('ai-matches/', AIMatchesView.as_view(), name='ai-matches'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    
]

# Serve static and media files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
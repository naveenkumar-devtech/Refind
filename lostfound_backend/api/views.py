import logging
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from threading import Thread
from django.conf import settings
from django.db.models import Q
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.serializers import ValidationError
from django_filters.rest_framework import DjangoFilterBackend
from fuzzywuzzy import fuzz
from api.models import Item, Category, Message, CustomUser, ClaimAttempt
from api.serializers import (
    ItemSerializer, CategorySerializer, ClaimAttemptSerializer,
    MessageSerializer, RegisterSerializer, UserProfileSerializer
)
from api.filters import ItemFilter
from chatbot.match import mask_text, match_items  # Updated import

logger = logging.getLogger(__name__)

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        logger.debug(f"Register request data: {request.data}")
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            logger.error(f"Validation error in RegisterView: {e.detail}")
            return Response({"error": e.detail}, status=status.HTTP_400_BAD_REQUEST)
        
        user = serializer.save()
        logger.info(f"User registered: {user.username}")
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.id,
            'message': 'Registration successful. User logged in.'
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        logger.debug(f"Login request data: {request.data}")
        email = request.data.get("email")
        password = request.data.get("password")
        if not email or not password:
            logger.error("Missing email or password")
            return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(email=email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            logger.info(f"User {email} logged in successfully")
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id
            }, status=status.HTTP_200_OK)
        logger.error(f"Invalid credentials for email: {email}")
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

def run_matching_in_background(item_id):
    try:
        item = Item.objects.get(id=item_id)
        logger.info(f"Background task: Started for item ID {item.id} (Status: {item.status})")
        
        matches = match_items(item)
        logger.debug(f"Matches found for item {item.id}: {matches}")
        
        if matches:
            high_confidence_matches = [m for m in matches if m['score'] >= 0.60]
            if high_confidence_matches:
                site_url = getattr(settings, 'SITE_URL', 'http://127.0.0.1:8000')
                
                # Email for the owner of the current item
                if item.status == 'lost' and item.user.email:
                    matches_summary = "\n".join(
                        [f"- Potential Match: Found Item (Hint: '{m['details']['title_hint']}'), Confidence: {m['score']*100:.0f}%" for m in high_confidence_matches]
                    )
                    try:
                        send_mail(
                            subject="📩 Potential Match Found for Your Lost Item",
                            message=(
                                f"Dear {getattr(item.user, 'name', item.user.username)},\n\n"
                                f"Thank you for using Refind. We are pleased to inform you that our advanced matching algorithm has identified potential matches for your lost item: '{item.title}'.\n\n"
                                f"Match Details:\n{matches_summary}\n\n"
                                f"Please log in to your Refind dashboard to review these matches and initiate a chat with the finders to verify ownership.\n\n"
                                f"Access your dashboard: {site_url}/dashboard\n\n"
                                f"Best regards,\nThe Refind Team\nsupport@refind.com | {site_url}"
                            ),
                            from_email=settings.DEFAULT_FROM_EMAIL,
                            recipient_list=[item.user.email],
                            fail_silently=False,
                        )
                        logger.info(f"Match notification email sent to {item.user.email} for lost item {item.id}")
                    except Exception as e:
                        logger.error(f"Failed to send email to {item.user.email} for lost item {item.id}: {str(e)}")
                elif item.status == 'found' and item.user.email:
                    matches_summary = "\n".join(
                        [f"- Potential Match: Lost Item (Hint: '{m['details']['title_hint']}'), Confidence: {m['score']*100:.0f}%" for m in high_confidence_matches if m.get('item_id') != item_id]
                    )
                    if matches_summary:
                        try:
                            send_mail(
                                subject="📩 Potential Match Found for Your Found Item",
                                message=(
                                    f"Dear {getattr(item.user, 'name', item.user.username)},\n\n"
                                    f"Thank you for contributing to Refind. Our sophisticated matching system has detected potential matches for the item you reported as found: '{item.title}'.\n\n"
                                    f"Match Details:\n{matches_summary}\n\n"
                                    f"We kindly request you to log in to your Refind dashboard to review these matches and engage in a chat with the owner.\n\n"
                                    f"Access your dashboard: {site_url}/dashboard\n\n"
                                    f"Best regards,\nThe Refind Team\nsupport@refind.com | {site_url}"
                                ),
                                from_email=settings.DEFAULT_FROM_EMAIL,
                                recipient_list=[item.user.email],
                                fail_silently=False,
                            )
                            logger.info(f"Match notification email sent to {item.user.email} for found item {item.id}")
                        except Exception as e:
                            logger.error(f"Failed to send email to {item.user.email} for found item {item.id}: {str(e)}")

                # Email for owners of matching items (both lost and found), excluding self
                for match in high_confidence_matches:
                    matched_item_id = match.get('item_id') or match.get('id')
                    if matched_item_id and matched_item_id != item_id:
                        matched_item = Item.objects.get(id=matched_item_id)
                        if matched_item.user.email and matched_item.user.email != item.user.email:
                            if matched_item.status == 'lost':
                                matches_summary = f"- Potential Match: Found Item (Hint: '{item.title}'), Confidence: {match['score']*100:.0f}%"
                                try:
                                    send_mail(
                                        subject="📩 Potential Match Found for Your Lost Item",
                                        message=(
                                            f"Dear {getattr(matched_item.user, 'name', matched_item.user.username)},\n\n"
                                            f"Thank you for using Refind. We have identified a potential match for your lost item: '{matched_item.title}'.\n\n"
                                            f"Match Details:\n{matches_summary}\n\n"
                                            f"Please log in to your Refind dashboard to review this match and initiate a chat with the finder.\n\n"
                                            f"Access your dashboard: {site_url}/dashboard\n\n"
                                            f"Best regards,\nThe Refind Team\nsupport@refind.com | {site_url}"
                                        ),
                                        from_email=settings.DEFAULT_FROM_EMAIL,
                                        recipient_list=[matched_item.user.email],
                                        fail_silently=False,
                                    )
                                    logger.info(f"Match notification email sent to {matched_item.user.email} for lost item {matched_item.id}")
                                except Exception as e:
                                    logger.error(f"Failed to send email to {matched_item.user.email} for lost item {matched_item.id}: {str(e)}")
                            elif matched_item.status == 'found':
                                matches_summary = f"- Potential Match: Lost Item (Hint: '{item.title}'), Confidence: {match['score']*100:.0f}%"
                                try:
                                    send_mail(
                                        subject="📩 Potential Match Found for Your Found Item",
                                        message=(
                                            f"Dear {getattr(matched_item.user, 'name', matched_item.user.username)},\n\n"
                                            f"Thank you for contributing to Refind. A potential match has been detected for your found item: '{matched_item.title}'.\n\n"
                                            f"Match Details:\n{matches_summary}\n\n"
                                            f"Please log in to your Refind dashboard to review this match and engage with the owner.\n\n"
                                            f"Access your dashboard: {site_url}/dashboard\n\n"
                                            f"Best regards,\nThe Refind Team\nsupport@refind.com | {site_url}"
                                        ),
                                        from_email=settings.DEFAULT_FROM_EMAIL,
                                        recipient_list=[matched_item.user.email],
                                        fail_silently=False,
                                    )
                                    logger.info(f"Match notification email sent to {matched_item.user.email} for found item {matched_item.id}")
                                except Exception as e:
                                    logger.error(f"Failed to send email to {matched_item.user.email} for found item {matched_item.id}: {str(e)}")
            else:
                logger.info(f"Matches found for item {item.id}, but none met the >60% confidence threshold.")
        else:
            logger.info(f"Background task: No matches found for item ID: {item.id}")
            
    except Item.DoesNotExist:
        logger.error(f"Item {item_id} not found")
    except Exception as e:
        logger.error(f"Background task failed for item ID {item_id}: {str(e)}")

class ItemListCreateView(generics.CreateAPIView):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        item = serializer.save(user=self.request.user)
        thread = Thread(target=run_matching_in_background, args=(item.id,))
        thread.start()
        return item

class ItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Item.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        logger.debug(f"Item update request data: {self.request.data}")
        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        logger.info(f"Deleting item {instance.id} by user {self.request.user.username}")
        instance.delete()

class ClaimItemView(generics.GenericAPIView):
    serializer_class = ClaimAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, item_id):
        logger.debug(f"Claim request data for item {item_id}: {request.data}")
        try:
            item = Item.objects.get(id=item_id, status='found', is_claimed=False)
            data = request.data.copy() if hasattr(request.data, 'copy') else request.data
            data['item'] = item.id
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            claim_note = serializer.validated_data['claim_note']
            
            raw_db_note = item.private_note or ""
            actual_note = " ".join(raw_db_note.strip().split()).casefold()
            user_note = " ".join(claim_note.strip().split()).casefold()
            
            if not actual_note or not user_note:
                raise ValidationError("Both item note and claim note must contain text for matching.")
            
            score = fuzz.token_set_ratio(actual_note, user_note) / 100.0
            logger.debug(f"Fuzzy score for claim on item {item_id}: {score:.2f}")
            
            claim_attempt = ClaimAttempt.objects.create(
                item=item,
                user=request.user,
                claim_note=claim_note,
                similarity_score=round(score, 2),
                status='pending'
            )
            
            logger.info(f"Claim attempt created for item {item_id} by user {request.user.username}")
            
            return Response({
                "status": "Claim pending",
                "score": round(score, 2),
                "message": "Claim submitted for review. Check your dashboard to respond."
            }, status=status.HTTP_200_OK)
            
        except Item.DoesNotExist:
            logger.error(f"Item {item_id} not found or already claimed")
            return Response({"error": "Item not available for claim"}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as ve:
            logger.error(f"Validation error for item {item_id}: {str(ve)}")
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Claim error for item {item_id}: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class MyClaimsView(generics.ListAPIView):
    serializer_class = ClaimAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ClaimAttempt.objects.filter(user=self.request.user)

class SendMessageView(generics.CreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        item = serializer.validated_data.get('item')
        receiver = serializer.validated_data.get('receiver')
        sender = self.request.user

        logger.debug(f"Sending message: sender={sender.username} (ID={sender.id}), receiver={receiver.username} (ID={receiver.id}), item={item.id}")

        if receiver == sender:
            logger.error(f"Validation error: {sender.username} attempted to send message to self")
            raise ValidationError("You cannot send a message to yourself.")

        message = serializer.save(sender=sender)
        logger.info(f"Message created: ID={message.id}, sender={sender.username}, receiver={receiver.username}, item={item.id}")

class ClaimApprovalView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, item_id, *args, **kwargs):
        try:
            item = Item.objects.get(id=item_id, user=request.user)
            claim = ClaimAttempt.objects.filter(item_id=item_id, status='pending').first()
            if not claim:
                return Response({"detail": "No pending claim found for this item"}, status=status.HTTP_400_BAD_REQUEST)
            claim.status = 'approved'
            claim.save()
            item.is_claimed = True
            item.status = 'claimed'
            item.save()
            logger.debug(f"Claim approved for item {item_id} by user {request.user.username}")
            return Response({"detail": "Claim approved"}, status=status.HTTP_200_OK)
        except Item.DoesNotExist:
            logger.error(f"Item {item_id} not found or not owned by {request.user.username}")
            return Response({"detail": "Item not found or you are not authorized"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error approving claim for item {item_id}: {str(e)}")
            return Response({"detail": "Failed to approve claim"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ItemStatusUpdateView(APIView):
    def post(self, request, pk):
        try:
            item = Item.objects.get(pk=pk)
            if item.user != request.user:
                return Response({'detail': 'You are not authorized to update this item'}, status=status.HTTP_403_FORBIDDEN)
            new_status = request.data.get('status')
            if new_status not in ['lost', 'found', 'claimed']:
                return Response(
                    {'detail': 'Invalid status'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            item.status = new_status
            if new_status == 'claimed':
                item.is_claimed = True
            item.save()
            logger.info(f"Item {pk} status updated to {new_status} by user {request.user.username}")
            return Response(
                {'detail': 'Item status updated'},
                status=status.HTTP_200_OK
            )
        except Item.DoesNotExist:
            return Response(
                {'detail': 'Item not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error updating item {pk} status: {str(e)}")
            return Response(
                {'detail': 'An error occurred'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class MyItemsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            items = Item.objects.filter(user=request.user).order_by('-created_at')
            serializer = ItemSerializer(items, many=True, context={'skip_matches': True})
            items_data = serializer.data
            for item_data in items_data:
                item_id = item_data['id']
                claim = ClaimAttempt.objects.filter(item_id=item_id).order_by('-created_at').first()
                if claim:
                    item_data['claim_status'] = {
                        'status': claim.status,
                        'claimer_id': claim.user_id,
                        'claimer_username': claim.user.username,
                        'created_at': claim.created_at.isoformat(),
                        'claim_note': claim.claim_note
                    }
                else:
                    item_data['claim_status'] = None
            logger.debug(f"Fetched {len(items_data)} items for user {request.user.username}")
            return Response(items_data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error fetching items for {request.user.username}: {e}")
            return Response({"detail": "Failed to load items"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            lost_items = Item.objects.filter(status='lost', is_claimed=False).order_by('-created_at')[:5]
            found_items = Item.objects.filter(status='found', is_claimed=False).order_by('-created_at')[:5]
            total_lost_items = Item.objects.filter(status='lost', is_claimed=False).count()
            total_found_items = Item.objects.filter(status='found', is_claimed=False).count()
            total_ai_matches = ClaimAttempt.objects.filter(status='approved').count()
            total_claim_attempts = ClaimAttempt.objects.count()
            success_ratio = (
                (total_ai_matches / total_claim_attempts * 100)
                if total_claim_attempts > 0 else 0.0
            )
            data = {
                'total_lost_items': total_lost_items,
                'total_found_items': total_found_items,
                'total_ai_matches': total_ai_matches,
                'success_ratio': round(success_ratio, 2),
                'lost_items': ItemSerializer(lost_items, many=True, context={'skip_matches': True}).data,
                'found_items': ItemSerializer(found_items, many=True, context={'skip_matches': True}).data,
            }
            logger.debug(f"Dashboard data fetched for user {request.user.username}: {len(lost_items)} lost, {len(found_items)} found")
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error fetching dashboard data for {request.user.username}: {e}")
            return Response({"detail": "Failed to load dashboard data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MyMessageItemsView(generics.ListAPIView):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        owned_items = Item.objects.filter(user=user)
        claimed_items = Item.objects.filter(claimattempt__user=user, claimattempt__status='approved')
        return (owned_items | claimed_items).distinct()

class MessageRecipientsView(generics.ListAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        item_id = self.kwargs.get('item_id')
        user = self.request.user
        logger.debug(f"Fetching recipients for item {item_id} by user {user.username}")
        try:
            item = Item.objects.get(id=item_id)
            recipients = CustomUser.objects.exclude(id=item.user.id).distinct()
            logger.debug(f"Recipients for item {item_id}: {[u.username for u in recipients]}")
            return recipients
        except Item.DoesNotExist:
            logger.error(f"Item {item_id} not found")
            raise ValidationError("Item not found.")

class AIMatchesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        query = request.data.get('query', '')
        location = request.data.get('location', '')
        
        if not query.strip():
            return Response({'detail': 'Query is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            temp_lost_item = Item(
                title=query,
                description=query,
                location=location,
                user=request.user 
            )
            matches = match_items(temp_lost_item)
            logger.info(f"User {request.user.username} fetched {len(matches)} AI matches for query: '{query}'")
            return Response(matches, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error fetching AI matches: {str(e)}")
            return Response({'detail': 'An error occurred while fetching matches'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChatThreadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        receiver_id = request.query_params.get("receiver_id")
        item_id = request.query_params.get("item_id")

        if not receiver_id or not item_id:
            logger.error(f"Missing parameters: receiver_id={receiver_id}, item_id={item_id}")
            return Response({"error": "receiver_id and item_id are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        if not receiver_id.isdigit() or not item_id.isdigit():
            logger.error(f"Invalid parameters: receiver_id={receiver_id}, item_id={item_id}")
            return Response({"error": "receiver_id and item_id must be valid numbers."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            receiver_id = int(receiver_id)
            item_id = int(item_id)

            if not Item.objects.filter(id=item_id).exists():
                logger.error(f"Item {item_id} not found")
                return Response({"error": "Item not found."}, status=status.HTTP_404_NOT_FOUND)
            if not CustomUser.objects.filter(id=receiver_id).exists():
                logger.error(f"Receiver {receiver_id} not found")
                return Response({"error": "Receiver not found."}, status=status.HTTP_404_NOT_FOUND)

            item = Item.objects.get(id=item_id)
            if item.user.id == request.user.id and receiver_id == request.user.id:
                logger.error(f"User {request.user.username} attempted to chat with themselves for item {item_id}")
                return Response({"error": "You cannot chat with yourself."}, status=status.HTTP_400_BAD_REQUEST)

            queryset = Message.objects.filter(
                Q(sender=request.user, receiver_id=receiver_id) |
                Q(sender_id=receiver_id, receiver=request.user),
                item_id=item_id
            ).order_by("timestamp")
            queryset.filter(receiver=request.user, is_read=False).update(is_read=True)
            serializer = MessageSerializer(queryset, many=True)
            logger.debug(f"Fetched {len(serializer.data)} messages for user {request.user.username}, item {item_id}, receiver {receiver_id}")
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error fetching chat for item {item_id}, receiver {receiver_id}: {str(e)}")
            return Response({"error": "An error occurred while fetching the chat."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MaskedItemDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, item_id):
        if not str(item_id).isdigit():
            logger.error(f"Invalid item_id: {item_id}")
            return Response({"error": "Item ID must be a valid number."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            item = Item.objects.get(id=item_id)
            if item.user == request.user:
                serializer = ItemSerializer(item)
                return Response(serializer.data, status=status.HTTP_200_OK)
            masked_data = {
                'id': item.id,
                'title': mask_text(item.title),
                'description': "Description is hidden for privacy. Please chat with the user for more details.",
                'location': mask_text(item.location),
                'status': item.status,
                'category': item.category.name if item.category else 'N/A',
                'image': item.image.url if item.image else None,
                'user': item.user.id,
            }
            logger.debug(f"Fetched masked item {item_id} for user {request.user.username}")
            return Response(masked_data, status=status.HTTP_200_OK)
        except Item.DoesNotExist:
            logger.error(f"Item {item_id} not found")
            return Response({"error": "Item not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Error fetching item {item_id}: {str(e)}")
            return Response({"error": "An error occurred while fetching the item."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class NotificationSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        unread_count = Message.objects.filter(receiver=request.user, is_read=False).count()
        logger.debug(f"Notification summary for {request.user.username}: {unread_count} unread messages")
        return Response({'unread_messages': unread_count}, status=status.HTTP_200_OK)

class UnreadNotificationsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            include_read = request.query_params.get('include_read', 'false').lower() == 'true'
            mark_read = request.query_params.get('mark_read', 'true').lower() == 'true'
            logger.debug(f"Fetching notifications for {request.user.username}, include_read={include_read}, mark_read={mark_read}")
            queryset = Message.objects.filter(receiver=request.user)
            if not include_read:
                queryset = queryset.filter(is_read=False)
            queryset = queryset.order_by('-timestamp')
            notifications_to_send = list(queryset)
            if not include_read and mark_read:
                queryset.update(is_read=True)
            serializer = MessageSerializer(notifications_to_send, many=True)
            logger.debug(f"Notifications sent: {len(serializer.data)}")
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error fetching notifications for {request.user.username}: {str(e)}")
            return Response({"detail": "Failed to load notifications"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
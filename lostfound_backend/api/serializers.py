from rest_framework import serializers
from api.models import Item, Category, ClaimAttempt, Message, CustomUser
from chatbot.matching import match_items
import logging

logger = logging.getLogger(__name__)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    name = serializers.CharField(required=True)
    student_id = serializers.CharField(required=True)
    phone = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'name', 'student_id', 'phone']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            student_id=validated_data['student_id'],
            phone=validated_data.get('phone')
        )
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'name', 'student_id', 'phone']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']

class ItemSerializer(serializers.ModelSerializer):
    claim_status = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Item
        fields = [
            'id', 'user', 'title', 'description', 'location', 'category', 'category_name',
            'created_at', 'status', 'is_claimed', 'private_note', 'image', 'claim_status'
        ]
        read_only_fields = ['id', 'user', 'is_claimed', 'created_at', 'category_name']
        extra_kwargs = {'category': {'write_only': True}}

    def get_claim_status(self, obj):
        claim = ClaimAttempt.objects.filter(item=obj).order_by('-created_at').first()
        if claim:
            return {
                'status': claim.status,
                'claimer_id': claim.user_id,
                'claimer_username': claim.user.username,
                'created_at': claim.created_at.isoformat(),
            }
        return None

    def to_internal_value(self, data):
        logger.debug(f"ItemSerializer raw input data: {data}")
        mutable_data = data.copy() if hasattr(data, 'copy') else data
        try:
            category_value = data.get('category')
            logger.debug(f"Raw category value: {category_value} (type: {type(category_value)})")
            if category_value == '' or category_value is None:
                mutable_data['category'] = None
            elif isinstance(category_value, str) and category_value.isdigit():
                mutable_data['category'] = int(category_value)
            elif not isinstance(category_value, int):
                logger.error(f"Invalid category value: {category_value} (expected integer or null)")
                raise serializers.ValidationError({"category": "Category must be an integer ID or null."})
        except ValueError as e:
            logger.error(f"Category conversion error: {str(e)}")
            raise serializers.ValidationError({"category": "Invalid category ID format."})
        try:
            return super().to_internal_value(mutable_data)
        except serializers.ValidationError as e:
            logger.error(f"ItemSerializer validation error: {e.detail}")
            raise

    def get_matches(self, obj):
        try:
            search_text = f"{obj.title} {obj.description} {obj.location}"
            matches = match_items(search_text)
            return [
                {
                    'id': match['id'],
                    'title_hint': match['title_hint'][:50],
                    'description_hint': match['description_hint'][:100],
                    'location_hint': match['location_hint'][:50],
                    'score': match['score'],
                    'image': match.get('image'),
                    'owner_id': Item.objects.get(id=match['id']).user.id
                } for match in matches
            ]
        except Exception as e:
            logger.error(f"Error computing matches for item {obj.id}: {str(e)}")
            return []

    def validate_category(self, value):
        logger.debug(f"Validating category: {value} (type: {type(value)}, id: {value.id if isinstance(value, Category) else 'N/A'})")
        return value

    def validate_status(self, value):
        valid_statuses = [choice[0] for choice in Item.STATUS_CHOICES]
        if value not in valid_statuses:
            logger.error(f"Invalid status: {value}")
            raise serializers.ValidationError(f"Status must be one of: {', '.join(valid_statuses)}")
        return value

    def create(self, validated_data):
        # Inject user from request context
        user = self.context.get('request').user
        validated_data['user'] = user
        return super().create(validated_data)

class ClaimAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClaimAttempt
        fields = ['id', 'item', 'user', 'claim_note', 'status', 'created_at']
        read_only_fields = ['id', 'user', 'status', 'created_at']

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    receiver = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    item = serializers.PrimaryKeyRelatedField(queryset=Item.objects.all())

    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_username', 'receiver', 'item', 'message', 'timestamp', 'is_read']
        read_only_fields = ['id', 'sender', 'sender_username', 'timestamp', 'is_read']
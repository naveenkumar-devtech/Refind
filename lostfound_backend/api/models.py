from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

class CustomUserManager(BaseUserManager):
    # This manager is now correct and doesn't need changes.
    def create_user(self, email, username, name, student_id, password=None, phone=None):
        if not email:
            raise ValueError('Users must have an email address')
        if not username:
            raise ValueError('Users must have a username')
        user = self.model(
            email=self.normalize_email(email),
            username=username,
            name=name,
            student_id=student_id,
            phone=phone,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, name, student_id, password=None, phone=None):
        user = self.create_user(email, username, name, student_id, password, phone)
        user.is_admin = True
        user.is_staff = True
        user.save(using=self._db)
        return user

class CustomUser(AbstractBaseUser):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    # --- We remove the temporary defaults as they are no longer needed ---
    name = models.CharField(max_length=100)
    student_id = models.CharField(max_length=50, unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name', 'student_id']

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        # Changed to True to allow admin access
        return True

class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Item(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='items/', blank=True, null=True)
    
    STATUS_CHOICES = [
        ('lost', 'Lost'),
        ('found', 'Found'),
        ('claimed', 'Claimed'),
    ]
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='lost')
    
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='items')
    
    # --- THESE ARE THE CRUCIAL, CORRECTED FIELDS ---
    is_claimed = models.BooleanField(default=False, help_text="Is this item marked as claimed?")
    private_note = models.TextField(
        blank=True, 
        null=True, 
        help_text="A secret detail about a FOUND item, for the owner to verify."
    )
    # --- We no longer need the 'matches' JSON field ---

    def __str__(self):
        return f"{self.title} ({self.status})"

class ClaimAttempt(models.Model):
    # The user trying to claim the item (the person who lost it)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='claims_made')
    # The item that was found and is being claimed
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='claim_attempts')
    # The note provided by the claimant to prove ownership
    claim_note = models.TextField(help_text="The secret detail provided by the claimant for verification.")
    created_at = models.DateTimeField(auto_now_add=True)
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ]
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Claim by {self.user.username} for '{self.item.title}'"

class Message(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(CustomUser, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(CustomUser, related_name='received_messages', on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # --- ADD THIS NEW FIELD ---
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.sender.username} to {self.receiver.username} about '{self.item.title}'"
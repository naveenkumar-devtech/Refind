from django.contrib import admin
from .models import CustomUser, Item, Category, ClaimAttempt, Message

# We are using the most basic registration possible to ensure it works.
admin.site.register(CustomUser)
admin.site.register(Category)
admin.site.register(Item)
admin.site.register(ClaimAttempt)
admin.site.register(Message)
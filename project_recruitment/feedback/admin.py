from django.contrib import admin
from .models import Feedback

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('name', 'rating', 'submitted_at')
    search_fields = ('name', 'comment')
    list_filter = ('rating', 'submitted_at')

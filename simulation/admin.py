# from django.contrib import admin
# from .models import (
#     SimulationSession, SimulationBlock, Question, 
#     Answer, UserAnswer, SimulationResult
# )

# class AnswerInline(admin.TabularInline):
#     model = Answer
#     extra = 4  # Show 4 empty answer forms by default

# @admin.register(Question)
# class QuestionAdmin(admin.ModelAdmin):
#     list_display = ('text', 'block', 'order', 'score')
#     list_filter = ('block',)
#     search_fields = ('text',)
#     ordering = ('block', 'order')
#     inlines = [AnswerInline]

# @admin.register(SimulationBlock)
# class SimulationBlockAdmin(admin.ModelAdmin):
#     list_display = ('title', 'order')
#     search_fields = ('title', 'description')
#     ordering = ('order',)

# @admin.register(SimulationSession)
# class SimulationSessionAdmin(admin.ModelAdmin):
#     list_display = ('session_id', 'created_at')
#     ordering = ('-created_at',)

# @admin.register(UserAnswer)
# class UserAnswerAdmin(admin.ModelAdmin):
#     list_display = ('session', 'question', 'selected_answer', 'is_correct', 'answered_at')
#     list_filter = ('is_correct', 'answered_at')
#     ordering = ('-answered_at',)

# @admin.register(SimulationResult)
# class SimulationResultAdmin(admin.ModelAdmin):
#     list_display = ('session', 'total_score', 'max_score', 'percentage', 'completed_at')
#     ordering = ('-completed_at',)
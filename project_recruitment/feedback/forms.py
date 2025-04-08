# forms.py
from django import forms
from .models import Feedback

class FeedbackForm(forms.ModelForm):
    class Meta:
        model = Feedback
        fields = ['rating', 'comment']
        widgets = {
            'comment': forms.Textarea(attrs={'rows': 4, 'placeholder': 'Поділіться вашими враженнями'}),
        }
        labels = {
            'rating': 'Оцінка',
            'comment': 'Коментар',
        }
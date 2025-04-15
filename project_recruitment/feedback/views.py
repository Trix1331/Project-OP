from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import FeedbackForm
from .models import Feedback
from django.contrib.auth.decorators import login_required
def add_feedback(request):
    if request.method == 'POST':
        form = FeedbackForm(request.POST)
        if form.is_valid():
            feedback = form.save(commit=False)
            # НЕ встановлюємо feedback.user
            feedback.save()
            messages.success(request, 'Дякуємо за ваш відгук!')
            return redirect('main_site:home')
    else:
        form = FeedbackForm()
    return render(request, 'feedback/add_feedback.html', {'form': form})

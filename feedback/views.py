from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import FeedbackForm
from .models import Feedback

def add_feedback(request):
    if request.method == 'POST':
        form = FeedbackForm(request.POST)
        if form.is_valid():
            form.save()
            # Після успішної відправки форми ми показуємо повідомлення
            messages.success(request, "Дякуємо за ваш відгук!")
            return redirect('feedback:add')  # Перенаправляємо на ту саму сторінку для показу повідомлення
    else:
        form = FeedbackForm()
    return render(request, 'feedback/add_feedback.html', {'form': form})

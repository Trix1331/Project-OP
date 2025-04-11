from django.shortcuts import render, get_object_or_404, redirect
from .models import Question, Option

def simulation_start(request):
    # Отримуємо перше питання
    first_question = Question.objects.order_by('order').first()
    return render(request, 'simulation/question.html', {'question': first_question})

def simulation_question(request, question_id):
    if request.method == 'POST':
        # Обробляємо відповідь
        selected_option_id = request.POST.get('option')
        option = get_object_or_404(Option, id=selected_option_id)
        
        # Додаємо до сесії
        if 'simulation_score' not in request.session:
            request.session['simulation_score'] = 0
        
        request.session['simulation_score'] += option.score
        
        # Переходимо до наступного питання або до результатів
        if option.next_question:
            return redirect('simulation:question', question_id=option.next_question.id)
        else:
            return redirect('simulation:results')
    else:
        question = get_object_or_404(Question, id=question_id)
        return render(request, 'simulation/question.html', {'question': question})

def simulation_results(request):
    score = request.session.get('simulation_score', 0)
    # Визначаємо результат на основі набраних балів
    if score >= 80:
        result_text = "Ви відмінно підходите для військової служби!"
    elif score >= 60:
        result_text = "Ви маєте хороший потенціал для військової служби."
    else:
        result_text = "Можливо, вам варто розглянути інші варіанти допомоги армії."
    
    # Очищаємо сесію
    if 'simulation_score' in request.session:
        del request.session['simulation_score']
    
    return render(request, 'simulation/results.html', {'score': score, 'result_text': result_text})
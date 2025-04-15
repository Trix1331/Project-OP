from django.shortcuts import render, redirect
from django.http import Http404
from django.utils import timezone
import uuid

# Симуляційні блоки
SIMULATION_BLOCKS = [
    {
        "id": 1,
        "title": "Основні вимоги",
        "description": "Перевірка базових вимог для військової служби",
        "questions": [
            {
                "id": 1,
                "text": "Яким є мінімальний вік для призову на строкову військову службу в Україні?",
                "score": 2,
                "answers": [
                    {"id": 1, "text": "16 років", "is_correct": False},
                    {"id": 2, "text": "18 років", "is_correct": True},
                    {"id": 3, "text": "20 років", "is_correct": False},
                    {"id": 4, "text": "21 рік", "is_correct": False}
                ]
            },
            {
                "id": 2,
                "text": "Який документ є основним при призові на військову службу?",
                "score": 1,
                "answers": [
                    {"id": 1, "text": "Паспорт", "is_correct": False},
                    {"id": 2, "text": "Військовий квиток", "is_correct": False},
                    {"id": 3, "text": "Повістка з військкомату", "is_correct": True},
                    {"id": 4, "text": "Медична довідка", "is_correct": False}
                ]
            }
        ]
    },
    {
        "id": 2,
        "title": "Медичні вимоги",
        "description": "Перевірка медичних критеріїв для служби",
        "questions": [
            {
                "id": 3,
                "text": "Яка категорія придатності дозволяє служити в бойових частинах?",
                "score": 2,
                "answers": [
                    {"id": 1, "text": "Категорія А", "is_correct": True},
                    {"id": 2, "text": "Категорія Б", "is_correct": False},
                    {"id": 3, "text": "Категорія В", "is_correct": False},
                    {"id": 4, "text": "Категорія Г", "is_correct": False}
                ]
            },
            {
                "id": 4,
                "text": "Які медичні показники перевіряються в першу чергу при медогляді?",
                "score": 1,
                "answers": [
                    {"id": 1, "text": "Артеріальний тиск та пульс", "is_correct": True},
                    {"id": 2, "text": "Вага та зріст", "is_correct": False},
                    {"id": 3, "text": "Стан зубів", "is_correct": False},
                    {"id": 4, "text": "Гострота зору", "is_correct": False}
                ]
            }
        ]
    },
    {
        "id": 3,
        "title": "Тактична підготовка",
        "description": "Оцінка знань базової тактики",
        "questions": [
            {
                "id": 5,
                "text": "Яка відстань вважається ефективною для стрільби з автомата АК-74?",
                "score": 2,
                "answers": [
                    {"id": 1, "text": "До 100 метрів", "is_correct": False},
                    {"id": 2, "text": "До 300 метрів", "is_correct": False},
                    {"id": 3, "text": "До 500 метрів", "is_correct": True},
                    {"id": 4, "text": "До 1000 метрів", "is_correct": False}
                ]
            },
            {
                "id": 6,
                "text": "Який порядок дій при потраплянні в засідку?",
                "score": 3,
                "answers": [
                    {"id": 1, "text": "Залягти і чекати підкріплення", "is_correct": False},
                    {"id": 2, "text": "Відкрити вогонь у відповідь та відступити", "is_correct": False},
                    {"id": 3, "text": "Відкрити інтенсивний вогонь та атакувати в напрямку засідки", "is_correct": True},
                    {"id": 4, "text": "Розбігтися в різні сторони", "is_correct": False}
                ]
            }
        ]
    }
]

# ==== UTILS ====

def get_all_questions(block_id=None):
    """Get questions from all blocks or a specific block"""
    questions = []
    for block in SIMULATION_BLOCKS:
        if block_id and block["id"] != block_id:
            continue
        for question in block["questions"]:
            question_with_block = question.copy()
            question_with_block["block_id"] = block["id"]
            question_with_block["block_title"] = block["title"]
            questions.append(question_with_block)
    return questions

def get_question_by_id(question_id, block_id=None):
    all_questions = get_all_questions(block_id)
    return next((q for q in all_questions if q["id"] == question_id), None)

def get_next_question_id(current_question_id, block_id):
    all_questions = get_all_questions(block_id)
    for i, question in enumerate(all_questions):
        if question["id"] == current_question_id and i < len(all_questions) - 1:
            return all_questions[i + 1]["id"]
    return None

def calculate_total_score(user_answers, block_id):
    questions = get_all_questions(block_id)
    total_score = 0
    max_score = sum(q["score"] for q in questions)
    for question in questions:
        answer_id = user_answers.get(str(question["id"]))
        if answer_id:
            for ans in question["answers"]:
                if ans["id"] == answer_id and ans["is_correct"]:
                    total_score += question["score"]
                    break
    return total_score, max_score

def get_result_text(percentage):
    if percentage >= 90:
        return "Відмінний результат! Ви дуже добре підготовлені до військової служби."
    elif percentage >= 70:
        return "Хороший результат! Ви маєте добре розуміння військової справи."
    elif percentage >= 50:
        return "Задовільний результат. Є місце для вдосконалення."
    else:
        return "Вам варто краще ознайомитися з основами військової підготовки."

# ==== VIEWS ====

def start_simulation(request):
    block_id = request.GET.get('block_id')
    if not block_id:
        return render(request, 'simulation/start.html', {'blocks': SIMULATION_BLOCKS})

    block_id = int(block_id)
    questions = get_all_questions(block_id)
    if not questions:
        return render(request, 'simulation/no_blocks.html')

    simulation_data = {
        'id': str(uuid.uuid4()),
        'start_time': timezone.now().isoformat(),
        'current_question': questions[0]['id'],
        'answers': {},
        'selected_block_id': block_id
    }

    request.session['simulation'] = simulation_data
    return redirect('simulation:question', question_id=questions[0]['id'])

def show_question(request, question_id):
    question_id = int(question_id)
    if 'simulation' not in request.session:
        return redirect('simulation:start')

    simulation = request.session['simulation']
    block_id = simulation.get('selected_block_id')
    question = get_question_by_id(question_id, block_id)

    if not question:
        raise Http404("Питання не знайдено")

    if request.method == 'POST':
        selected_answer_id = int(request.POST.get('answer', 0))
        simulation['answers'][str(question_id)] = selected_answer_id
        request.session['simulation'] = simulation

        next_id = get_next_question_id(question_id, block_id)
        if next_id:
            return redirect('simulation:question', question_id=next_id)
        else:
            return redirect('simulation:results')

    all_questions = get_all_questions(block_id)
    current_index = next((i for i, q in enumerate(all_questions) if q["id"] == question_id), 0)

    context = {
        'question': question,
        'total_questions': len(all_questions),
        'current_question_number': current_index + 1
    }
    return render(request, 'simulation/question.html', context)

def show_result(request):
    if 'simulation' not in request.session:
        return redirect('simulation:start')

    simulation = request.session['simulation']
    block_id = simulation.get('selected_block_id')

    total_score, max_score = calculate_total_score(simulation['answers'], block_id)
    percentage = (total_score / max_score) * 100 if max_score else 0

    simulation['end_time'] = timezone.now().isoformat()
    simulation['total_score'] = total_score
    simulation['max_score'] = max_score
    request.session['simulation'] = simulation

    context = {
        'total_score': total_score,
        'max_score': max_score,
        'percentage': percentage,
        'result_text': get_result_text(percentage)
    }
    return render(request, 'simulation/results.html', context)

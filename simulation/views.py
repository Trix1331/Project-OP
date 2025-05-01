from django.shortcuts import render, redirect
from django.http import Http404
from django.utils import timezone
import uuid

# Симуляційні блоки
SIMULATION_BLOCKS = [
    {
        "id": 1,
        "title": "Придатність до військової служби",
        "description": "Перевірка базових законодавчих підстав для мобілізації",
        "questions": [
            {"id": 1, "text": "Скільки вам років?", "score": 1, "answers": [
                {"id": 1, "text": "До 25 років", "is_correct": True},
                {"id": 2, "text": "Від 25 до 60 років", "is_correct": True},
                {"id": 3, "text": "Більше 60 років", "is_correct": False}
            ]},
            {"id": 2, "text": "Чи маєте ви офіційну інвалідність?", "score": 1, "answers": [
                {"id": 1, "text": "Так", "is_correct": False},
                {"id": 2, "text": "Ні", "is_correct": True}
            ]},
            {"id": 3, "text": "Чи маєте трьох або більше дітей до 18 років?", "score": 1, "answers": [
                {"id": 1, "text": "Так", "is_correct": False},
                {"id": 2, "text": "Ні", "is_correct": True}
            ]},
            {"id": 4, "text": "Чи є у вас опікувальні обов'язки над особами з інвалідністю?", "score": 1, "answers": [
                {"id": 1, "text": "Так", "is_correct": False},
                {"id": 2, "text": "Ні", "is_correct": True}
            ]},
            {"id": 5, "text": "Чи ви є студентом денної форми?", "score": 1, "answers": [
                {"id": 1, "text": "Так", "is_correct": False},
                {"id": 2, "text": "Ні", "is_correct": True}
            ]},
            {"id": 6, "text": "Чи вас бронює підприємство?", "score": 1, "answers": [
                {"id": 1, "text": "Так", "is_correct": False},
                {"id": 2, "text": "Ні", "is_correct": True}
            ]},
            {"id": 7, "text": "Чи є у вас судимість?", "score": 1, "answers": [
                {"id": 1, "text": "Так", "is_correct": False},
                {"id": 2, "text": "Ні", "is_correct": True}
            ]},
            {"id": 8, "text": "Чи маєте посвідку про непридатність?", "score": 1, "answers": [
                {"id": 1, "text": "Так", "is_correct": False},
                {"id": 2, "text": "Ні", "is_correct": True}
            ]}
        ]
    },
    {
        "id": 2,
        "title": "Медичні вимоги (ВЛК)",
        "description": "Симуляція висновку військово-лікарської комісії",
        "questions": [
            {"id": 9, "text": "Психічний стан?", "score": 1, "answers": [
                {"id": 1, "text": "Нормальний", "is_correct": True},
                {"id": 2, "text": "Діагностовані розлади", "is_correct": False}
            ]},
            {"id": 10, "text": "Стан серцево-судинної системи?", "score": 1, "answers": [
                {"id": 1, "text": "Нормальний", "is_correct": True},
                {"id": 2, "text": "Є захворювання", "is_correct": False}
            ]},
            {"id": 11, "text": "Стан зору?", "score": 1, "answers": [
                {"id": 1, "text": "Добрий", "is_correct": True},
                {"id": 2, "text": "Поганий", "is_correct": False}
            ]},
            {"id": 12, "text": "Чи є у вас хронічні захворювання?", "score": 1, "answers": [
                {"id": 1, "text": "Ні", "is_correct": True},
                {"id": 2, "text": "Так", "is_correct": False}
            ]},
            {"id": 13, "text": "Стан опорно-рухового апарату?", "score": 1, "answers": [
                {"id": 1, "text": "Без обмежень", "is_correct": True},
                {"id": 2, "text": "Є порушення", "is_correct": False}
            ]},
            {"id": 14, "text": "Чи маєте ви діабет?", "score": 1, "answers": [
                {"id": 1, "text": "Ні", "is_correct": True},
                {"id": 2, "text": "Так", "is_correct": False}
            ]},
            {"id": 15, "text": "Чи маєте алергії, які заважають службі?", "score": 1, "answers": [
                {"id": 1, "text": "Ні", "is_correct": True},
                {"id": 2, "text": "Так", "is_correct": False}
            ]},
            {"id": 16, "text": "Стан слуху?", "score": 1, "answers": [{"id": 1, "text": "Нормальний", "is_correct": True},
                {"id": 2, "text": "Поганий", "is_correct": False}
            ]}
        ]
    },
    {
        "id": 3,
        "title": "Роль у ЗСУ",
        "description": "Визначення, де ви принесете найбільшу користь",
        "questions": [
            {"id": 17, "text": "Ваш фізичний стан?", "score": 1, "answers": [
                {"id": 1, "text": "Відмінний", "is_correct": True},
                {"id": 2, "text": "Середній", "is_correct": True},
                {"id": 3, "text": "Низький", "is_correct": False}
            ]},
            {"id": 18, "text": "Ваш рівень технічної грамотності?", "score": 1, "answers": [
                {"id": 1, "text": "Високий", "is_correct": True},
                {"id": 2, "text": "Низький", "is_correct": False}
            ]},
            {"id": 19, "text": "Ваша стресостійкість?", "score": 1, "answers": [
                {"id": 1, "text": "Висока", "is_correct": True},
                {"id": 2, "text": "Низька", "is_correct": False}
            ]},
            {"id": 20, "text": "Чи маєте бойовий досвід?", "score": 1, "answers": [
                {"id": 1, "text": "Так", "is_correct": True},
                {"id": 2, "text": "Ні", "is_correct": False}
            ]},
            {"id": 21, "text": "Чи маєте медичну підготовку?", "score": 1, "answers": [
                {"id": 1, "text": "Так", "is_correct": True},
                {"id": 2, "text": "Ні", "is_correct": False}
            ]},
            {"id": 22, "text": "Вмієте працювати в команді?", "score": 1, "answers": [
                {"id": 1, "text": "Так", "is_correct": True},
                {"id": 2, "text": "Ні", "is_correct": False}
            ]},
            {"id": 23, "text": "Ваша витривалість у польових умовах?", "score": 1, "answers": [
                {"id": 1, "text": "Висока", "is_correct": True},
                {"id": 2, "text": "Сумнівна", "is_correct": False}
            ]},
            {"id": 24, "text": "Чи готові ви до служби на передовій?", "score": 1, "answers": [
                {"id": 1, "text": "Так", "is_correct": True},
                {"id": 2, "text": "Ні", "is_correct": False}
            ]}
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

def get_result_text(score, simulation_id):
    if simulation_id == 1:
        if score == 3:
            return "Ви підлягаєте мобілізації за чинним законодавством."
        elif score == 2:
            return "Є нюанси, але в цілому вас можуть мобілізувати. Рекомендується уточнити в ТЦК."
        else:
            return "Ви не підлягаєте мобілізації відповідно до чинного законодавства."

    elif simulation_id == 2:
        if score == 3:
            return "Ваш медичний стан дозволяє проходити військову службу."
        elif score == 2:
            return "Необхідне дообстеження або повторне проходження ВЛК."
        else:
            return "Медичні показання можуть стати підставою для непридатності."

    elif simulation_id == 3:
        if score == 3:
            return "Ви ідеально підходите для служби в бойових або технічних підрозділах."
        elif score == 2:
            return "Ви можете бути ефективним у тилових чи допоміжних службах."
        else:
            return "Ймовірно, вам краще реалізовуватись у цивільних ініціативах на підтримку армії."

    return "Результат недоступний для цієї симуляції."

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
    answers = simulation.get('answers', {})

    score, max_score = calculate_total_score(answers, block_id)
    result_text = get_result_text(score, block_id)

    context = {
        'score': score,
        'max_score': max_score,
        'result_text': result_text
    }
    return render(request, 'simulation/results.html', context)

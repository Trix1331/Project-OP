from django.shortcuts import render

def instructions(request):
    return render(request, 'instructions/instructions.html')

def w_instructions(request):
    return render(request, 'instructions/women.html')

def user_instructions(request):
    return render(request, 'instructions/user_instructions.html')

def admin_instructions(request):
    return render(request, 'instructions/admin_instructions.html')
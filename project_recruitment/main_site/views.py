from django.shortcuts import render, get_object_or_404
from .models import Article, Carousel

def home(request):
    carousel_items = Carousel.objects.all().order_by('order')
    articles = Article.objects.all().order_by('-created_at')[:5]
    
    context = {
        'carousel_items': carousel_items,
        'articles': articles,
    }
    return render(request, 'main_site/home.html', context)

def article_detail(request, article_id):
    article = get_object_or_404(Article, id=article_id)
    return render(request, 'main_site/article_detail.html', {'article': article})
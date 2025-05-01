from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.utils.timezone import now
from django.views.generic import View

from datetime import timedelta
from django.utils import timezone

from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.serializers import ModelSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Article
from .models import FavoriteArticle
from .models import TrendArticle

from .scraper import qiita, zenn, note

def index(request):
    return render(request, 'index.html')

class IndexView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'index.html')
    
def scrape_qiita_and_get_articles(request):
    tag = request.GET.get("tags", "Python")
    articles = qiita.scrape_qiita(tag=tag)  
    return JsonResponse({'articles': articles})


def scrape_zenn_and_get_articles(request):
    tag = request.GET.get("tags", "Python")
    articles = zenn.scrape_zenn(tag=tag)
    return JsonResponse({'articles': articles})

def scrape_note_and_get_articles(request):
    tag = request.GET.get("tags", "AI")  
    articles = note.scrape_note(tag=tag)
    return JsonResponse({'articles': articles})


@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])  
def favorite_articles(request):
    user = request.user

    if request.method == "GET":
        favorites = FavoriteArticle.objects.filter(user=user).values()
        return Response({"favorites": list(favorites)})

    if request.method == "POST":
        data = request.data
        url = data.get("url")
        title = data.get("title")
        category = data.get("category")
        body = data.get("body")
        date = data.get("date")
        author = data.get("author")
        likes = data.get("likes")  
        if url:
            FavoriteArticle.objects.get_or_create(
                user=user,
                url=url,
                defaults={
                    "title": title,
                    "category": category,
                    "body": body,
                    "date": date,
                    "author": author,
                    "likes": likes,  
                }
            )
        return Response({"status": "ok"})


    if request.method == "DELETE":
        data = request.data
        url = data.get("url")

        if url:
            FavoriteArticle.objects.filter(user=user, url=url).delete()
        return Response({"status": "deleted"})


class UserRegisterSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]


def recommend_articles(request):
    one_week_ago = timezone.now() - timedelta(days=7)
    articles = Article.objects.filter(
        published_at__gte=one_week_ago
    ).order_by('-likes')[:20]  
    print(articles)
    article_list = [
        {
            'id': article.id,
            'title': article.title,
            'url': article.url,
            'body': article.body[:200], 
            'author': article.author,
            'date': article.published_at,
            'likes': article.likes,
            'category': article.category,
        }
        for article in articles
    ]

    return JsonResponse({'articles': article_list})

def trend_qiita(request):
    articles = qiita.scrape_qiita_trend()
    sorted_articles = sorted(articles, key=lambda x: x['likes'], reverse=True)
    return JsonResponse({'articles': sorted_articles})

def trend_zenn(request):
    articles = zenn.scrape_zenn_trend()
    sorted_articles = sorted(articles, key=lambda x: x['likes'], reverse=True)
    return JsonResponse({'articles': sorted_articles})

def trend_note(request):
    articles = note.scrape_note_trend()
    sorted_articles = sorted(articles, key=lambda x: x['likes'], reverse=True)
    return JsonResponse({'articles': sorted_articles})


@api_view(['GET'])
def trend_all_articles(request):
    now_time = now()

    all_trends = []

    for site_name, scraper_func in [('qiita', qiita.scrape_qiita_trend),
                                    ('zenn', zenn.scrape_zenn_trend),
                                    ('note', note.scrape_note_trend)]:

        latest_article = TrendArticle.objects.filter(site=site_name).order_by('-scraped_at').first()

        if latest_article and (now_time - latest_article.scraped_at) < timedelta(hours=24):
            site_articles = TrendArticle.objects.filter(site=site_name).order_by('-likes')
            for a in site_articles:
                all_trends.append({
                    "title": a.title,
                    "url": a.url,
                    "author": a.author,
                    "likes": a.likes,
                    "body": a.body,
                    "tags": a.tags,
                    "site": site_name,
                })
        else:
            scraped_articles = scraper_func()

            TrendArticle.objects.filter(site=site_name).delete()
            for article in scraped_articles:
                TrendArticle.objects.create(
                    site=site_name,
                    title=article['title'],
                    url=article['url'],
                    author=article.get('author', ''),
                    likes=article.get('likes', 0),
                    body=article.get('body', ''),
                    tags=article.get('tags', []),
                )
                all_trends.append({
                    "title": article['title'],
                    "url": article['url'],
                    "author": article.get('author', ''),
                    "likes": article.get('likes', 0),
                    "body": article.get('body', ''),
                    "tags": article.get('tags', []),
                    "site": site_name,
                })

    sorted_articles = sorted(all_trends, key=lambda x: x['likes'], reverse=True)

    return Response({"articles": sorted_articles})


def get_or_scrape_trend_articles(site_name, scraper_func):
    now_time = now()
    latest_article = TrendArticle.objects.filter(site=site_name).order_by('-scraped_at').first()
    if latest_article and (now_time - latest_article.scraped_at) < timedelta(hours=24):
        articles = TrendArticle.objects.filter(site=site_name).order_by('-likes')
    else:
        scraped_articles = scraper_func()
        TrendArticle.objects.filter(site=site_name).delete()
        for article in scraped_articles:
            TrendArticle.objects.create(
                site=site_name,
                title=article.get('title', 'タイトル不明'),
                url=article.get('url', ''),
                author=article.get('author', '作者不明'),
                likes=article.get('likes', 0),
                body=article.get('body', '本文なし'),
                tags=article.get('tags', []),
            )
        articles = TrendArticle.objects.filter(site=site_name).order_by('-likes')

    serialized = [{
        'id': a.id,  
        'title': a.title,
        'url': a.url,
        'body': (a.body[:300] if a.body else "本文なし"),
        'author': a.author or "作者不明",
        'date': a.scraped_at or now(),  
        'likes': a.likes,
        'category': a.site.capitalize(), 
    } for a in articles]
    return serialized

@api_view(['GET'])
def get_qiita_recommend(request):
    articles = get_or_scrape_trend_articles("qiita", qiita.scrape_qiita_trend)
    return Response({"articles": articles})

@api_view(['GET'])
def get_zenn_recommend(request):
    articles = get_or_scrape_trend_articles("zenn", zenn.scrape_zenn_trend)
    return Response({"articles": articles})

@api_view(['GET'])
def get_note_recommend(request):
    articles = get_or_scrape_trend_articles("note", note.scrape_note_trend)
    return Response({"articles": articles})

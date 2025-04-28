from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Article(models.Model):
    title = models.CharField(max_length=100)
    url = models.URLField(unique=True)
    body = models.TextField()
    category = models.CharField(max_length=100)
    published_at = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)  
    author = models.CharField(max_length=100, default="不明") 

    def __str__(self):
        return self.title


class FavoriteArticle(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    url = models.URLField()
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    body = models.TextField(blank=True)  
    date = models.CharField(max_length=100, blank=True) 
    author = models.CharField(max_length=100, blank=True)  
    likes = models.IntegerField(default=0)

    def __str__(self):
        return self.title

class TrendArticle(models.Model):
    site = models.CharField(max_length=50)  # "qiita"、"zenn"、"note"
    title = models.CharField(max_length=300)
    url = models.URLField()
    author = models.CharField(max_length=100, blank=True, null=True)
    likes = models.IntegerField(default=0)
    body = models.TextField(blank=True, null=True)
    tags = models.JSONField(default=list)
    scraped_at = models.DateTimeField(auto_now_add=True)  # いつスクレイプしたか

    def __str__(self):
        return f"{self.site}: {self.title}"
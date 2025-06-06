from django.core.management.base import BaseCommand
from tech_catch.scraper import qiita, zenn, note
from tech_catch.models import TrendArticle

class Command(BaseCommand):
    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('start update Trend'))

        TrendArticle.objects.all().delete()

        qiita_articles = qiita.scrape_qiita_trend()
        for article in qiita_articles:
            TrendArticle.objects.create(
                site='qiita',
                title=article.get('title', ''),
                url=article.get('url', ''),
                author=article.get('author', ''),
                likes=article.get('likes', 0),
                body=article.get('body', ''),
                tags=article.get('tags', []),
            )

        zenn_articles = zenn.scrape_zenn_trend()
        for article in zenn_articles:
            TrendArticle.objects.create(
                site='zenn',
                title=article.get('title', ''),
                url=article.get('url', ''),
                author=article.get('author', ''),
                likes=article.get('likes', 0),
                body=article.get('body', ''),
                tags=article.get('tags', []),
            )

        note_articles = note.scrape_note_trend()
        for article in note_articles:
            TrendArticle.objects.create(
                site='note',
                title=article.get('title', ''),
                url=article.get('url', ''),
                author=article.get('author', ''),
                likes=article.get('likes', 0),
                body=article.get('body', ''),
                tags=article.get('tags', []),
            )

        self.stdout.write(self.style.SUCCESS('Success Updata Trend'))

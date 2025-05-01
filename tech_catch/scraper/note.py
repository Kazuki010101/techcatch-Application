import requests
from bs4 import BeautifulSoup

def scrape_note_articles(url, article_selector, extract_meta_func, limit=10):
    res = requests.get(url)
    if res.status_code != 200:
        return []

    soup = BeautifulSoup(res.content, "html.parser")
    articles = []
    count = 0

    for article_tag in soup.select(article_selector):
        if count >= limit:
            break

        meta = extract_meta_func(article_tag)
        if not meta:
            continue

        link = meta["link"]
        detail_res = requests.get(link)
        detail_soup = BeautifulSoup(detail_res.content, "html.parser")
        body_container = detail_soup.select_one('div[data-name="body"]')

        if body_container:
            paragraphs = body_container.find_all('p')
            body_texts = [p.get_text(strip=True) for p in paragraphs]
            body_summary = " ".join(body_texts) if body_texts else "(本文なし)"
        else:
            body_summary = "(本文なし)"

        if len(body_summary) >= 300:
            body_summary = body_summary[:300]

        articles.append({
            **meta,
            "body": body_summary,
            "category": "Note"
        })
        count += 1

    return articles


def extract_meta_trend(article_tag):
    title_tag = article_tag.select_one('h3.m-noteBodyTitle__title')
    link_tag = article_tag.select_one('a.m-largeNoteWrapper__link')
    author_tag = article_tag.select_one('div.o-verticalTimeLineNote__user')
    date_tag = article_tag.select_one('div.o-verticalTimeLineNote__date')
    like_tag = article_tag.select_one('span.pl-2.text-sm.text-text-secondary')

    if not title_tag or not link_tag:
        return None

    return {
        "id": "https://note.com" + link_tag.get('href'),
        "title": title_tag.text.strip(),
        "url": "https://note.com" + link_tag.get('href'),
        "author": author_tag.text.strip() if author_tag else '著者不明',
        "date": date_tag.text.strip() if date_tag else '日付不明',
        "likes": int(like_tag.text.strip()) if like_tag and like_tag.text.strip().isdigit() else 0,
        "link": "https://note.com" + link_tag.get('href'),
    }


def extract_meta_search(article_tag):
    title_tag = article_tag.select_one('h3.m-noteBodyTitle__title')
    link_tag = article_tag.select_one('a.m-largeNoteWrapper__link')
    author_tag = article_tag.select_one('div.o-largeNoteSummary__userName')
    date_tag = article_tag.select_one('div.o-largeNoteSummary__date')
    like_tag = article_tag.select_one('span.pl-2.text-sm.text-text-secondary')

    if not title_tag or not link_tag:
        return None

    return {
        "id": "https://note.com" + link_tag.get('href'),
        "title": title_tag.text.strip(),
        "url": "https://note.com" + link_tag.get('href'),
        "author": author_tag.text.strip() if author_tag else '著者不明',
        "date": date_tag.text.strip() if date_tag else '日付不明',
        "likes": int(like_tag.text.strip()) if like_tag and like_tag.text.strip().isdigit() else 0,
        "link": "https://note.com" + link_tag.get('href'),
    }


def scrape_note_trend():
    url = "https://note.com/topic/tech"
    return scrape_note_articles(url, 'div.m-largeNoteWrapper__card', extract_meta_trend)


def scrape_note(tag="AI"):
    from urllib.parse import quote
    url = f"https://note.com/search?q={quote(tag)}&context=note&mode=search"
    return scrape_note_articles(url, 'div.m-timelineItemWrapper__itemWrapper', extract_meta_search, limit=5)

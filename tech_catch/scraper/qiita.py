import requests
from bs4 import BeautifulSoup

def basic_scrapy_qiita(url):
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    articles = []
    count = 0

    for article_tag in soup.select('.style-1kxl4ny'):  
        if count >= 5:
            break
        a_tag = article_tag.select_one('a')
        title_tag = article_tag.find('h3')
        
        if title_tag:
            title = title_tag.text.strip()
            link = "https://qiita.com" + a_tag.get('href')

            author_tag = None
            author_candidates = article_tag.select('a.style-1sii9m')
            for a in author_candidates:
                if a.get('href', '').startswith('/'):
                    author_tag = a
                    break

            author = author_tag.text.strip() if author_tag else "不明"
            date_tag = article_tag.find('time')
            published_at = date_tag['datetime'] if date_tag else None

            tag_elements = article_tag.select('.style-gll3to')
            like_tag = article_tag.select_one('span.style-asioxf')
            try:
                likes = int(like_tag.text.strip()) if like_tag else 0
            except:
                likes = 0

            tags = [t.text.strip() for t in tag_elements]

            body_text = ""
            try:
                detail_res = requests.get(link, headers=headers)
                detail_soup = BeautifulSoup(detail_res.text, 'html.parser')
                body_element = detail_soup.select_one('.mdContent-inner')  
                if body_element:
                    body_text = body_element.text.strip().replace('\n', '').replace('\r', '')
                    body_text = body_text[:200] 
            except Exception as e:
                print(f"本文取得エラー: {e}")

            articles.append({
                "id": link,
                "title": title,
                "url": link,
                "author": author,
                "date": published_at,
                "tags": tags,
                "category": "Qiita",
                "likes": likes,
                "body": body_text if body_text else "本文がありません"
            })

            count += 1

    return articles

def scrape_qiita(tag='Python'):
    url = f'https://qiita.com/search?q={tag}'
    articles = basic_scrapy_qiita(url=url)
    return articles

def scrape_qiita_trend():
    url = 'https://qiita.com'
    articles = basic_scrapy_qiita(url=url)
    return articles
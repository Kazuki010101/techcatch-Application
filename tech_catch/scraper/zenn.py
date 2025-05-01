from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import urllib.parse
import time

def basic_scrapy_zenn(url):
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    driver = webdriver.Chrome(options=options)

    articles = []
    try:
        driver.get(url)
        time.sleep(3)

        soup = BeautifulSoup(driver.page_source, 'html.parser')

        count = 0

        for article_tag in soup.select('div.ArticleList_content__a7csX'):
            if count >= 5:
                break

            a_tag = article_tag.select_one('a.ArticleList_link__4Igs4')
            title_tag = article_tag.select_one('h2.ArticleList_title__mmSkv')

            if a_tag and title_tag:
                title = title_tag.text.strip()
                link = "https://zenn.dev" + a_tag.get('href')

                author_tag = article_tag.select_one('.ArticleList_userName__MlDD5')
                author = author_tag.text.strip() if author_tag else "不明"
                date_tag = article_tag.select_one('time.ArticleList_date__0iYdB')
                date_tag = article_tag.select_one('time')

                if date_tag:
                    published_at = date_tag.text.strip()  
                else:
                    published_at = None

                tag_elements = article_tag.select('div.ArticleList_tags__QSyX9 span')
                tags = [t.text.strip() for t in tag_elements]

                driver.get(link)
                time.sleep(2)
                detail_soup = BeautifulSoup(driver.page_source, 'html.parser')

                body_container = detail_soup.select_one('div.znc')

                if body_container:
                    paragraphs = body_container.find_all('p')
                    if paragraphs:
                        body_texts = [p.get_text(strip=True) for p in paragraphs[:3]]
                        body_summary = " ".join(body_texts)
                    else:
                        body_summary = "(本文なし)"
                else:
                    body_summary = "(本文なし)"

                if len(body_summary) >=200:
                    body_summary = body_summary[:200]

                like_tag = article_tag.select_one('span.ArticleList_like__7aNZE')
                try:
                    likes = int(like_tag.text.strip()) if like_tag else 0
                except:
                
                    likes = 0
                articles.append({
                    "id": link,
                    "title": title,
                    "url": link,
                    "author": author,
                    "date": published_at,
                    "tags": tags,
                    "category": "Zenn",
                    "body": body_summary if body_summary else "本文がありません",
                    "likes": likes
                })
                count += 1

    finally:
        driver.quit()

    return articles

def scrape_zenn(tag='Java'):
    encoded_tag = urllib.parse.quote(tag)
    url = f'https://zenn.dev/search?q={encoded_tag}'
    articles = basic_scrapy_zenn(url=url)
    
    return articles


def scrape_zenn_trend():
    url = "https://zenn.dev"
    articles = basic_scrapy_zenn(url=url)
    return articles



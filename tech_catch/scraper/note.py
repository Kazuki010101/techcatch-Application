from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
import urllib.parse

def basic_scrape_note(url):
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

        for article_tag in soup.select('div.m-timelineItemWrapper__itemWrapper'):
            if count >= 5:
                break

            title_tag = article_tag.select_one('h3.m-noteBodyTitle__title')
            link_tag = article_tag.select_one('a.m-largeNoteWrapper__link')
            author_tag = article_tag.select_one('div.o-largeNoteSummary__userName')
            date_tag = article_tag.select_one('div.o-largeNoteSummary__date')
            like_tag = article_tag.select_one('span.pl-2.text-sm.text-text-secondary')

            if title_tag and link_tag:
                title = title_tag.text.strip()
                link = "https://note.com" + link_tag.get('href')
                author = author_tag.text.strip() if author_tag else '著者不明'
                date = date_tag.text.strip() if date_tag else '日付不明'
                likes = int(like_tag.text.strip()) if like_tag else 0

                driver.get(link)
                time.sleep(2)
                detail_soup = BeautifulSoup(driver.page_source, 'html.parser')

                body_container = detail_soup.select_one('div[data-name="body"]')

                if body_container:
                    paragraphs = body_container.find_all('p')
                    if paragraphs:
                        body_texts = [p.get_text(strip=True) for p in paragraphs]
                        body_summary = " ".join(body_texts)
                    else:
                        body_summary = "(本文なし)"
                else:
                    body_summary = "(本文なし)"

                if len(body_summary) >= 300:
                    body_summary = body_summary[:300]

                articles.append({
                    "id": link,
                    "title": title,
                    "url": link,
                    "author": author,
                    "date": date,
                    "body": body_summary,
                    "likes": likes,
                    "category": "Note"
                })

                count += 1

    finally:
        driver.quit()


    return articles

def scrape_note(tag="AI"):
    encoded_tag = urllib.parse.quote(tag)
    url = f"https://note.com/search?q={encoded_tag}&context=note&mode=search"
    articles = basic_scrape_note(url=url)
    return articles
    


def scrape_note_trend(category="technology"):
    url = f"https://note.com/topic/tech"
    articles = basic_scrape_note(url=url)
    return articles
    
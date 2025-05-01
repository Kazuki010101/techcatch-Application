import { fetchWithAuth } from './fetchWithAuth';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const handleFavorite = async (article, category, favorites, setFavorites) => {
  const isFavorite = favorites.some(fav => fav.url === article.url);

  try {
    if (isFavorite) {
      const res = await fetchWithAuth(`${BASE_URL}/api/favorites/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: article.url })
      });

      if (res.ok) {
        setFavorites(prev => prev.filter(fav => fav.url !== article.url));
      } else {
        console.error('お気に入り削除失敗');
      }
    } else {
      const res = await fetchWithAuth(`${BASE_URL}/api/favorites/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: article.url,
          title: article.title || "タイトル不明",
          category: category,
          body: article.body || "本文なし",
          date: article.date || "日付不明",
          author: article.author || "作者不明",
          likes: article.likes || 0
        })
      });

      if (res.ok) {
        setFavorites(prev => [...prev, {
          url: article.url,
          title: article.title,
          category: category,
          body: article.body,
          date: article.date,
          author: article.author,
          likes: article.likes
        }]);
      } else {
        console.error('お気に入り登録失敗');
      }
    }
  } catch (err) {
    console.error('お気に入り操作エラー:', err);
  }
};

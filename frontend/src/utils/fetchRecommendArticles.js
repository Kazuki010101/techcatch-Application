import { fetchFavorites } from './fetchFavorite';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchRecommendArticles = async (
  setQiitaArticles,
  setZennArticles,
  setNoteArticles,
  setFavorites,
  setLoading
) => {
  try {
    const [qiitaRes, zennRes, noteRes, favoritesRes] = await Promise.allSettled([
      fetch(`${BASE_URL}/api/recommend/qiita/`).then(res => res.json()),
      fetch(`${BASE_URL}/api/recommend/zenn/`).then(res => res.json()),
      fetch(`${BASE_URL}/api/recommend/note/`).then(res => res.json()),
      fetchFavorites()
    ]);

    if (qiitaRes.status === "fulfilled") {
      setQiitaArticles(qiitaRes.value.articles || []);
    }

    if (zennRes.status === "fulfilled") {
      setZennArticles(zennRes.value.articles || []);
    }

    if (noteRes.status === "fulfilled") {
      setNoteArticles(noteRes.value.articles || []);
    }

    if (favoritesRes.status === "fulfilled") {
      setFavorites(favoritesRes.value || []);
    }

  } catch (err) {
    console.error("Error Occured:", err);
  } finally {
    setLoading(false);
  }
};

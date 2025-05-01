import { fetchFavorites } from './fetchFavorite';

export const fetchRecommendArticles = async (
  setQiitaArticles,
  setZennArticles,
  setNoteArticles,
  setFavorites,
  setLoading
) => {
  try {
    const [qiitaRes, zennRes, noteRes, favoritesRes] = await Promise.allSettled([
      fetch('http://localhost:8000/api/recommend/qiita/').then(res => res.json()),
      fetch('http://localhost:8000/api/recommend/zenn/').then(res => res.json()),
      fetch('http://localhost:8000/api/recommend/note/').then(res => res.json()),
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

import { fetchFavorites } from './fetchFavorite';

export const fetchRecommendArticles = async (setQiitaArticles, setZennArticles, setNoteArticles, setFavorites, setLoading) => {
  try {
    const [qiitaRes, zennRes, noteRes, favoritesData] = await Promise.all([
      fetch('http://localhost:8000/api/recommend/qiita/').then(res => res.json()),
      fetch('http://localhost:8000/api/recommend/zenn/').then(res => res.json()),
      fetch('http://localhost:8000/api/recommend/note/').then(res => res.json()),
      fetchFavorites(), 
    ]);

    setQiitaArticles(qiitaRes.articles || []);
    setZennArticles(zennRes.articles || []);
    setNoteArticles(noteRes.articles || []);
    setFavorites(favoritesData || []);
  } catch (err) {
    console.error('データ取得エラー:', err);
  } finally {
    setLoading(false);
  }
};

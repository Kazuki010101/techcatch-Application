const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchAllArticles = async (
  query,
  setQiitaArticles,
  setZennArticles,
  setNoteArticles,
  setQiitaLoading,
  setZennLoading,
  setNoteLoading,
  setError,
  setSearched
) => {
  if (!query.trim()) return;

  setQiitaArticles([]);
  setZennArticles([]);
  setNoteArticles([]);

  setQiitaLoading(true);
  setZennLoading(true);
  setNoteLoading(true);

  setError(null);
  setSearched(false);

  const fetchService = async (name, setArticles, setLoading) => {
    try {
      const res = await fetch(`${BASE_URL}/api/scrape/${name}/?tags=${encodeURIComponent(query)}`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err) {
      console.error(`${name}取得失敗:`, err);
      setError('取得に失敗しました');
    } finally {
      setLoading(false); 
    }
  };

  fetchService('qiita', setQiitaArticles, setQiitaLoading);
  fetchService('zenn', setZennArticles, setZennLoading);
  fetchService('note', setNoteArticles, setNoteLoading);

  setSearched(true);
};

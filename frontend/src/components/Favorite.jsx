import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Favorites.css';
import { useNavigate } from 'react-router-dom';
import { handleFavorite } from '../utils/handleFavorite';
import { fetchFavorites } from '../utils/fetchFavorite';
import { generateChartData } from '../utils/generateChartData';

ChartJS.register(ArcElement, Tooltip, Legend);

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [sortOption, setSortOption] = useState('likes');
  const navigate = useNavigate();

  useEffect(() => {
    const loadFavorites = async () => {
      const favoritesData = await fetchFavorites();
      setFavorites(favoritesData);
      setLoading(false);
    };
    loadFavorites();
  }, []);

  const onFavoriteClick = (article) => {
    handleFavorite(article, article.category, favorites, setFavorites);
  };

  const getSiteLogo = (site) => {
    if (site === 'Qiita') return process.env.PUBLIC_URL + '/qiita-logo.png';
    if (site === 'Zenn') return process.env.PUBLIC_URL + '/zenn-logo.png';
    if (site === 'Note') return process.env.PUBLIC_URL + '/note-logo.png';
    return '';
  };

  const filteredFavorites = filter === 'All'
    ? favorites
    : favorites.filter(article => article.category === filter);

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    if (sortOption === 'likes') {
      return (b.likes || 0) - (a.likes || 0);
    } else if (sortOption === 'date') {
      return new Date(b.date) - new Date(a.date);
    }
    return 0;
  });

    
  const chartData = generateChartData(favorites);
  
  if (loading) return (
    <div className="spinner-wrapper">
      <div className="spinner"></div>
      <div className="spinner-text">ロード中...</div>
    </div>
  );

  return (
    <div className="favorites-layout">
      <h1 className="favorites-title">❤️ お気に入り記事一覧</h1>

      <div className="chart-container">
        <Pie data={chartData} />
      </div>

      <div className="favorites-controls">
        <div className="favorites-filter">
          <label>カテゴリー: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">すべて</option>
            <option value="Qiita">Qiita</option>
            <option value="Zenn">Zenn</option>
            <option value="Note">Note</option>
          </select>
        </div>

        <div className="favorites-sort">
          <label>並び替え: </label>
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="likes">いいね順</option>
            <option value="date">日付順</option>
          </select>
        </div>
      </div>

      {sortedFavorites.length === 0 ? (
        <p className="no-favorites">まだお気に入りがありません。</p>
      ) : (
        <div className="favorites-grid">
          {sortedFavorites.map((article, idx) => (
            <div key={idx} className="favorite-card">
              <div className="favorite-header">
                <img src={getSiteLogo(article.category)} alt={article.category} className="site-logo-favorite" />
                <div
                  className="favorite-heart"
                  onClick={() => onFavoriteClick(article)}
                >
                  {favorites.some(fav => fav.url === article.url) ? "❤️" : "🤍"}
                </div>
              </div>

              <a href={article.url} target="_blank" rel="noopener noreferrer" className="favorite-title">
                {article.title}
              </a>

              <div className="favorite-meta">
                <span>カテゴリー: {article.category || "不明"}</span><br/>
                <span>著者: {article.author || "作者不明"}</span><br/>
                <span>日付: {article.date ? new Date(article.date).toLocaleDateString('ja-JP') : "日付不明"}</span><br/>
                <span>👍 {article.likes !== undefined ? article.likes : 0} likes</span>
              </div>

              <div className="favorite-body">
                {article.body ? article.body.slice(0, 150) + "..." : "本文なし"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;

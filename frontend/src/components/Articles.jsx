import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Articles.css';
import { handleFavorite } from '../utils/handleFavorite';
import { fetchFavorites } from '../utils/fetchFavorite';
import { generateChartData } from '../utils/generateChartData';
import { fetchRanking } from '../utils/fetchRanking';
import { fetchAllArticles } from '../utils/fetchAllArticles';

ChartJS.register(ArcElement, Tooltip, Legend);

const Articles = () => {
  const [qiitaArticles, setQiitaArticles] = useState([]);
  const [zennArticles, setZennArticles] = useState([]);
  const [noteArticles, setNoteArticles] = useState([]);
  
  const [favorites, setFavorites] = useState([]);
  const [qiitaLoading, setQiitaLoading] = useState(false);
  const [zennLoading, setZennLoading] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const [rankingArticles, setRankingArticles] = useState([]);
  const [rankingLoading, setRankingLoading] = useState(true);

  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const favoritesData = await fetchFavorites();
      setFavorites(favoritesData);

      const rankingData = await fetchRanking();
      setRankingArticles(rankingData);
      setRankingLoading(false);
    };
    loadData();
  }, []);

  const fetchAll = async () => {
    await fetchAllArticles(
      query,
      setQiitaArticles,
      setZennArticles,
      setNoteArticles,
      setQiitaLoading,
      setZennLoading,
      setNoteLoading,
      setError,
      setSearched
    );
  };

  const chartData = generateChartData(favorites);

  const capitalizeSite = (site) => {
    if (!site) return '';
    return site.charAt(0).toUpperCase() + site.slice(1).toLowerCase();
  };

  return (
    <div className="articles-layout">
      <aside className="sidebar left">
        <div className="chart-section">
          <h2 className="sidebar-title">お気に入りサイト分布</h2>
          <div className="chart-container">
            <Pie data={chartData} />
          </div>
        </div>

        <div className="favorites-section">
          <h2 className="sidebar-title">お気に入り一覧</h2>
          <div className="favorites-list">
            {favorites.length > 0 ? (
              [...favorites]
                .sort((a, b) => new Date(b.date) - new Date(a.date)) 
                .slice(0, 4) 
                .map((article, idx) => (
                  <div
                    key={idx}
                    className="favorite-box"
                    onClick={() => navigate('/favorites', { state: { favorites } })}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="favorite-source">
                      {["Qiita", "Zenn", "Note"].includes(article.category) ? (
                        <img src={`/${article.category.toLowerCase()}-logo.png`} alt={article.category} className="favorite-site-logo" />
                      ) : (
                        <img src="/other-logo.png" alt="その他" className="favorite-site-logo" />
                      )}
                    </div>

                    <div className="favorite-title">
                      {article.title.length > 30 ? article.title.slice(0, 30) + "..." : article.title}
                    </div>

                    <div className="favorite-body-preview">
                      {article.body ? article.body.slice(0, 50) + "..." : "本文なし"}
                    </div>

                    <div className="favorite-info">
                      <span>👍 {article.likes !== undefined ? article.likes : 0} likes</span>・
                      <span>{article.date ? new Date(article.date).toLocaleDateString('ja-JP') : '登録日不明'}</span>
                    </div>
                  </div>
                ))
            ) : (
              <p className="no-favorites">まだデータがありません。</p>
            )}
          </div>

        </div>
      </aside>

      <main className="main-content">
        <h1 className="main-title">記事検索</h1>

        <form
          className="search-bar"
          onSubmit={(e) => {
            e.preventDefault();
            fetchAll();
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="タグを入力（例: Python）"
          />
          <button type="submit">検索</button>
        </form>

        {error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            {!searched ? (
              <>
                <div className="site-link-grid">
                  {["qiita", "zenn", "note"].map((site) => {
                    const domain = site === "note" ? "note.com" : site === "zenn" ? "zenn.dev" : site + ".com";
                    return (
                      <a
                        key={site}
                        href={`https://${domain}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="site-link-item"
                      >
                        <img src={`/${site}-logo.png`} alt={site} className="site-logo" />
                      </a>
                    );
                  })}
                </div>


                <div className="ranking-section">
                  <h2 className="ranking-title"> 総合人気ランキング</h2>
                  {rankingLoading ? (
                    <div className="spinner-wrapper">
                      <div className="spinner"></div>
                      <div className="spinner-text">ランキングロード中...</div>
                    </div>
                  ) : (
                    <div className="ranking-list">
                      {rankingArticles.slice(0, 10).map((article, idx) => (
                        <div key={idx} className="article-card ranking-article-card">
                          <div className="ranking-header">
                            <div className={`ranking-badge ${
                              idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : 'default'
                            }`}>
                              {idx + 1}位
                            </div>
                            <div className="site-logo-container">
                              <img src={`/${article.site}-logo.png`} alt={article.site} className="small-site-logo" />
                            </div>
                          </div>

                          <a href={article.url} target="_blank" rel="noopener noreferrer" className="article-title">
                            {article.title}
                          </a>

                          <div className="article-body-preview">
                            {article.body ? article.body.slice(0, 300) + "..." : "本文なし"}
                          </div>

                          <div className="article-meta">
                            <span>@{article.author || "作者不明"}</span>・
                            <span>👍 {article.likes} likes</span>
                          </div>

                          <div className="favorite-icon" onClick={() => handleFavorite(article, capitalizeSite(article.site), favorites, setFavorites)}>
                            {favorites.some(fav => fav.url === article.url) ? "❤️" : "🤍"}
                          </div>

                          {article.tags && (
                            <div className="article-tags">
                              {article.tags.map((tag, idx) => (
                                <span key={idx} className="tag">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="article-sections-wrapper">
                  <div className="article-section qiita-section">
                    <h2>Qiita記事一覧</h2>
                    {qiitaLoading ? (
                      <div className="spinner-wrapper">
                        <div className="spinner"></div>
                        <div className="spinner-text">Qiita記事ロード中...</div>
                      </div>                    ) : (
                      <ArticleList articles={qiitaArticles} site="Qiita" favorites={favorites} setFavorites={setFavorites} />
                    )}
                  </div>

                  <div className="article-section zenn-section">
                    <h2>Zenn記事一覧</h2>
                    {zennLoading ? (
                      <div className="spinner-wrapper">
                        <div className="spinner"></div>
                        <div className="spinner-text">Zenn記事ロード中...</div>
                      </div> 
                    ) : (
                      <ArticleList articles={zennArticles} site="Zenn" favorites={favorites} setFavorites={setFavorites} />
                    )}
                  </div>

                  <div className="article-section note-section">
                    <h2>Note記事一覧</h2>
                    {noteLoading ? (
                      <div className="spinner-wrapper">
                        <div className="spinner"></div>
                        <div className="spinner-text">Note記事ロード中...</div>
                      </div> 
                    ) : (
                      <ArticleList articles={noteArticles} site="Note" favorites={favorites} setFavorites={setFavorites} />
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};


const ArticleList = ({ articles, site, favorites, setFavorites }) => (
  <div className="article-columns">
    {articles.map((article) => (
      <div key={article.id} className="article-card">
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="article-title">
          {article.title}
        </a>
        <div className="article-body-preview">{article.body}...</div>
        <div className="article-meta">
          <span>{article.author}</span>・
          <span>{article.date ? new Date(article.date).toLocaleDateString('ja-JP') : '日付不明'}</span>
        </div>
        {article.likes !== undefined && (
          <div className="likes-count">👍 {article.likes} likes</div>
        )}
        <div className="favorite-icon" onClick={() => handleFavorite(article, site, favorites, setFavorites)}>
          {favorites.some(fav => fav.url === article.url) ? "❤️" : "🤍"}
        </div>
        {article.tags && (
          <div className="article-tags">
            {article.tags.map((tag, idx) => (
              <span key={idx} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
);

export default Articles;

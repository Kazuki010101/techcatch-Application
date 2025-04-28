import React from 'react';

export const renderArticles = (articles, siteName, favorites, setFavorites, handleFavorite) => (
  <div className={`recommend-section ${siteName.toLowerCase()}-section`}>
    <h2>{siteName} トレンド</h2>
    <div className="article-columns">
      {articles.map((article, idx) => (
        <div key={idx} className="article-card">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="article-title">
            {article.title}
          </a>
          <div className="article-body-preview">
            {article.body ? article.body.slice(0, 300) + "..." : "本文がありません"}
          </div>
          <div className="article-meta">
            <span>@{article.author || "作者不明"}</span>・
            <span>
              {(() => {
                try {
                  const parsedDate = new Date(article.date);
                  if (!isNaN(parsedDate)) {
                    return parsedDate.toLocaleDateString('ja-JP');
                  } else {
                    return article.date || '日付不明';
                  }
                } catch (e) {
                  return article.date || '日付不明';
                }
              })()}
            </span>
          </div>
          {article.tags && (
            <div className="article-tags">
              {article.tags.map((tag, idx) => (
                <span key={idx} className="tag">{tag}</span>
              ))}
            </div>
          )}
          {article.likes !== undefined && (
            <div className="likes-count">
              👍 {article.likes} likes
            </div>
          )}
          <div className="favorite-icon" onClick={() => handleFavorite(article, siteName, favorites, setFavorites)}>
            {favorites.some(fav => fav.url === article.url) ? "❤️" : "🤍"}
          </div>
        </div>
      ))}
    </div>
  </div>
);

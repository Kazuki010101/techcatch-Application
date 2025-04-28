import React, { useEffect, useState } from 'react';
import './Recommend.css';
import { handleFavorite } from '../utils/handleFavorite';
import { fetchRecommendArticles } from '../utils/fetchRecommendArticles';
import { renderArticles } from '../utils/renderArticles';

const Recommend = () => {
  const [qiitaArticles, setQiitaArticles] = useState([]);
  const [zennArticles, setZennArticles] = useState([]);
  const [noteArticles, setNoteArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchRecommendArticles(
      setQiitaArticles,
      setZennArticles,
      setNoteArticles,
      setFavorites,
      setLoading
    );
  }, []);
  
  if (loading) return <div className="spinner"></div>;

  return (
    <div className="recommend-layout">
      <h1 className="recommend-title"> トレンド記事 (直近1週間)</h1>
        {renderArticles(qiitaArticles, "Qiita", favorites, setFavorites, handleFavorite)}
        {renderArticles(zennArticles, "Zenn", favorites, setFavorites, handleFavorite)}
        {renderArticles(noteArticles, "Note", favorites, setFavorites, handleFavorite)}

    </div>
  );
};

export default Recommend;

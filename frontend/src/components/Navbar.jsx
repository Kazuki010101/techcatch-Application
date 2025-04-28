import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ token, username, handleLogout, resetSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.location.reload();
    } else {
      navigate('/');
    }
  };
  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo" onClick={handleLogoClick}>
          <span className="navbar-title">TechCatch</span>
          <span className="navbar-subtitle">～技術を素早く手に入れる～</span>
        </div>
      </div>

      <div className="navbar-right">
        {token ? (
          <>
            <button className="navbar-link" onClick={() => navigate('/recommend')}>トレンド記事</button>
            <span className="navbar-username">こんにちは、{username}さん</span>
            <button className="navbar-button" onClick={handleLogout}>ログアウト</button>
          </>
        ) : (
          <Link to="/" className="navbar-button">ログイン</Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;

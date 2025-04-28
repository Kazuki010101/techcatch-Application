import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { loginUser, saveAuthData } from '../utils/auth'; 

const Login = ({ setToken, setUsername }) => {
  const [username, setLocalUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await loginUser(username, password); 
      saveAuthData(data, username); 

      setToken(data.access);
      setUsername(username);

      navigate('/');
    } catch (err) {
      console.error(err);
      setError('ログインに失敗しました');
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="login-container">
      <h2>ログイン</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setLocalUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {isLoading ? (
          <div className="spinner-wrapper">
            <div className="spinner"></div>
            <div className="spinner-text">ログイン中...</div>
          </div>
        ) : (
          <button type="submit">ログイン</button>
        )}
      </form>

      {error && <p className="error">{error}</p>}

      <div className="register-link">
        <p>アカウントをお持ちでないですか？</p>
        <Link to="/register">新規登録はこちら</Link>
      </div>
    </div>
  );
};

export default Login;

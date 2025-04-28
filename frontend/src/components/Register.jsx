import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import './Login.css'; 

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error('登録失敗');
      }

      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('エラーが発生しました');
    }
  };

  return (
    <div className="login-container"> 
      <h2>新規登録</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">登録</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="register-link">
        <p>すでにアカウントを持っていますか？</p>
        <Link to="/login">ログインはこちら</Link>
      </div>
    </div>
  );
};

export default Register;

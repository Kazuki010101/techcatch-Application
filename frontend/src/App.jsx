import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // ← Routerを導入！
import Articles from './components/Articles';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Recommend from './components/Recommend'; 
import Favorites from './components/Favorite';
import Register from './components/Register';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('access') || null);
  const [username, setUsername] = useState(localStorage.getItem('username') || null);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
  };

  return (
    <Router> 
      <Navbar token={token} username={username} handleLogout={handleLogout} />


      <Routes>
        <Route path="/favorites" element={<Favorites />} />

        <Route path="/" element={
          token ? <Articles token={token} username={username} /> : <Navigate to="/login" />
        } />

        <Route path="/recommend" element={
          token ? <Recommend /> : <Navigate to="/login" />
        } />

        <Route path="/login" element={
          <Login setToken={setToken} setUsername={setUsername} />
        } />

        <Route path="/register" element={
          <Register />} 
        />


      </Routes>
    </Router>
  );
};

export default App;

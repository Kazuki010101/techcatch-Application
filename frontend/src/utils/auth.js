export const loginUser = async (username, password) => {
    const url = 'http://localhost:8000/api/token/';
    const body = JSON.stringify({ username, password });
  
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    });
  
    if (!res.ok) {
      throw new Error('認証失敗');
    }
  
    const data = await res.json();
    return data;
  };
  
  export const saveAuthData = (data, username) => {
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    localStorage.setItem('username', username);
  };
  
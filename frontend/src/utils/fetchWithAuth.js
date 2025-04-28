export const fetchWithAuth = async (url, options = {}) => {
    let token = localStorage.getItem('access');
    if (!token) throw new Error('ログインしていません');
  
    let res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      }
    });
  
    if (res.status === 401) {
      const refreshToken = localStorage.getItem('refresh');
      if (refreshToken) {
        const refreshRes = await fetch("http://localhost:8000/api/token/refresh/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        });
  
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          localStorage.setItem('access', refreshData.access);
          token = refreshData.access;
  
          res = await fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${token}`,
            }
          });
        }
      }
    }
  
    return res;
  };
  
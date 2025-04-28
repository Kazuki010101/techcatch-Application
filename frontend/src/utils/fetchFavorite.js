import { fetchWithAuth } from './fetchWithAuth';

export const fetchFavorites = async () => {
  try {
    const res = await fetchWithAuth("http://localhost:8000/api/favorites/");
    if (res.ok) {
      const data = await res.json();
      return data.favorites || [];  
    } else {
      console.error('お気に入り取得失敗');
      return [];  
    }
  } catch (err) {
    console.error('通信エラー:', err);
    return []; 
  }
};

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

import { fetchWithAuth } from './fetchWithAuth';

export const fetchFavorites = async () => {
  try {
    const res = await fetchWithAuth(`${BASE_URL}/api/favorites/`);
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

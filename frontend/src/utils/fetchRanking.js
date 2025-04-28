export const fetchRanking = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/trend/all/');
      if (res.ok) {
        const data = await res.json();
        return data.articles || [];
      } else {
        console.error('ランキング取得失敗');
        return [];
      }
    } catch (err) {
      console.error('通信エラー:', err);
      return [];
    }
  };
  
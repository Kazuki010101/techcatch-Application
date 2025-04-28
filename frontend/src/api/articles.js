const API_BASE = process.env.REACT_APP_API_URL;

export const fetchArticles = async() => {
    try {
        const res = await fetch(`${API_BASE}/api/scrape/qiita/`)
        if (!res.ok) throw new Error('データの取得に失敗');
        return await res.json();
    } catch (error) {
        console.error('API error', error);
        return [];
    }
}

export const generateChartData = (favorites) => {
    const siteCounts = {
      Qiita: 0,
      Zenn: 0,
      Note: 0,
      その他: 0,
    };
  
    favorites.forEach(article => {
      const category = article.category || 'その他';
      if (siteCounts.hasOwnProperty(category)) {
        siteCounts[category]++;
      } else {
        siteCounts['その他']++;
      }
    });
  
    const labels = ['Qiita', 'Zenn', 'Note', 'その他'];
    const counts = labels.map(label => siteCounts[label]);
  
    const backgroundColor = [
      '#10b981', // 緑 Qiita
      '#3b82f6', // 青 Zenn
      '#fbbf24', // 黄 Note
      '#9ca3af', // グレー その他
    ];
  
    return {
      labels,
      datasets: [{
        label: 'お気に入り数',
        data: counts,
        backgroundColor: backgroundColor,
        borderWidth: 1,
      }]
    };
  };
  
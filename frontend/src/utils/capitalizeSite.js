export const capitalizeSite = (site) => {
    if (!site) return '';
    return site.charAt(0).toUpperCase() + site.slice(1).toLowerCase();
  };
  
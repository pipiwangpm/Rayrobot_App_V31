/* Keep the prototype's cloud and local navigation in sync. */
(() => {
  const query = new URLSearchParams(location.search).get('m');
  const explicit = query === 'local' || query === 'cloud' ? query : null;
  const mode = explicit || (localStorage.getItem('robops.mode') === 'local' ? 'local' : 'cloud');
  if (explicit) localStorage.setItem('robops.mode', explicit);
  document.documentElement.dataset.mode = mode;
  window.RobotMode = {
    current: mode,
    link(path) {
      if (mode !== 'local') return path;
      const url = new URL(path, location.href);
      if (url.protocol !== 'file:' || !url.pathname.endsWith('.html')) return path;
      if (!url.searchParams.has('m')) url.searchParams.set('m', 'local');
      return url.pathname.split('/').pop() + url.search + url.hash;
    }
  };
  if (mode === 'local' && location.pathname.endsWith('/agents.html')) {
    location.replace(RobotMode.link('home.html'));
    return;
  }
  const style = document.createElement('style');
  style.textContent = 'html[data-mode="local"] a[href*="agents.html"]{display:none!important}';
  document.head.appendChild(style);
  document.addEventListener('DOMContentLoaded', () => {
    if (mode !== 'local') return;
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (href) a.setAttribute('href', RobotMode.link(href));
    });
  });
})();

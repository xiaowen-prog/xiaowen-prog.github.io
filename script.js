(() => {
  const root = document.documentElement;
  root.classList.add('js');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isMobile = () => window.matchMedia('(max-width: 650px)').matches;

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  const revealItems = [...document.querySelectorAll('[data-reveal]')];
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const buttons = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('[data-project-list] .project')];
  const result = document.querySelector('#result');
  const allowedFilters = new Set(buttons.map((button) => button.dataset.filter));
  const queryFilter = new URLSearchParams(window.location.search).get('filter');
  const applyFilter = (filter, updateUrl = true) => {
      const nextFilter = allowedFilters.has(filter) ? filter : 'all';
      let visible = 0;
      buttons.forEach((item) => {
        const active = item.dataset.filter === nextFilter;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      projects.forEach((project) => {
        const show = nextFilter === 'all' || project.dataset.type === nextFilter;
        project.classList.toggle('is-filtered-out', !show);
        if (show) visible += 1;
      });
      if (result) result.textContent = `展示 ${visible} 个项目`;
      if (updateUrl) {
        const url = new URL(window.location.href);
        if (nextFilter === 'all') url.searchParams.delete('filter');
        else url.searchParams.set('filter', nextFilter);
        window.history.replaceState({}, '', url);
      }
  };
  buttons.forEach((button) => {
    button.addEventListener('click', () => applyFilter(button.dataset.filter || 'all'));
  });
  applyFilter(queryFilter || 'all', false);
  window.addEventListener('popstate', () => {
    const filter = new URLSearchParams(window.location.search).get('filter');
    applyFilter(filter || 'all', false);
  });

  const copyButton = document.querySelector('#copy-wechat');
  const copyState = document.querySelector('#copy-state');
  const contactStatus = document.querySelector('#contact-status');
  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      const value = copyButton.dataset.copyValue || '';
      try {
        await navigator.clipboard.writeText(value);
        if (copyState) copyState.textContent = '已复制';
        if (contactStatus) contactStatus.textContent = '微信号已复制到剪贴板。';
      } catch {
        if (copyState) copyState.textContent = '请手动复制';
        if (contactStatus) contactStatus.textContent = '当前浏览器不允许自动复制，请手动选择微信号。';
      }
      window.setTimeout(() => {
        if (copyState) copyState.textContent = '复制';
        if (contactStatus) contactStatus.textContent = '';
      }, 2800);
    });
  }

  const hero = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero-image');
  let frame = 0;
  const updateHero = () => {
    frame = 0;
    if (!hero || !heroImage || reduceMotion.matches || isMobile()) return;
    const rect = hero.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
    heroImage.style.setProperty('--hero-shift', `${progress * 20}px`);
    heroImage.style.setProperty('--hero-scale', `${1.02 + progress * 0.025}`);
  };
  const requestHeroUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(updateHero);
  };
  if (hero && heroImage && !reduceMotion.matches && !isMobile()) {
    window.addEventListener('scroll', requestHeroUpdate, { passive: true });
    window.addEventListener('resize', requestHeroUpdate, { passive: true });
    requestHeroUpdate();
  }
})();

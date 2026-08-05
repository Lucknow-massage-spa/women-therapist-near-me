
(() => {
  'use strict';
  const q = (s, c=document) => c.querySelector(s);
  const qa = (s, c=document) => [...c.querySelectorAll(s)];

  const navToggle = q('[data-nav-toggle]');
  const nav = q('[data-nav]');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const progress = q('[data-scroll-progress]');
  const backTop = q('[data-back-top]');
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    if (backTop) backTop.classList.toggle('show', window.scrollY > 700);
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  if (backTop) backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:.08}) : null;
  qa('.reveal').forEach(el => observer ? observer.observe(el) : el.classList.add('visible'));

  qa('.faq-item').forEach(item => item.classList.add('js-ready'));
  qa('[data-faq-question]').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const open = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
    });
  });

  const search = q('[data-directory-search]');
  const items = qa('[data-directory-item]');
  const noResults = q('[data-no-results]');
  const filterButtons = qa('[data-filter]');
  let activeFilter = 'all';
  const applyFilter = () => {
    if (!search) return;
    const query = search.value.trim().toLowerCase();
    let shown = 0;
    items.forEach(item => {
      const text = (item.dataset.search || item.textContent).toLowerCase();
      const category = item.dataset.category || 'all';
      const show = text.includes(query) && (activeFilter === 'all' || category === activeFilter);
      item.hidden = !show;
      if (show) shown += 1;
    });
    if (noResults) noResults.classList.toggle('show', shown === 0);
  };
  if (search) search.addEventListener('input', applyFilter);
  filterButtons.forEach(btn => btn.addEventListener('click', () => {
    activeFilter = btn.dataset.filter || 'all';
    filterButtons.forEach(b => b.classList.toggle('active', b === btn));
    applyFilter();
  }));

  const bookingForm = q('[data-booking-form]');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const fd = new FormData(bookingForm);
      const clean = (value, max=140) => String(value || '').replace(/[<>`{}]/g, '').replace(/\s+/g, ' ').trim().slice(0,max);
      const name = clean(fd.get('name'), 60);
      const phone = clean(fd.get('phone'), 20).replace(/[^0-9+ -]/g, '');
      const area = clean(fd.get('area'), 80);
      const service = clean(fd.get('service'), 100);
      const message = clean(fd.get('message'), 300);
      const status = q('[data-form-status]', bookingForm);
      if (name.length < 2 || !/^\+?[0-9 -]{10,16}$/.test(phone) || !area || !service) {
        if (status) status.textContent = 'Please fill name, valid phone number, area and service.';
        return;
      }
      const text = [
        'Premium Women Therapist - New Booking Request',
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Area: ${area}`,
        `Service: ${service}`,
        `Message: ${message || '-'}`
      ].join('\n');
      const url = `https://wa.me/919795648156?text=${encodeURIComponent(text)}`;
      if (status) status.textContent = 'WhatsApp chat is opening securely.';
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  // Content-copy deterrent only. It cannot provide absolute copy protection.
  const notice = q('[data-copy-notice]');
  const showNotice = () => {
    if (!notice) return;
    notice.classList.add('show');
    window.setTimeout(() => notice.classList.remove('show'), 1800);
  };
  const isEditable = (target) => target && (target.closest('input, textarea, select, [contenteditable="true"]'));
  document.addEventListener('contextmenu', event => {
    if (!isEditable(event.target) && event.target.closest('.protected-content')) {
      event.preventDefault(); showNotice();
    }
  });
  document.addEventListener('copy', event => {
    if (!isEditable(event.target) && event.target.closest('.protected-content')) {
      event.preventDefault(); showNotice();
    }
  });
  document.addEventListener('cut', event => {
    if (!isEditable(event.target) && event.target.closest('.protected-content')) {
      event.preventDefault(); showNotice();
    }
  });
  document.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    if (!isEditable(event.target) && (event.ctrlKey || event.metaKey) && ['c','u','s'].includes(key)) {
      event.preventDefault(); showNotice();
    }
  });
  qa('img').forEach(img => img.addEventListener('dragstart', event => event.preventDefault()));
})();

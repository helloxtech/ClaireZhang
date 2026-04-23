/* ============================================================
   Claire Zhang — Main JS
   Handles: mobile nav, fade-in observer, gallery filters, modal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Mobile Nav Toggle --- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --- Mark active nav link --- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* --- Intersection Observer for fade-in --- */
  const faders = document.querySelectorAll('.fade-in');
  if (faders.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    faders.forEach(el => observer.observe(el));
  } else {
    faders.forEach(el => el.classList.add('visible'));
  }

  /* --- Gallery Filters --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        galleryItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* --- Artwork Modal --- */
  const overlay = document.querySelector('.modal-overlay');
  const modalImg = document.querySelector('.modal-image');
  const modalBody = document.querySelector('.modal-body');
  const modalClose = document.querySelector('.modal-close');

  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      if (!overlay) return;
      const data = JSON.parse(trigger.dataset.modal);
      if (modalImg) modalImg.src = data.image;
      if (modalImg) modalImg.alt = data.alt || data.title;
      if (modalBody) {
        modalBody.innerHTML = `
          <div class="card-meta">${data.medium || ''} ${data.dimensions ? '· ' + data.dimensions : ''}</div>
          <h3>${data.title}</h3>
          <p class="perf-meta"><span>${data.year || ''}</span>${data.category ? '<span>' + data.category + '</span>' : ''}</p>
          <p class="card-desc">${data.description || ''}</p>
          ${data.reflection ? '<p style="margin-top:1rem;font-style:italic;color:var(--text-light)">' + data.reflection + '</p>' : ''}
        `;
      }
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  function closeModal() {
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

});

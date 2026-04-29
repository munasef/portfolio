/* ═══════════════════════════════════════
   BUILD A CARD element from a project object
═══════════════════════════════════════ */
function makeCard(project, index, isFeatured) {
  const card = document.createElement('article');
  card.className = 'project-card' + (isFeatured ? ' featured-card' : '');
  card.dataset.index = index;
  card.dataset.tags  = (project.tags || []).join(',');

  const studioYear = [project.studio, project.year].filter(Boolean).join(' · ');

  const hasVideo = project.youtube || project.vimeo;
  const playIcon = hasVideo
    ? `<span class="overlay-play">
         <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
       </span>`
    : '';

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-media">
        <img src="${project.poster}" alt="${project.title}" loading="lazy" />
        <div class="card-overlay">
          <div class="card-overlay-inner">
            ${playIcon}
            <span class="overlay-cta">View Project</span>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <div>
          <h3 class="card-title-text">${project.title}</h3>
          <p class="card-meta-text">${studioYear}</p>
        </div>
        <span class="card-type-badge">${project.type}</span>
      </div>
    </div>`;

  card.addEventListener('click', () => openModal(index));
  return card;
}


/* ═══════════════════════════════════════
   RENDER — split featured vs filmography
═══════════════════════════════════════ */
function renderProjects() {
  const featuredGrid = document.getElementById('featuredGrid');
  const allGrid      = document.getElementById('allGrid');

  PROJECTS.forEach((project, index) => {
    const card = makeCard(project, index, !!project.featured);
    if (project.featured) {
      featuredGrid.appendChild(card);
    } else {
      allGrid.appendChild(card);
    }
  });

  // fade-in on scroll
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.project-card').forEach(c => observer.observe(c));
}


/* ═══════════════════════════════════════
   FILTER BAR
═══════════════════════════════════════ */
function initFilters() {
  const bar     = document.getElementById('filterBar');
  const wrapper = document.getElementById('allProjectsWrapper');

  FILTERS.forEach(f => {
    const btn = document.createElement('button');
    btn.className      = 'filter-btn' + (f.value === 'all' ? ' active' : '');
    btn.dataset.filter = f.value;
    btn.textContent    = f.label;
    bar.appendChild(btn);
  });

  bar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter    = btn.dataset.filter;
    const isAll     = filter === 'all';

    // filter every card in both grids
    document.querySelectorAll('.project-card').forEach(card => {
      const tags  = card.dataset.tags ? card.dataset.tags.split(',') : [];
      const match = isAll || tags.includes(filter);
      card.classList.toggle('hidden', !match);
    });

    // when a specific filter is active, expand the filmography so all results are visible
    if (!isAll) {
      expandFilmography();
    } else {
      collapseFilmography();
    }
  });
}


/* ═══════════════════════════════════════
   FILMOGRAPHY VEIL (show / collapse)
═══════════════════════════════════════ */
function expandFilmography() {
  const wrapper = document.getElementById('allProjectsWrapper');
  if (wrapper.classList.contains('expanded')) return;

  wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
  wrapper.classList.remove('collapsed');
  wrapper.classList.add('expanded');

  wrapper.addEventListener('transitionend', () => {
    if (wrapper.classList.contains('expanded')) wrapper.style.maxHeight = 'none';
  }, { once: true });
}

function collapseFilmography() {
  const wrapper = document.getElementById('allProjectsWrapper');
  if (!wrapper.classList.contains('expanded')) return;

  // force a pixel height before transitioning back to 520px
  wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      wrapper.style.maxHeight = '520px';
      wrapper.classList.remove('expanded');
      wrapper.classList.add('collapsed');
    });
  });
}

function initVeil() {
  document.getElementById('showAllBtn').addEventListener('click', expandFilmography);
  document.getElementById('collapseBtn').addEventListener('click', () => {
    collapseFilmography();
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
  });
}


/* ═══════════════════════════════════════
   MODAL
═══════════════════════════════════════ */
const overlay    = document.getElementById('modalOverlay');
const modalMedia = document.getElementById('modalMedia');
const modalBody  = document.getElementById('modalBody');

function openModal(index) {
  const p     = PROJECTS[index];
  const modal = document.getElementById('modal');

  if (p.youtube) {
    modal.classList.remove('modal--poster');
    const thumb = `https://img.youtube.com/vi/${p.youtube}/maxresdefault.jpg`;
    const ytUrl = `https://www.youtube.com/watch?v=${p.youtube}`;
    modalMedia.innerHTML = `
      <a class="yt-preview" href="${ytUrl}" target="_blank" rel="noopener" aria-label="Watch trailer on YouTube">
        <img src="${thumb}" alt="${p.title} trailer" />
        <div class="yt-play-btn">
          <svg viewBox="0 0 68 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="68" height="48" rx="10" fill="rgba(0,0,0,0.65)"/>
            <path d="M45 24L27 34V14L45 24Z" fill="white"/>
          </svg>
          <span class="yt-label">Watch on YouTube</span>
        </div>
      </a>`;
  } else if (p.vimeo) {
    modal.classList.remove('modal--poster');
    modalMedia.innerHTML = `
      <iframe
        src="https://player.vimeo.com/video/${p.vimeo}?autoplay=1&color=ff5c2b&title=0&byline=0&portrait=0&dnt=1"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen>
      </iframe>`;
  } else {
    modal.classList.add('modal--poster');
    modalMedia.innerHTML = `<img src="${p.poster}" alt="${p.title}" />`;
  }

  modalBody.innerHTML = `
    <div class="modal-tags">
      <span class="modal-tag modal-tag-type">${p.type}</span>
      ${p.year ? `<span class="modal-tag modal-tag-year">${p.year}</span>` : ''}
    </div>
    <h2 class="modal-title" id="modalTitle">${p.title}</h2>
    <p class="modal-role">${[p.role, p.studio].filter(Boolean).join(' &nbsp;·&nbsp; ')}</p>
    ${p.description ? `<p class="modal-description">${p.description}</p>`                        : ''}
    ${p.tools       ? `<p class="modal-tools"><strong>Tools</strong> &nbsp;·&nbsp; ${p.tools}</p>` : ''}
  `;

  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { modalMedia.innerHTML = ''; modalBody.innerHTML = ''; }, 260);
}

function openShowreel() {
  const modal = document.getElementById('modal');
  modal.classList.remove('modal--poster');
  modalMedia.innerHTML = `
    <iframe
      src="https://player.vimeo.com/video/902276602?autoplay=1&color=ff5c2b&title=0&byline=0&portrait=0&dnt=1"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen>
    </iframe>`;
  modalBody.innerHTML = `
    <div class="modal-tags"><span class="modal-tag modal-tag-type">Showreel</span></div>
    <h2 class="modal-title" id="modalTitle">Alexander Jarosch — VFX Showreel</h2>
    <p class="modal-role">Lead FX Technical Director &nbsp;·&nbsp; Lead VFX Artist</p>
  `;
  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function initModal() {
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('showreelBtn').addEventListener('click', openShowreel);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
}


/* ═══════════════════════════════════════
   NAV
═══════════════════════════════════════ */
function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  toggle.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => menu.classList.remove('open'));
  });
}


/* ═══════════════════════════════════════
   PHOTOGRAPHY
═══════════════════════════════════════ */
function renderPhotos() {
  const grid    = document.getElementById('photoGrid');
  const section = document.getElementById('photography');
  if (!grid || typeof PHOTOS === 'undefined' || PHOTOS.length === 0) {
    if (section) section.style.display = 'none';
    return;
  }

  PHOTOS.forEach((photo, i) => {
    const item = document.createElement('div');
    item.className = 'photo-item';

    const img = document.createElement('img');
    img.className    = 'photo-item-thumb';
    img.src          = photo.src;
    img.alt          = photo.caption || '';
    img.loading      = 'lazy';
    img.draggable    = false;
    img.onerror      = () => { item.style.display = 'none'; };
    item.appendChild(img);

    if (photo.caption) {
      const cap = document.createElement('span');
      cap.className   = 'photo-caption';
      cap.textContent = photo.caption;
      item.appendChild(cap);
    }

    item.addEventListener('click', () => openPhotoLightbox(i));
    grid.appendChild(item);
  });
}

let _lbIndex = 0;

function openPhotoLightbox(index) {
  _lbIndex = index;
  _updateLightboxPhoto(index);
  document.getElementById('photoLightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function _updateLightboxPhoto(index) {
  _lbIndex = index;
  const p   = PHOTOS[index];
  const img = document.getElementById('photoLightboxImg');
  const cap = document.getElementById('photoLightboxCaption');
  img.src = p.src;
  img.alt = p.caption || '';
  cap.textContent  = p.caption || '';
  cap.style.display = p.caption ? '' : 'none';
}

function closePhotoLightbox() {
  document.getElementById('photoLightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function initPhotoLightbox() {
  const lb = document.getElementById('photoLightbox');
  if (!lb) return;

  document.getElementById('photoLightboxClose').addEventListener('click', closePhotoLightbox);

  document.getElementById('photoLightboxPrev').addEventListener('click', () => {
    _updateLightboxPhoto((_lbIndex - 1 + PHOTOS.length) % PHOTOS.length);
  });

  document.getElementById('photoLightboxNext').addEventListener('click', () => {
    _updateLightboxPhoto((_lbIndex + 1) % PHOTOS.length);
  });

  lb.addEventListener('click', e => { if (e.target === lb) closePhotoLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closePhotoLightbox();
    if (e.key === 'ArrowLeft')  _updateLightboxPhoto((_lbIndex - 1 + PHOTOS.length) % PHOTOS.length);
    if (e.key === 'ArrowRight') _updateLightboxPhoto((_lbIndex + 1) % PHOTOS.length);
  });
}


/* ═══════════════════════════════════════
   PHOTO VEIL (expand / collapse)
═══════════════════════════════════════ */
function initPhotoVeil() {
  const wrapper = document.getElementById('photoWrapper');
  if (!wrapper) return;

  document.getElementById('showAllPhotosBtn').addEventListener('click', () => {
    wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
    wrapper.classList.remove('collapsed');
    wrapper.classList.add('expanded');
    wrapper.addEventListener('transitionend', () => {
      if (wrapper.classList.contains('expanded')) wrapper.style.maxHeight = 'none';
    }, { once: true });
  });

  document.getElementById('collapsePhotosBtn').addEventListener('click', () => {
    wrapper.style.maxHeight = wrapper.scrollHeight + 'px';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        wrapper.style.maxHeight = '480px';
        wrapper.classList.remove('expanded');
        wrapper.classList.add('collapsed');
      });
    });
    document.getElementById('photography').scrollIntoView({ behavior: 'smooth' });
  });
}


/* ═══════════════════════════════════════
   INIT
═══════════════════════════════════════ */
renderProjects();
initFilters();
initVeil();
initModal();
initNav();
renderPhotos();
initPhotoVeil();
initPhotoLightbox();

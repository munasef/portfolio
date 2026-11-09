// Element to return focus to when a dialog closes
let lastFocus = null;

/* ═══════════════════════════════════════
   HERO REEL — skip it for reduced motion
═══════════════════════════════════════ */
function initHeroReel() {
  const iframe = document.getElementById('heroVimeo');
  if (!iframe) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) iframe.remove();
  else iframe.src = iframe.dataset.src;
}


/* Click + Enter/Space opens the project modal */
function makeOpenable(el, index) {
  el.tabIndex = 0;
  el.setAttribute('role', 'button');
  el.addEventListener('click', () => openModal(index));
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(index); }
  });
}


/* ═══════════════════════════════════════
   HIGHLIGHTS — featured:true projects
═══════════════════════════════════════ */
function makeCard(project, index) {
  const card = document.createElement('article');
  card.className = 'project-card';
  card.dataset.index = index;
  card.innerHTML = `
    <div class="poster"><img src="${project.poster}" alt="" loading="lazy" onerror="this.remove()" /></div>
    <p>${project.title}</p>
    <small>${[project.studio, project.year].filter(Boolean).join(', ')}</small>`;
  makeOpenable(card, index);
  return card;
}

function renderProjects() {
  const grid = document.getElementById('featuredGrid');
  PROJECTS.forEach((p, i) => { if (p.featured) grid.appendChild(makeCard(p, i)); });
}


/* ═══════════════════════════════════════
   CREDITS TABLE — every project, games first
═══════════════════════════════════════ */
const CREDIT_GROUPS = [
  { label: 'Games',     match: p => (p.tags || []).includes('Games') },
  { label: 'Film & TV', match: p => !(p.tags || []).includes('Games') },
];

function renderCredits() {
  const table = document.getElementById('creditsTable');
  CREDIT_GROUPS.forEach(group => {
    const body = document.createElement('tbody');
    body.innerHTML = `<tr><th class="credit-group" colspan="4" scope="colgroup">${group.label}</th></tr>`;
    PROJECTS.forEach((p, i) => {
      if (!group.match(p)) return;
      const row = document.createElement('tr');
      row.className = 'credit-row';
      row.dataset.index = i;
      row.innerHTML = `<td>${p.year || ''}</td><td>${p.title}</td><td>${p.studio || ''}</td><td class="col-role">${p.role || ''}</td>`;
      makeOpenable(row, i);
      body.appendChild(row);
    });
    table.appendChild(body);
  });
  document.getElementById('creditCount').textContent = `${PROJECTS.length} credits`;
}


/* ═══════════════════════════════════════
   FILTERS
═══════════════════════════════════════ */
function applyFilters() {
  const active = document.querySelector('#filterBar .filter-btn.active');
  const filter = active ? active.dataset.filter : 'all';
  const counts = { featuredGrid: 0, creditsBlock: 0 };

  document.querySelectorAll('.project-card, .credit-row').forEach(el => {
    const show = filter === 'all' || (PROJECTS[el.dataset.index].tags || []).includes(filter);
    el.classList.toggle('hidden', !show);
    if (show) counts[el.classList.contains('project-card') ? 'featuredGrid' : 'creditsBlock']++;
  });

  for (const id in counts) document.getElementById(id).classList.toggle('hidden', counts[id] === 0);
  clipCredits();
}


/* Credits list: first CREDITS_PREVIEW visible rows, rest behind a toggle */
const CREDITS_PREVIEW = 10;
let creditsExpanded = false;

function clipCredits() {
  let n = 0;
  document.querySelectorAll('.credit-row').forEach(row => {
    const visible = !row.classList.contains('hidden');
    if (visible) n++;
    row.classList.toggle('clipped', visible && !creditsExpanded && n > CREDITS_PREVIEW);
  });
  // A group heading shows only while its group has a row on screen
  document.querySelectorAll('.credit-group').forEach(th => {
    const rows = th.closest('tbody').querySelectorAll('.credit-row:not(.hidden):not(.clipped)');
    th.parentElement.classList.toggle('hidden', rows.length === 0);
  });
  const btn = document.getElementById('creditsToggle');
  btn.classList.toggle('hidden', n <= CREDITS_PREVIEW);
  btn.textContent = creditsExpanded ? 'Show fewer' : `Show all ${n} credits`;
}

function initCreditsToggle() {
  document.getElementById('creditsToggle').addEventListener('click', () => {
    creditsExpanded = !creditsExpanded;
    clipCredits();
    if (!creditsExpanded) document.getElementById('creditsBlock').scrollIntoView({ block: 'start' });
  });
  clipCredits();
}

function initFilters() {
  const bar = document.getElementById('filterBar');
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
    bar.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
    applyFilters();
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
        src="https://player.vimeo.com/video/${p.vimeo}?autoplay=1&color=e9c58a&title=0&byline=0&portrait=0&dnt=1"
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
    ${(p.awards || (p.award ? [p.award] : [])).slice().sort((a, b) => (b.startsWith('Academy') ? 1 : 0) - (a.startsWith('Academy') ? 1 : 0)).map(a => `<p class="modal-award"><span class="modal-award-star">★</span>${a}</p>`).join('')}
    <h2 class="modal-title" id="modalTitle">${p.title}</h2>
    <p class="modal-role">${[p.role, p.studio].filter(Boolean).join(' &nbsp;·&nbsp; ')}</p>
    ${p.description ? `<p class="modal-description">${p.description}</p>`                        : ''}
    ${p.tools       ? `<p class="modal-tools"><strong>Tools</strong> &nbsp;·&nbsp; ${p.tools}</p>` : ''}
  `;

  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('open');
  lastFocus = document.activeElement;
  document.getElementById('modalClose').focus();
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  if (lastFocus) lastFocus.focus();
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { modalMedia.innerHTML = ''; modalBody.innerHTML = ''; }, 260);
}

function openShowreel() {
  const modal = document.getElementById('modal');
  modal.classList.remove('modal--poster');
  modalMedia.innerHTML = `
    <iframe
      src="https://player.vimeo.com/video/902276602?autoplay=1&color=e9c58a&title=0&byline=0&portrait=0&dnt=1"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen>
    </iframe>`;
  modalBody.innerHTML = `
    <h2 class="modal-title" id="modalTitle">Showreel</h2>
    <p class="modal-role">Lead VFX Artist</p>
  `;
  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('open');
  lastFocus = document.activeElement;
  document.getElementById('modalClose').focus();
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
  lastFocus = document.activeElement;
  document.getElementById('photoLightboxClose').focus();
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
  if (lastFocus) lastFocus.focus();
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
   PHOTOS — "Show all" expands the grid
═══════════════════════════════════════ */
function initPhotoVeil() {
  const wrapper = document.getElementById('photoWrapper');
  const btn = document.getElementById('showAllPhotosBtn');
  if (!wrapper || !btn) return;
  btn.addEventListener('click', () => {
    wrapper.classList.remove('collapsed');
    btn.remove();
  });
}


/* ═══════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = 'Sending...';
    status.className = 'form-status';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        form.reset();
        status.textContent = 'Thanks — message sent!';
        status.className = 'form-status success';
      } else {
        status.textContent = 'Something went wrong. Please try again.';
        status.className = 'form-status error';
      }
    } catch {
      status.textContent = 'Something went wrong. Please try again.';
      status.className = 'form-status error';
    }
  });
}


/* ═══════════════════════════════════════
   INIT
═══════════════════════════════════════ */
initHeroReel();
renderProjects();
renderCredits();
initFilters();
initCreditsToggle();
initModal();
initNav();
renderPhotos();
initPhotoVeil();
initPhotoLightbox();
initContactForm();

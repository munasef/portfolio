if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  // Initialize common elements like Navigation
  initNav();

  // Load appropriate content based on the page elements
  if (document.getElementById('blogList')) {
    loadBlogList();
  } else if (document.getElementById('postContainer')) {
    loadBlogPost();
  }
}

/* ═══════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════ */
function initNav() {
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('open'));
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => menu.classList.remove('open'));
    });
  }
}

/* ═══════════════════════════════════════
   BLOG LIST PAGE (index.html)
   ═══════════════════════════════════════ */
async function loadBlogList() {
  const listEl = document.getElementById('blogList');
  if (!listEl) return;
  
  try {
    const res = await fetch('posts.json?t=' + Date.now());
    if (!res.ok) throw new Error('Failed to fetch posts.json');
    const posts = await res.json();
    
    if (!posts || posts.length === 0) {
      listEl.innerHTML = '<p class="post-error">No posts found yet.</p>';
      return;
    }
    
    listEl.innerHTML = posts.map(post => `
      <article class="blog-card">
        <div class="blog-meta">
          <span>${post.date}</span>
          <span class="blog-meta-dot"></span>
          <span>${post.readTime}</span>
        </div>
        <h2 class="blog-card-title">
          <a href="post.html?post=${post.slug}">${post.title}</a>
        </h2>
        <p class="blog-card-summary">${post.summary}</p>
        <div class="blog-tags">
          ${(post.tags || []).map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
        </div>
      </article>
    `).join('');
  } catch (err) {
    console.error(err);
    listEl.innerHTML = '<div class="post-error"><h2 class="post-error-title">Error</h2><p>Could not load the writing list. Please try again later.</p></div>';
  }
}

/* ═══════════════════════════════════════
   BLOG POST PAGE (post.html)
   ═══════════════════════════════════════ */
async function loadBlogPost() {
  const postContainer = document.getElementById('postContainer');
  if (!postContainer) return;
  
  const params = new URLSearchParams(window.location.search);
  const postSlug = params.get('post');
  
  if (!postSlug) {
    window.location.href = 'index.html';
    return;
  }
  
  try {
    // Fetch posts metadata
    const registryRes = await fetch('posts.json?t=' + Date.now());
    if (!registryRes.ok) throw new Error('Failed to load posts registry');
    const posts = await registryRes.json();
    const postMeta = posts.find(p => p.slug === postSlug);
    
    // Fetch the markdown content
    const mdRes = await fetch(`posts/${postSlug}.md?t=` + Date.now());
    if (!mdRes.ok) {
      throw new Error('Post markdown file not found');
    }
    let mdText = await mdRes.text();
    
    // Clean frontmatter if present in markdown
    if (mdText.startsWith('---')) {
      const parts = mdText.split('---');
      if (parts.length >= 3) {
        mdText = parts.slice(2).join('---').trim();
      }
    } else {
      // If no frontmatter block but has a starting # title, we can strip it since we render it in the header
      mdText = mdText.replace(/^#\s+.+$/m, '').trim();
    }
    
    const title = postMeta ? postMeta.title : postSlug.replace(/-/g, ' ');
    const date = postMeta ? postMeta.date : '';
    const readTime = postMeta ? postMeta.readTime : '';
    const tags = postMeta ? postMeta.tags : [];
    
    document.title = `${title} — Alexander Jarosch`;
    
    // Build page content
    postContainer.innerHTML = `
      <header class="post-header">
        <h1 class="post-title">${title}</h1>
        <div class="blog-meta">
          <span>${date}</span>
          <span class="blog-meta-dot"></span>
          <span>${readTime}</span>
        </div>
        ${tags.length ? `
          <div class="blog-tags" style="margin-top: 20px;">
            ${tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
          </div>
        ` : ''}
      </header>
      <div class="post-body">
        ${marked.parse(mdText)}
      </div>
    `;
    
    // Highlight code blocks
    if (typeof Prism !== 'undefined') {
      Prism.highlightAll();
    }
  } catch (err) {
    console.error(err);
    postContainer.innerHTML = `
      <div class="post-error">
        <h2 class="post-error-title">Post Not Found</h2>
        <p>The writing you are looking for does not exist or has been removed.</p>
        <a href="index.html" class="blog-back" style="margin-top: 30px;">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="transform: rotate(180deg); margin-right: 4px;"><polyline points="9 18 15 12 9 6"/></svg>
          Back to writing
        </a>
      </div>
    `;
  }
}

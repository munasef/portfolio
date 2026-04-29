# Publishing Your Portfolio

A step-by-step guide to getting your site live on a custom domain.

---

## Step 1 — Set up a GitHub repository

1. Go to [github.com](https://github.com) and sign in (or create a free account).
2. Click **New repository** (top-right `+` button).
3. Name it `portfolio` (or anything you like).
4. Set it to **Public**.
5. Leave everything else blank — do **not** add a README yet.
6. Click **Create repository**.

---

## Step 2 — Upload your files

You have two options:

### Option A — Drag and drop (simplest)
1. On your new repository page, click **uploading an existing file**.
2. Drag the entire `portfolio/` folder contents into the browser window.
   - Upload all files including subfolders (`css/`, `js/`, `assets/`).
3. Scroll down, add a commit message like `Initial upload`, click **Commit changes**.

### Option B — Git command line
```bash
cd path/to/your/portfolio
git init
git add .
git commit -m "Initial upload"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/portfolio.git
git push -u origin main
```

---

## Step 3 — Enable GitHub Pages

1. In your repository, go to **Settings** → **Pages** (left sidebar).
2. Under **Source**, select **Deploy from a branch**.
3. Set branch to `main`, folder to `/ (root)`.
4. Click **Save**.

GitHub will build your site. After ~60 seconds it will be live at:
```
https://YOURUSERNAME.github.io/portfolio
```

---

## Step 4 — Buy a domain (optional but recommended)

Recommended registrars:
- **Namecheap** — namecheap.com (often cheapest, clean UI)
- **Porkbun** — porkbun.com (very cheap, good free WHOIS privacy)
- **Cloudflare Registrar** — at-cost pricing, no markup

Search for your name as a `.com`, e.g. `yourname.com` or `yournamevfx.com`.
Typical cost: $10–15/year.

---

## Step 5 — Point your domain to GitHub Pages

### In your domain registrar — add these DNS records:

| Type  | Host | Value                    |
|-------|------|--------------------------|
| A     | @    | 185.199.108.153          |
| A     | @    | 185.199.109.153          |
| A     | @    | 185.199.110.153          |
| A     | @    | 185.199.111.153          |
| CNAME | www  | YOURUSERNAME.github.io   |

> DNS changes can take anywhere from a few minutes to 48 hours to propagate.

### In GitHub Pages settings:
1. Go back to **Settings → Pages**.
2. Under **Custom domain**, type your domain (e.g. `yourname.com`).
3. Click **Save**.
4. Tick **Enforce HTTPS** once it appears (gives you a free SSL certificate).

Your site will then be live at `https://yourname.com`.

---

## Step 6 — Updating the site later

Whenever you add a new project or edit text, just re-upload the changed files to GitHub (drag and drop in the browser, or `git push`). The site updates automatically within seconds.

---

## Quick checklist before going live

- [ ] Replace `Your Name` with your real name throughout `index.html`
- [ ] Replace `YN` initials in the nav logo
- [ ] Replace all `YOURUSERNAME` links (GitHub, LinkedIn, Vimeo)
- [ ] Update `your@email.com` in the footer
- [ ] Edit the bio in the About section
- [ ] Add real poster images to `assets/posters/` and update each card's `data-poster`
- [ ] Add real Vimeo video IDs to `data-vimeo` on cards that have video
- [ ] Update the `<title>` tag in `index.html`
- [ ] Update `© 2024` year in the footer

// Guard rails for the Swiss/Warm redesign. Run: node tests/check-design.mjs
import { readFileSync } from 'node:fs';

const read = p => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const css = read('css/style.css'), html = read('index.html'), js = read('js/main.js');
const fails = [];
const no = (src, file, re, what) => { if (re.test(src)) fails.push(`${file}: contains ${what}`); };

no(css, 'style.css', /uppercase/i, 'uppercase');
no(css, 'style.css', /Space Mono|Cabinet|Satoshi/i, 'old font');
no(css, 'style.css', /d86a2e|f07a37|ff5c2b|ff5a33/i, 'orange');
for (const [, v] of css.matchAll(/letter-spacing:\s*(-?[\d.]+)em/g))
  if (parseFloat(v) > 0.01) fails.push(`style.css: letter-spacing ${v}em`);

no(html, 'index.html', /fontshare|Space\+Mono/i, 'old font link');
no(html, 'index.html', /projectSearch|showAllBtn|projectsVeil/, 'search/veil markup');
no(html, 'index.html', /[\u{1F1E6}-\u{1F1FF}]/u, 'flag emoji');
no(html, 'index.html', /mailto:/i, 'visible email');
no(js, 'main.js', /ff5c2b/i, 'orange vimeo color');

// WCAG contrast of --text and --muted against --bg
const token = n => (css.match(new RegExp(`--${n}:\\s*(#[0-9a-f]{6})`, 'i')) || [])[1];
const lum = hex => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const bg = token('bg');
for (const n of ['text', 'muted']) {
  const c = token(n);
  if (!bg || !c) fails.push(`style.css: missing --${n} or --bg`);
  else if (ratio(c, bg) < 4.5) fails.push(`style.css: --${n} contrast ${ratio(c, bg).toFixed(2)} < 4.5`);
}

if (fails.length) { console.log(fails.join('\n')); process.exit(1); }
console.log('design check ok');

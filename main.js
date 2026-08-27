/* ============ shared behaviour ============ */
const nav = document.getElementById('nav');
const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* scroll progress bar + nav state */
const bar = document.createElement('div');
bar.className = 'progress';
document.body.appendChild(bar);
addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', scrollY > 12);
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
}, { passive: true });

/* magnetic hover for buttons */
function magnetic(el, strength = 0.28) {
  el.classList.add('magnetic');
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
}
function enableMagnetic() {
  if (!canHover) return;
  document.querySelectorAll('.btn, .nav-links a.cv').forEach(b => magnetic(b, 0.25));
}

/* subtle 3D tilt on project thumbnails */
function enableTilt() {
  if (!canHover) return;
  document.querySelectorAll('.proj-thumb').forEach(t => {
    t.addEventListener('mousemove', e => {
      const r = t.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      t.style.transform = `translateY(-4px) perspective(800px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg)`;
    });
    t.addEventListener('mouseleave', () => { t.style.transform = ''; });
  });
}

/* reveal on scroll */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* count-up for impact stats (fires once when scrolled into view) */
function countUp(el) {
  const to = parseFloat(el.dataset.to || '0');
  const dec = parseInt(el.dataset.dec || '0', 10);
  const sfx = el.dataset.suffix || '';
  const dur = 1400;
  const wrap = v => `${(+v).toFixed(dec)}${sfx ? `<span class="sfx">${sfx}</span>` : ''}`;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { el.innerHTML = wrap(to); return; }
  let start = null;
  function frame(ts) {
    if (start === null) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.innerHTML = wrap(to * eased);
    if (p < 1) requestAnimationFrame(frame); else el.innerHTML = wrap(to);
  }
  requestAnimationFrame(frame);
}
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); countIO.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.num').forEach(el => countIO.observe(el));

/* theme toggle (persisted) */
const themeBtn = document.getElementById('themeToggle');
if (themeBtn) themeBtn.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
});

/* intro overlay — plays once per session on the landing page */
const intro = document.getElementById('intro');
if (intro) {
  const reduceIntro = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceIntro || document.documentElement.classList.contains('no-intro')) {
    intro.remove();
  } else {
    intro.classList.add('play');
    try { sessionStorage.setItem('introSeen', '1'); } catch (e) {}
    intro.addEventListener('animationend', e => { if (e.animationName === 'introUp') intro.remove(); });
  }
}

/* ---------- WORK: case studies (shared by landing + case-study pages) ---------- */
const caseStudies = [
  {
    id: 'atlas', name: 'Atlas', kind: 'Design System', yr: '2025—26', accent: '#2faa5e', icon: '🧩',
    subtitle: 'A design system that stopped UI debates and helped 4 product teams ship faster.',
    benefits: ['Fewer debates', 'Faster delivery', 'Dev-rated 4.8/5', 'Shared UX standards'],
    gallery: ['grid', 'dashboard', 'grid', 'cards', 'grid'],
    title: 'Building one system that ended the UI debates',
    role: ['Lead Product Designer', 'Design Systems'],
    status: ['Shipped', '2025—26'],
    type: ['Design System', 'Tokens', 'Docs'],
    intro: [
      'Atlas is a multi-brand design system serving four product teams. Before it existed, every squad rebuilt the same components — and argued about each one in review.',
      'I owned it end-to-end: the token layer, the component library, the documentation, and the rollout.'
    ],
    problems: 'Three brands, four teams, and no shared language. Components drifted, accessibility was inconsistent, and design reviews turned into colour-and-spacing debates instead of product conversations.',
    solution: 'I defined a token layer of 200+ decisions across three brands, built 60 production-ready components with usage docs, and ran adoption workshops so engineers could ship without re-asking the same questions.',
    results: 'Debates dropped and delivery sped up. Developers rated the system 4.8/5 for speed and clarity, and shared UX standards now hold across every squad.'
  },
  {
    id: 'northwind', name: 'Northwind', kind: 'B2B Logistics', yr: '2025', accent: '#e8552f', icon: '🚚',
    subtitle: 'Turning a dense operations dashboard into a tool teams actually trust.',
    benefits: ['38% faster tasks', '6 tools → 1', '2,000+ daily users', 'Clearer hierarchy'],
    gallery: ['dashboard', 'dashboard', 'cards', 'grid', 'dashboard'],
    title: 'Redesigning a dense operations dashboard from the ground up',
    role: ['Sole Product Designer', 'UX + UI'],
    status: ['Shipped', '2025'],
    type: ['B2B', 'Dashboard', 'Enterprise'],
    intro: [
      'Northwind runs freight operations for mid-size logistics firms. Dispatchers lived in six different tools and a wall of spreadsheets.',
      'I led the redesign that consolidated the workflow into a single, trustworthy operations console.'
    ],
    problems: 'Critical information was scattered across six tools. Dispatchers context-switched constantly, mistakes were costly, and onboarding a new operator took weeks.',
    solution: 'I mapped the real dispatcher workflow, prioritised a clear information hierarchy, and unified planning, tracking, and exceptions into one console with sensible defaults and fast keyboard paths.',
    results: 'Task completion got 38% faster, six tools collapsed into one, and the console now serves 2,000+ daily users with far less training overhead.'
  },
  {
    id: 'lumen', name: 'Lumen Pay', kind: 'Consumer Fintech', yr: '2024', accent: '#3f5bbb', icon: '💸',
    subtitle: 'Making saving money feel effortless instead of a chore people avoid.',
    benefits: ['+24% activation', '4.9 App Store', 'Habit-forming flows', 'End-to-end prototype'],
    gallery: ['phone', 'phone', 'cards', 'phone', 'grid'],
    title: 'Turning saving money into a habit people enjoy',
    role: ['Product Designer', 'Prototyping'],
    status: ['Concept → MVP', '2024'],
    type: ['Mobile', 'Fintech', 'B2C'],
    intro: [
      'Lumen Pay helps people save automatically without thinking about it. The challenge was emotional as much as functional — saving feels like a chore.',
      'I designed the end-to-end mobile experience and a clickable prototype used for the first investor round.'
    ],
    problems: 'Saving apps are full of friction and guilt. Users set up an account, never funded it, and churned within a week.',
    solution: 'I designed gentle, habit-forming flows: tiny automatic round-ups, playful progress, and zero-pressure goals — paired with a motion-led prototype that made the payoff feel immediate.',
    results: 'Week-one activation rose 24%, the prototype earned a 4.9 rating in early testing, and the flows became the backbone of the shipped MVP.'
  },
  {
    id: 'verde', name: 'Verde Market', kind: 'E-commerce', yr: '2023', accent: '#d99a16', icon: '🥬',
    subtitle: 'Reimagining a hyperlocal grocery marketplace around speed and trust.',
    benefits: ['3-tap checkout', '+18% basket size', 'Research-led IA', 'Marketplace viability'],
    gallery: ['cards', 'phone', 'cards', 'grid', 'phone'],
    title: 'Reimagining hyperlocal grocery around speed and trust',
    role: ['Product Designer', 'UX Research'],
    status: ['Shipped', '2023'],
    type: ['E-commerce', 'Mobile', 'Marketplace'],
    intro: [
      'Verde Market connects neighbourhoods with local grocers for same-hour delivery. Early on, browsing was slow and trust was thin.',
      'I led research and redesigned the browse-to-checkout journey for both shoppers and store partners.'
    ],
    problems: 'A confusing catalogue, a long checkout, and no signals of freshness or reliability made shoppers abandon their carts.',
    solution: 'I rebuilt the information architecture around how people actually shop, cut checkout to three taps, and added trust cues — store ratings, live ETAs, and substitution controls.',
    results: 'Checkout dropped to three taps, average basket size grew 18%, and the research-led IA gave the marketplace a viable, repeatable shopping loop.'
  },
];

function mock(kind, a) {
  if (kind === 'phone') return `
    <svg class="mock" width="140" height="210" viewBox="0 0 150 250" fill="none">
      <rect x="2" y="2" width="146" height="246" rx="26" fill="#fff" stroke="${a}" stroke-opacity=".25"/>
      <rect x="16" y="22" width="70" height="12" rx="6" fill="${a}" fill-opacity=".85"/>
      <rect x="16" y="42" width="40" height="8" rx="4" fill="${a}" fill-opacity=".3"/>
      <rect x="16" y="66" width="118" height="64" rx="14" fill="${a}" fill-opacity=".12"/>
      <circle cx="40" cy="98" r="16" fill="${a}" fill-opacity=".8"/>
      <rect x="66" y="84" width="56" height="9" rx="4" fill="${a}" fill-opacity=".4"/>
      <rect x="66" y="100" width="40" height="9" rx="4" fill="${a}" fill-opacity=".25"/>
      <rect x="16" y="146" width="56" height="56" rx="12" fill="${a}" fill-opacity=".18"/>
      <rect x="78" y="146" width="56" height="56" rx="12" fill="${a}" fill-opacity=".3"/>
    </svg>`;
  if (kind === 'grid') return `
    <svg class="mock" width="250" height="190" viewBox="0 0 230 180" fill="none">
      ${[0,1,2,3,4,5].map(i=>{const x=20+(i%3)*70,y=20+Math.floor(i/3)*78;return `<rect x="${x}" y="${y}" width="58" height="64" rx="12" fill="#fff" stroke="${a}" stroke-opacity=".3"/><circle cx="${x+18}" cy="${y+22}" r="9" fill="${a}" fill-opacity="${.3+i*.1}"/><rect x="${x+12}" y="${y+40}" width="34" height="7" rx="3" fill="${a}" fill-opacity=".3"/>`}).join('')}
    </svg>`;
  if (kind === 'cards') return `
    <svg class="mock" width="250" height="190" viewBox="0 0 230 180" fill="none">
      <rect x="20" y="24" width="190" height="30" rx="10" fill="#fff" stroke="${a}" stroke-opacity=".3"/>
      <circle cx="40" cy="39" r="8" fill="${a}" fill-opacity=".7"/>
      <rect x="56" y="35" width="80" height="8" rx="4" fill="${a}" fill-opacity=".35"/>
      ${[0,1,2].map(i=>`<rect x="${20+i*65}" y="70" width="55" height="86" rx="12" fill="${a}" fill-opacity="${.12+i*.08}"/><rect x="${28+i*65}" y="132" width="38" height="7" rx="3" fill="${a}" fill-opacity=".5"/>`).join('')}
    </svg>`;
  return `
    <svg class="mock" width="260" height="195" viewBox="0 0 240 180" fill="none">
      <rect x="16" y="16" width="208" height="148" rx="14" fill="#fff" stroke="${a}" stroke-opacity=".25"/>
      <rect x="16" y="16" width="52" height="148" rx="14" fill="${a}" fill-opacity=".1"/>
      <circle cx="42" cy="40" r="8" fill="${a}" fill-opacity=".7"/>
      <rect x="30" y="60" width="24" height="6" rx="3" fill="${a}" fill-opacity=".4"/>
      <rect x="30" y="74" width="24" height="6" rx="3" fill="${a}" fill-opacity=".25"/>
      <rect x="84" y="34" width="60" height="40" rx="10" fill="${a}" fill-opacity=".18"/>
      <rect x="156" y="34" width="52" height="40" rx="10" fill="${a}" fill-opacity=".3"/>
      <rect x="84" y="86" width="124" height="62" rx="10" fill="${a}" fill-opacity=".1"/>
      <polyline points="92,138 112,118 132,128 152,104 172,114 196,96" fill="none" stroke="${a}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
}

/* tints a mock onto a soft card background */
function shot(kind, accent, i) {
  const tints = [`${accent}10`, `${accent}1c`, `${accent}14`];
  return `<div class="shot" style="background:linear-gradient(135deg, ${tints[i % 3]}, ${accent}26)">${mock(kind, accent)}</div>`;
}

/* drag-to-scroll for a horizontal gallery, plus a cursor-following "Drag" badge */
function enableDragScroll(g) {
  let down = false, startX = 0, sl = 0, moved = false;
  g.addEventListener('mousedown', e => { down = true; moved = false; g.classList.add('dragging'); startX = e.pageX; sl = g.scrollLeft; });
  addEventListener('mouseup', () => { down = false; g.classList.remove('dragging'); });
  g.addEventListener('mouseleave', () => { down = false; g.classList.remove('dragging'); });
  g.addEventListener('mousemove', e => { if (!down) return; e.preventDefault(); if (Math.abs(e.pageX - startX) > 3) moved = true; g.scrollLeft = sl - (e.pageX - startX); });
  g.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
}
function attachDragBadge(wrap, g) {
  if (!canHover) return;
  const badge = document.createElement('div');
  badge.className = 'drag-badge';
  badge.innerHTML = 'Drag <span>🖐</span>';
  wrap.appendChild(badge);
  g.addEventListener('mouseenter', () => badge.classList.add('on'));
  g.addEventListener('mouseleave', () => badge.classList.remove('on'));
  g.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    badge.style.left = (e.clientX - r.left) + 'px';
    badge.style.top = (e.clientY - r.top) + 'px';
  });
}

const list = document.getElementById('workList');
if (list) {
  caseStudies.forEach((p) => {
    const el = document.createElement('article');
    el.className = 'proj reveal';
    el.innerHTML = `
      <div class="proj-head-row">
        <div class="proj-meta"><span class="name">${p.name}</span><span class="kind">${p.kind}</span><span class="yr">${p.yr}</span></div>
        <a class="cs-btn" href="casestudy.html?id=${p.id}">View case study <span>→</span></a>
      </div>
      <p class="subtitle">${p.subtitle}</p>
      <div class="benefits">${p.benefits.map(b => `<span>${b}</span>`).join('')}</div>
      <div class="gallery-wrap">
        <div class="gallery">${p.gallery.map((k, i) => shot(k, p.accent, i)).join('')}</div>
      </div>`;
    list.appendChild(el);
    io.observe(el);
    const g = el.querySelector('.gallery');
    enableDragScroll(g);
    attachDragBadge(el.querySelector('.gallery-wrap'), g);
  });
}

enableMagnetic();

/* ---------- CASE STUDY page ---------- */
const cs = document.getElementById('caseStudy');
if (cs) {
  const id = new URLSearchParams(location.search).get('id');
  const p = caseStudies.find(c => c.id === id) || caseStudies[0];
  document.title = `${p.name} — Aruzhan`;
  const chips = arr => arr.map(t => `<span class="cs-chip">${t}</span>`).join('');
  cs.innerHTML = `
    <a class="cs-back" href="index.html">← All work</a>
    <div class="cs-icon" style="background:linear-gradient(135deg, ${p.accent}, ${p.accent}bb)">${p.icon}</div>
    <p class="cs-eyebrow">${p.name} · ${p.kind} — ${p.yr}</p>
    <h1 class="cs-title">${p.title}</h1>
    <div class="cs-grid">
      <div class="cs-intro">
        <p class="cs-label">Intro</p>
        ${p.intro.map(t => `<p>${t}</p>`).join('')}
      </div>
      <div class="cs-meta">
        <div class="cs-meta-block"><p class="cs-label">Role</p><div class="cs-chips">${chips(p.role)}</div></div>
        <div class="cs-meta-block"><p class="cs-label">Status</p><div class="cs-chips">${chips(p.status)}</div></div>
        <div class="cs-meta-block"><p class="cs-label">Type</p><div class="cs-chips">${chips(p.type)}</div></div>
      </div>
    </div>
    <div class="psr">
      <div class="psr-card"><h3>Problems</h3><p>${p.problems}</p></div>
      <div class="psr-card"><h3>Solution</h3><p>${p.solution}</p></div>
      <div class="psr-card"><h3>Results</h3><p>${p.results}</p></div>
    </div>
    <div class="cs-gallery-label"><span>Screenshot gallery</span></div>
    <div class="gallery-wrap">
      <div class="gallery cs-shots">${[...p.gallery, ...p.gallery].map((k, i) => shot(k, p.accent, i)).join('')}</div>
    </div>
    <div class="cs-next">
      <span>Next up</span>
      <a href="casestudy.html?id=${caseStudies[(caseStudies.findIndex(c => c.id === p.id) + 1) % caseStudies.length].id}">
        ${caseStudies[(caseStudies.findIndex(c => c.id === p.id) + 1) % caseStudies.length].name} →
      </a>
    </div>`;
  cs.querySelectorAll('.reveal').forEach(el => io.observe(el));
  const g = cs.querySelector('.gallery');
  enableDragScroll(g);
  attachDragBadge(cs.querySelector('.gallery-wrap'), g);
}

/* ---------- HERO: skill pills that fall down & pile up (mini physics) ---------- */
const pillField = document.getElementById('pillField');
if (pillField) {
  const pills = [
    { t: 'Prototyping',     e: '🔁', c: '#ffd166' },
    { t: 'User research',   e: '🔍', c: '#ff9fb2' },
    { t: 'Pushing pixels',  e: '🎯', c: '#b9a3ff' },
    { t: 'Killing modals',  e: '🗡️', c: '#8fdc9b' },
    { t: 'Naming things',   e: '🏷️', c: '#7fb8ff' },
    { t: 'Reducing clicks', e: '⚡', c: '#ffb27a' },
    { t: 'Design tokens',   e: '🎨', c: '#76dcc9' },
    { t: 'Sweating details',e: '💧', c: '#ff8f6b' },
    { t: 'Asking “why?”',   e: '❓', c: '#f0b6ff' },
    { t: 'Shipping it',     e: '🚀', c: '#ffe08a' },
  ];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GRAV = 0.85, REST = 0.42, AIR = 0.995, GROUND = 0.86;
  let bodies = [], raf = 0, zTop = 20, W = 0, H = 0;

  function build() {
    cancelAnimationFrame(raf);
    pillField.querySelectorAll('.pill').forEach(p => p.remove());
    bodies = [];
    W = pillField.clientWidth; H = pillField.clientHeight;
    pills.forEach((p, i) => {
      const el = document.createElement('div');
      el.className = 'pill';
      el.style.background = p.c;
      el.style.left = '0'; el.style.top = '0'; el.style.opacity = '1';
      el.innerHTML = `<span class="pi">${p.e}</span>${p.t}`;
      pillField.appendChild(el);
      const w = el.offsetWidth, h = el.offsetHeight;
      const col = i % Math.max(2, Math.floor(W / 190));
      const cols = Math.max(2, Math.floor(W / 190));
      // spread across the width, stacked well above the field so they fall in
      const x = Math.max(8, Math.min((col + 0.5) * (W / cols) - w / 2 + ((i * 37) % 40 - 20), W - w - 8));
      const y = -h - (i % cols) * 26 - Math.floor(i / cols) * (H * 0.6) - 60;
      const b = { el, w, h, x, y, vx: ((i % 2) ? -1 : 1) * (1 + (i % 3)), vy: 0, rot: 0, drag: false, held: false };
      bodies.push(b);
      addDrag(b);
      render(b);
    });
    if (reduce) { settleStatic(); return; }
    raf = requestAnimationFrame(step);
  }

  function render(b) { b.el.style.transform = `translate(${b.x}px,${b.y}px) rotate(${b.rot}deg)`; }

  function step() {
    for (const b of bodies) {
      if (b.held) continue;
      b.vy += GRAV; b.x += b.vx; b.y += b.vy; b.vx *= AIR;
      if (b.x < 0) { b.x = 0; b.vx = -b.vx * REST; }
      if (b.x + b.w > W) { b.x = W - b.w; b.vx = -b.vx * REST; }
      if (b.y + b.h > H) { b.y = H - b.h; b.vy = -b.vy * REST; b.vx *= GROUND; if (Math.abs(b.vy) < 1.4) b.vy = 0; }
    }
    for (let i = 0; i < bodies.length; i++)
      for (let j = i + 1; j < bodies.length; j++) collide(bodies[i], bodies[j]);
    for (const b of bodies) {
      const target = b.held ? Math.max(-18, Math.min(18, b.vx * 2)) : Math.max(-14, Math.min(14, b.vx * 1.6));
      b.rot += (target - b.rot) * 0.12;
      render(b);
    }
    raf = requestAnimationFrame(step);
  }

  function collide(a, b) {
    const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
    const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    if (ox <= 0 || oy <= 0) return;
    if (ox < oy) {
      const dir = a.x < b.x ? -1 : 1;
      if (a.held) { b.x -= dir * ox; b.vx = a.vx * .6; }
      else if (b.held) { a.x += dir * ox; a.vx = b.vx * .6; }
      else { a.x += dir * ox / 2; b.x -= dir * ox / 2; const t = a.vx; a.vx = b.vx * .5; b.vx = t * .5; }
    } else {
      const dir = a.y < b.y ? -1 : 1;
      if (a.held) { b.y -= dir * oy; b.vy = 0; }
      else if (b.held) { a.y += dir * oy; a.vy = 0; }
      else { a.y += dir * oy / 2; b.y -= dir * oy / 2; a.vy *= .5; b.vy *= .5; }
    }
  }

  function settleStatic() {
    // reduced-motion: lay pills along the floor without animating
    let x = 10;
    for (const b of bodies) {
      if (x + b.w > W) x = 10;
      b.x = x; b.y = H - b.h - 10; b.rot = 0; render(b);
      x += b.w + 12;
    }
  }

  function addDrag(b) {
    const pt = e => e.touches ? e.touches[0] : e;
    let lx = 0, ly = 0, ox = 0, oy = 0;
    const down = e => {
      b.held = true; b.el.classList.add('dragging'); b.el.style.zIndex = ++zTop;
      const r = pillField.getBoundingClientRect(), p = pt(e);
      ox = p.clientX - r.left - b.x; oy = p.clientY - r.top - b.y;
      lx = p.clientX; ly = p.clientY; e.preventDefault();
    };
    const move = e => {
      if (!b.held) return;
      const r = pillField.getBoundingClientRect(), p = pt(e);
      b.x = Math.max(0, Math.min(p.clientX - r.left - ox, W - b.w));
      b.y = Math.max(-b.h, Math.min(p.clientY - r.top - oy, H - b.h));
      b.vx = p.clientX - lx; b.vy = p.clientY - ly; lx = p.clientX; ly = p.clientY;
      if (reduce) render(b);
    };
    const up = () => { if (b.held) { b.held = false; b.el.classList.remove('dragging'); } };
    b.el.addEventListener('mousedown', down);
    b.el.addEventListener('touchstart', down, { passive: false });
    addEventListener('mousemove', move); addEventListener('touchmove', move, { passive: false });
    addEventListener('mouseup', up); addEventListener('touchend', up);
  }

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
  else build();
  let prt; addEventListener('resize', () => { clearTimeout(prt); prt = setTimeout(build, 300); });
}

/* ---------- PLAYGROUND draggable chips ---------- */
const canvas = document.getElementById('pgCanvas');
if (canvas) {
  const pieces = [
    { html: '<div class="k">Aa</div><div class="s">Inter — display</div>', x: 6, y: 24, cls: '' },
    { html: '<span class="hexv">#E8552F</span>', x: 30, y: 14, cls: 'color', style: 'background:#e8552f' },
    { html: '<span class="hexv">#2FAA5E</span>', x: 30, y: 56, cls: 'color', style: 'background:#2faa5e' },
    { html: '<span class="hexv">#3F5BBB</span>', x: 47, y: 32, cls: 'color', style: 'background:#3f5bbb' },
    { html: '✺', x: 64, y: 12, cls: 'emoji' },
    { html: '◐', x: 80, y: 52, cls: 'emoji' },
    { html: 'grid is good', x: 58, y: 64, cls: 'pill', style: 'background:#fbe7df;color:#e8552f' },
    { html: 'ship it', x: 12, y: 66, cls: 'pill', style: 'background:#17150f;color:#fbfaf8' },
    { html: '<div class="k">8pt</div><div class="s">spacing scale</div>', x: 72, y: 26, cls: '' },
    { html: '<div class="k">↺</div><div class="s">motion: 240ms</div>', x: 44, y: 68, cls: '' },
  ];
  let zTop = 10;
  function placeChips() {
    canvas.querySelectorAll('.chip').forEach(c => c.remove());
    const W = canvas.clientWidth, H = canvas.clientHeight;
    pieces.forEach(p => {
      const c = document.createElement('div');
      c.className = 'chip ' + p.cls;
      if (p.style) c.setAttribute('style', p.style);
      c.innerHTML = p.html;
      canvas.appendChild(c);
      c.style.left = Math.min(p.x/100*W, W - c.offsetWidth - 8) + 'px';
      c.style.top = Math.min(p.y/100*H, H - c.offsetHeight - 8) + 'px';
      makeDraggable(c);
    });
  }
  function makeDraggable(el) {
    let sx, sy, ox, oy, dragging = false;
    const down = e => { dragging = true; el.classList.add('dragging'); el.style.zIndex = ++zTop; const pt = e.touches?e.touches[0]:e; sx=pt.clientX; sy=pt.clientY; ox=parseFloat(el.style.left); oy=parseFloat(el.style.top); e.preventDefault(); };
    const move = e => { if(!dragging) return; const pt = e.touches?e.touches[0]:e; const W=canvas.clientWidth,H=canvas.clientHeight; let nx=ox+(pt.clientX-sx),ny=oy+(pt.clientY-sy); nx=Math.max(0,Math.min(nx,W-el.offsetWidth)); ny=Math.max(0,Math.min(ny,H-el.offsetHeight)); el.style.left=nx+'px'; el.style.top=ny+'px'; };
    const up = () => { dragging=false; el.classList.remove('dragging'); };
    el.addEventListener('mousedown', down);
    el.addEventListener('touchstart', down, { passive:false });
    addEventListener('mousemove', move);
    addEventListener('touchmove', move, { passive:false });
    addEventListener('mouseup', up); addEventListener('touchend', up);
  }
  placeChips();
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(placeChips, 200); });
}

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
  if (el.dataset.mag) return; el.dataset.mag = '1';
  el.classList.add('magnetic');
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * strength}px, ${(e.clientY - (r.top + r.height / 2)) * strength}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
}
function enableMagnetic() {
  if (!canHover) return;
  document.querySelectorAll('.btn, .nav-links a.cv').forEach(b => magnetic(b, 0.25));
}

/* subtle 3D tilt on project thumbnails */
function enableTilt(scope) {
  if (!canHover) return;
  (scope || document).querySelectorAll('.proj-thumb').forEach(t => {
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

/* count-up for impact stats */
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
    el.innerHTML = wrap(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(frame); else el.innerHTML = wrap(to);
  }
  requestAnimationFrame(frame);
}
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); countIO.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.num').forEach(el => countIO.observe(el));

/* ============ i18n (EN / RU) ============ */
const I18N = {
  en: {
    'nav.work': 'Work', 'nav.playground': 'Playground', 'nav.about': 'About', 'nav.cv': 'CV ↗',
    'hero.hello': 'Hello, I\'m Aruzhan',
    'hero.h1': 'I turn complex products into experiences that feel <em>effortless</em>.',
    'hero.current': 'Currently designing <b>complex B2B workflows</b> and a <b>multi-brand design system</b>.',
    'hero.trayLabel': 'How I spend my days — drag them around',
    'projects.head': 'Projects', 'trusted.label': 'Trusted by teams at',
    'impact.eyebrow': 'By the numbers', 'stat.years': 'Years designing', 'stat.products': 'Products shipped',
    'stat.faster': 'Faster workflows, avg.', 'stat.satis': 'Team satisfaction',
    'quotes.eyebrow': 'Kind words', 'quotes.head': 'What people say about working with me',
    'q1': 'Aruzhan turns messy, ambiguous problems into interfaces that just make sense. Our team shipped faster and argued less.',
    'q1.role': 'Head of Product, Northwind',
    'q2': 'She doesn\'t just design screens — she thinks in systems and outcomes. Our activation numbers moved because of her work.',
    'q2.role': 'Founder, Lumen Pay',
    'q3': 'The most reliable design partner I\'ve worked with — thoughtful, fast, and genuinely obsessed with the details users feel.',
    'q3.role': 'Eng Lead, Atlas',
    'services.eyebrow': 'How I can help', 'services.head': 'Ways we can work together',
    'svc1.t': 'Product &amp; UX design', 'svc1.d': 'End-to-end design for web and mobile — from discovery and flows to polished, shippable UI that engineers love.', 'svc1.tag': 'Full-time or contract',
    'svc2.t': 'Design systems', 'svc2.d': 'Scalable token-and-component systems with documentation your team will actually use — fewer debates, faster delivery.', 'svc2.tag': 'Project-based',
    'svc3.t': 'Design partner &amp; audits', 'svc3.d': 'A senior set of eyes on your product — UX audits, rapid prototyping, and hands-on collaboration with your team.', 'svc3.tag': 'Retainer / advisory',
    'cta.h3': 'Have a role or project in mind?', 'cta.p': 'I\'m open to full-time roles and select freelance work in 2026. Let\'s find 20 minutes to talk.', 'cta.btn': 'Book an intro call',
    'foot.msg': 'Let\'s connect.<br>I\'m always down for a chat.', 'foot.built': 'Built with love &amp; a little code',
    'about.h1': 'It\'s Aruzhan. But you read it like <em>"ah-roo-zhan"</em>.', 'about.sub': 'Looks harder than it actually is — thank you, mom and dad.',
    'about.p1': 'I\'m an end-to-end <b>Product Designer</b> with 6 years of experience across agency, in-house, and the occasional freelance project.',
    'about.p2': 'I\'ve worked on websites, SaaS platforms, mobile apps, dashboards, and design systems. I usually sit somewhere between <em>UX logic and UI craft</em> — I like figuring out how things should work, what\'s making them confusing, and how to turn that into something clear and usable.',
    'about.p3': 'In my current role I work mostly on <b>complex B2B tools</b> — dense workflows, edge cases, regulations and trade-offs. These products are often treated as "just functional", but I think they deserve the same care, clarity, and visual polish as any consumer-facing app.',
    'about.p4': 'My process usually starts with asking <em>a lot of questions</em>. I\'d rather understand the real problem (and the constraints around it) before pushing a single pixel — good design is mostly good decisions made early.',
    'about.p5': 'When I\'m not designing, you\'ll usually find me drawing, planning my next trip, keeping up with celebrity drama (my guilty pleasure), or trying a new creative hobby — not always successfully.',
    'about.whatido': 'What I do', 'about.tools': 'Tools',
    'about.sk1': 'Product &amp; UX Design', 'about.lv1': 'Lead', 'about.sk2': 'Design Systems', 'about.lv2': 'Expert',
    'about.sk3': 'Prototyping &amp; Motion', 'about.lv3': 'Advanced', 'about.sk4': 'User Research', 'about.lv4': 'Proficient',
    'about.sk5': 'Frontend (HTML/CSS)', 'about.lv5': 'Comfortable',
    'pg.h1': 'Experiments, <em>off the clock</em>.', 'pg.p': 'Loose explorations, color studies, and interface ideas that didn\'t fit anywhere else. Grab a piece and drag it around — it\'s a playground, after all.', 'pg.hint': '✋ Drag the pieces around',
    'cs.back': '← All work', 'cs.intro': 'Intro', 'cs.role': 'Role', 'cs.status': 'Status', 'cs.type': 'Type',
    'cs.problems': 'The challenge', 'cs.solution': 'The solution', 'cs.results': 'The outcome', 'cs.gallery': 'Screenshot gallery',
    'cs.next': 'Next up', 'cs.viewcase': 'View case study', 'cs.viewproj': 'View project', 'cs.soon': 'Coming soon', 'drag': 'Drag',
    spk: { problem: 'Checking a counterparty meant jumping between many separate registries and sources — slow, and easy to miss something.', solution: 'I designed a global search that unifies people, companies, filings, and trade data, with dossiers that pull it all together.', result: 'A fast, search-first way to run due diligence, in a calm dark UI built for long sessions.' }
  },
  ru: {
    'nav.work': 'Работы', 'nav.playground': 'Эксперименты', 'nav.about': 'Обо мне', 'nav.cv': 'Резюме ↗',
    'hero.hello': 'Привет, я Аружан',
    'hero.h1': 'Я превращаю сложные продукты в опыт, который ощущается <em>лёгким</em>.',
    'hero.current': 'Сейчас проектирую <b>сложные B2B-процессы</b> и <b>мультибрендовую дизайн-систему</b>.',
    'hero.trayLabel': 'Чем я занимаюсь — перетаскивайте',
    'projects.head': 'Проекты', 'trusted.label': 'Мне доверяют команды из',
    'impact.eyebrow': 'В цифрах', 'stat.years': 'Лет в дизайне', 'stat.products': 'Выпущенных продуктов',
    'stat.faster': 'Ускорение процессов, в ср.', 'stat.satis': 'Оценка команд',
    'quotes.eyebrow': 'Отзывы', 'quotes.head': 'Что говорят о работе со мной',
    'q1': 'Аружан превращает запутанные, неоднозначные задачи в интерфейсы, которые просто понятны. Наша команда стала выпускать быстрее и спорить меньше.',
    'q1.role': 'Руководитель продукта, Northwind',
    'q2': 'Она не просто рисует экраны — она мыслит системами и результатами. Наши показатели активации выросли благодаря её работе.',
    'q2.role': 'Основатель, Lumen Pay',
    'q3': 'Самый надёжный дизайн-партнёр, с которым я работал — вдумчивая, быстрая и по-настоящему одержимая деталями, которые чувствуют пользователи.',
    'q3.role': 'Тимлид разработки, Atlas',
    'services.eyebrow': 'Чем могу помочь', 'services.head': 'Форматы работы',
    'svc1.t': 'Продуктовый и UX-дизайн', 'svc1.d': 'Дизайн веб- и мобильных продуктов под ключ — от исследования и сценариев до отполированного интерфейса, который любят разработчики.', 'svc1.tag': 'В штат или контракт',
    'svc2.t': 'Дизайн-системы', 'svc2.d': 'Масштабируемые системы токенов и компонентов с документацией, которой команда действительно пользуется — меньше споров, быстрее релизы.', 'svc2.tag': 'Проектно',
    'svc3.t': 'Дизайн-партнёр и аудиты', 'svc3.d': 'Взгляд senior-дизайнера на ваш продукт — UX-аудиты, быстрое прототипирование и совместная работа с командой.', 'svc3.tag': 'Ретейнер / консалтинг',
    'cta.h3': 'Есть вакансия или проект?', 'cta.p': 'Открыта для работы в штате и избранных фриланс-проектов в 2026. Давайте найдём 20 минут поговорить.', 'cta.btn': 'Назначить звонок',
    'foot.msg': 'Давайте на связь.<br>Всегда рада поговорить.', 'foot.built': 'Сделано с любовью и немного кодом',
    'about.h1': 'Это Аружан. Читается как <em>«а-ру-жан»</em>.', 'about.sub': 'Выглядит сложнее, чем есть — спасибо маме и папе.',
    'about.p1': 'Я продуктовый дизайнер полного цикла с 6-летним опытом в агентствах, в штате и на отдельных фриланс-проектах.',
    'about.p2': 'Я работала над сайтами, SaaS-платформами, мобильными приложениями, дашбордами и дизайн-системами. Обычно я где-то между <em>UX-логикой и UI-ремеслом</em> — люблю разбираться, как всё должно работать, что сбивает с толку и как превратить это в понятное и удобное.',
    'about.p3': 'Сейчас я в основном работаю над <b>сложными B2B-инструментами</b> — плотные сценарии, крайние случаи, регуляторика и компромиссы. Такие продукты часто считают «просто функциональными», но я уверена, что они заслуживают той же заботы, ясности и визуальной проработки, что и любое потребительское приложение.',
    'about.p4': 'Мой процесс обычно начинается с <em>множества вопросов</em>. Я предпочитаю понять настоящую задачу (и её ограничения), прежде чем двигать хоть один пиксель — хороший дизайн это в основном хорошие решения, принятые рано.',
    'about.p5': 'Когда я не занимаюсь дизайном, я обычно рисую, планирую следующее путешествие, слежу за жизнью знаменитостей (моя маленькая слабость) или пробую новое творческое хобби — не всегда успешно.',
    'about.whatido': 'Что я делаю', 'about.tools': 'Инструменты',
    'about.sk1': 'Продуктовый и UX-дизайн', 'about.lv1': 'Лид', 'about.sk2': 'Дизайн-системы', 'about.lv2': 'Эксперт',
    'about.sk3': 'Прототипы и анимация', 'about.lv3': 'Продвинуто', 'about.sk4': 'Исследования', 'about.lv4': 'Уверенно',
    'about.sk5': 'Фронтенд (HTML/CSS)', 'about.lv5': 'Комфортно',
    'pg.h1': 'Эксперименты <em>в свободное время</em>.', 'pg.p': 'Свободные исследования, цветовые этюды и идеи интерфейсов, которым не нашлось места. Возьмите элемент и потяните — это же лаборатория.', 'pg.hint': '✋ Перетаскивайте элементы',
    'cs.back': '← Все работы', 'cs.intro': 'Вступление', 'cs.role': 'Роль', 'cs.status': 'Статус', 'cs.type': 'Тип',
    'cs.problems': 'Задача', 'cs.solution': 'Решение', 'cs.results': 'Результат', 'cs.gallery': 'Галерея скриншотов',
    'cs.next': 'Далее', 'cs.viewcase': 'Смотреть кейс', 'cs.viewproj': 'Смотреть проект', 'cs.soon': 'Скоро', 'drag': 'Тяни'
  }
};

let lang = (function () { try { return localStorage.getItem('lang') === 'ru' ? 'ru' : 'en'; } catch (e) { return 'en'; } })();
function t(key) { return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key; }
const langHandlers = [];
let firstApply = true;

function applyLang(l) {
  lang = (l === 'ru') ? 'ru' : 'en';
  try { localStorage.setItem('lang', lang); } catch (e) {}
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const s = I18N[lang][el.getAttribute('data-i18n')];
    if (s != null) el.innerHTML = s;
  });
  document.querySelectorAll('.lang-switch button').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  langHandlers.forEach(fn => fn());
  firstApply = false;
}

/* ---------- intro overlay (landing, once per session) ---------- */
const intro = document.getElementById('intro');
if (intro) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('no-intro')) {
    intro.remove();
  } else {
    intro.classList.add('play');
    try { sessionStorage.setItem('introSeen', '1'); } catch (e) {}
    intro.addEventListener('animationend', e => { if (e.animationName === 'introUp') intro.remove(); });
  }
}

/* ---------- WORK: case studies (EN base + RU overrides) ---------- */
const caseStudies = [
  {
    id: 'aml', name: 'AML', kind: 'Compliance · Fintech', yr: '2025', accent: '#3f5bbb', icon: '🛡️', url: '',
    subtitle: 'Anti-money-laundering platform — client screening, risk scoring, and case investigation.',
    benefits: ['Compliance', 'Risk scoring', 'Case workflows', 'Data-dense UI'],
    gallery: ['dashboard', 'grid', 'dashboard', 'cards', 'dashboard'],
    title: 'Designing an anti-money-laundering platform',
    role: ['Product Designer', 'UX + UI'], status: ['In progress', '2025'], type: ['Compliance', 'Fintech', 'B2B'],
    intro: [
      'AML is a compliance platform that helps analysts screen clients, score risk, and investigate suspicious activity. The hard part is density — a lot of data, rules, and edge cases on every screen.',
      'I own the end-to-end design: turning heavy regulatory logic into flows and interfaces analysts can move through quickly and confidently.'
    ]
  },
  {
    id: 'speakup', name: 'Speak Up', kind: 'Ethics · HR', yr: '2025', accent: '#2faa5e', icon: '📣', url: '',
    subtitle: 'A safe whistleblowing and feedback platform for employees to raise concerns.',
    benefits: ['Whistleblowing', 'Trust & safety', 'Anonymous reports', 'Case tracking'],
    gallery: ['phone', 'cards', 'phone', 'grid', 'phone'],
    title: 'A safe channel for people to speak up',
    role: ['Product Designer', 'UX + UI'], status: ['In progress', '2025'], type: ['Ethics', 'HR', 'B2B'],
    intro: [
      'Speak Up lets employees report concerns and share feedback safely — anonymously when they need to. Trust is the whole product: people only use it if it feels private and fair.',
      'I designed the reporting flows and the case side for reviewers, keeping the experience calm, clear, and reassuring at every step.'
    ]
  },
  {
    id: 'ai-landings', name: 'AI Landings', kind: 'Landing · Marketing', yr: '2024', accent: '#e8552f', icon: '✨', url: '',
    subtitle: 'A set of marketing landing pages for an AI product suite.',
    benefits: ['Landing pages', 'Marketing', 'Conversion', 'Visual system'],
    gallery: ['cards', 'grid', 'cards', 'dashboard', 'cards'],
    title: 'Marketing landings for an AI product line',
    role: ['Product Designer', 'Visual Design'], status: ['Shipped', '2024'], type: ['Landing', 'Marketing', 'Web'],
    intro: [
      'A family of landing pages that explain an AI product simply and get people to try it. Each page has to sell a fairly abstract idea in a few scrolls.',
      'I built a flexible visual system — sections, type, and components — so new landings ship fast while staying on-brand, in both light and dark.'
    ]
  },
  {
    id: 'compliance', name: 'adata Compliance', kind: 'Landing', yr: '2025', accent: '#068DFF', icon: '✅', url: '',
    subtitle: 'Landing page for adata\'s compliance suite — clear, trustworthy, product-led.',
    benefits: ['Landing', 'Product marketing', 'B2B', 'Brand'],
    gallery: ['dashboard', 'cards', 'grid', 'cards', 'dashboard'],
    title: 'A product-led landing for adata Compliance',
    role: ['Product Designer', 'Visual Design'], status: ['Shipped', '2025'], type: ['Landing', 'B2B', 'Brand'],
    intro: [
      'The landing for adata\'s compliance suite has to make a dense, eleven-module product feel simple and trustworthy at a glance.',
      'I structured the page around what teams actually need to know, and designed matching light and dark versions with clear trust cues and calls to action.'
    ]
  },
  {
    id: 'digital-office', name: 'Digital Office', kind: 'Enterprise product', yr: '2024—25', accent: '#d99a16', icon: '🗂️', url: '',
    subtitle: 'A digital workplace for tasks, documents, and team collaboration.',
    benefits: ['Enterprise', 'Task management', 'Dashboards', 'Design system'],
    gallery: ['dashboard', 'grid', 'dashboard', 'cards', 'grid'],
    title: 'A digital workplace for everyday work',
    role: ['Product Designer', 'Design System'], status: ['In progress', '2024—25'], type: ['Enterprise', 'Productivity', 'B2B'],
    intro: [
      'Digital Office brings tasks, documents, and team collaboration into one place, so people stop jumping between tools all day.',
      'I work on the core flows and a reusable component set, keeping a dense enterprise product organised, consistent, and easy to learn.'
    ]
  },
  {
    id: 'nisp', name: 'NISP', kind: 'Product', yr: '2024', accent: '#7c5cff', icon: '📊', url: '',
    subtitle: 'Product design for the NISP platform — data, workflows, and reporting.',
    benefits: ['Product', 'Data viz', 'Workflows', 'Reporting'],
    gallery: ['dashboard', 'dashboard', 'grid', 'cards', 'dashboard'],
    title: 'Designing the data-heavy NISP platform',
    role: ['Product Designer', 'UX + UI'], status: ['Shipped', '2024'], type: ['Product', 'Data', 'Web'],
    intro: [
      'NISP is a data-heavy platform built around registries, maps, and multi-step applications — lists of zones and projects, guided submission flows, and detailed project pages.',
      'I designed the end-to-end experience: making dense tables and maps readable, and turning long bureaucratic processes into clear, step-by-step flows.'
    ]
  },
  {
    id: 'spk', name: 'E-Analytic', kind: 'Analytics · B2G', yr: '2025', accent: '#38b6ff', icon: '🔎', url: '',
    subtitle: 'An analytics platform for due diligence — global search across companies and people.',
    benefits: ['Analytics', 'Global search', 'Dossiers', 'Data-dense UI'],
    gallery: ['dashboard', 'grid', 'dashboard', 'cards', 'dashboard'],
    title: 'An analytics platform for fast due diligence',
    role: ['Product Designer', 'UX + UI'], status: ['Live demo', '2025'], type: ['Analytics', 'B2G', 'Web'],
    intro: [
      'The platform pulls scattered public data — registries, filings, procurement, foreign trade — into one place, so analysts can vet a company or a person in minutes instead of hours.',
      'I designed the search-first experience and the dossier views, with matching light and dark themes for long analytical sessions.'
    ]
  }
];
const CS_RU = {
  aml: {
    kind: 'Комплаенс · Финтех', subtitle: 'Платформа противодействия отмыванию денег — скрининг клиентов, риск-скоринг и расследование кейсов.',
    benefits: ['Комплаенс', 'Риск-скоринг', 'Кейс-процессы', 'Плотный UI'],
    title: 'Дизайн платформы противодействия отмыванию денег',
    role: ['Продуктовый дизайнер', 'UX + UI'], status: ['В работе', '2025'], type: ['Комплаенс', 'Финтех', 'B2B'],
    intro: [
      'AML — комплаенс-платформа, которая помогает аналитикам проверять клиентов, оценивать риск и расследовать подозрительную активность. Главная сложность — плотность: много данных, правил и крайних случаев на каждом экране.',
      'Я веду дизайн целиком: превращаю тяжёлую регуляторную логику в сценарии и интерфейсы, по которым аналитик движется быстро и уверенно.'
    ]
  },
  speakup: {
    kind: 'Этика · HR', subtitle: 'Безопасная платформа для обращений сотрудников и обратной связи.',
    benefits: ['Обращения', 'Доверие', 'Анонимность', 'Учёт кейсов'],
    title: 'Безопасный канал, чтобы сотрудники могли высказаться',
    role: ['Продуктовый дизайнер', 'UX + UI'], status: ['В работе', '2025'], type: ['Этика', 'HR', 'B2B'],
    intro: [
      'Speak Up позволяет сотрудникам безопасно сообщать о проблемах и делиться обратной связью — при необходимости анонимно. Доверие здесь и есть продукт: им пользуются, только если это ощущается приватно и честно.',
      'Я спроектировала сценарии подачи обращений и сторону обработки для проверяющих, сохраняя спокойный, ясный и располагающий опыт на каждом шаге.'
    ]
  },
  'ai-landings': {
    kind: 'Лендинг · Маркетинг', subtitle: 'Серия маркетинговых лендингов для линейки AI-продуктов.',
    benefits: ['Лендинги', 'Маркетинг', 'Конверсия', 'Визуальная система'],
    title: 'Маркетинговые лендинги для линейки AI-продуктов',
    role: ['Продуктовый дизайнер', 'Визуальный дизайн'], status: ['Запущено', '2024'], type: ['Лендинг', 'Маркетинг', 'Web'],
    intro: [
      'Семейство лендингов, которые просто объясняют AI-продукт и подводят к тому, чтобы его попробовали. Каждая страница должна продать довольно абстрактную идею за пару экранов.',
      'Я собрала гибкую визуальную систему — секции, типографику и компоненты, — чтобы новые лендинги выходили быстро и оставались в стиле, в светлой и тёмной темах.'
    ]
  },
  compliance: {
    kind: 'Лендинг', subtitle: 'Лендинг комплаенс-продукта adata — ясный и вызывающий доверие.',
    benefits: ['Лендинг', 'Продуктовый маркетинг', 'B2B', 'Бренд'],
    title: 'Продуктовый лендинг для adata Compliance',
    role: ['Продуктовый дизайнер', 'Визуальный дизайн'], status: ['Запущено', '2025'], type: ['Лендинг', 'B2B', 'Бренд'],
    intro: [
      'Лендинг комплаенс-продукта adata должен с первого взгляда делать плотный продукт из одиннадцати модулей простым и вызывающим доверие.',
      'Я выстроила страницу вокруг того, что действительно важно командам, и сделала согласованные светлую и тёмную версии с понятными сигналами доверия и призывами к действию.'
    ]
  },
  'digital-office': {
    kind: 'Корпоративный продукт', subtitle: 'Цифровой офис для задач, документов и командной работы.',
    benefits: ['Enterprise', 'Задачи', 'Дашборды', 'Дизайн-система'],
    title: 'Цифровой офис для ежедневной работы',
    role: ['Продуктовый дизайнер', 'Дизайн-система'], status: ['В работе', '2024—25'], type: ['Enterprise', 'Продуктивность', 'B2B'],
    intro: [
      'Digital Office объединяет задачи, документы и командную работу в одном месте, чтобы люди перестали весь день прыгать между инструментами.',
      'Я работаю над ключевыми сценариями и переиспользуемым набором компонентов, удерживая плотный корпоративный продукт организованным, консистентным и понятным.'
    ]
  },
  nisp: {
    kind: 'Продукт', subtitle: 'Дизайн платформы НИСП — данные, процессы и отчётность.',
    benefits: ['Продукт', 'Визуализация', 'Процессы', 'Отчётность'],
    title: 'Дизайн платформы НИСП с плотными данными',
    role: ['Продуктовый дизайнер', 'UX + UI'], status: ['Запущено', '2024'], type: ['Продукт', 'Данные', 'Web'],
    intro: [
      'НИСП — платформа с плотными данными: реестры, карты и многошаговые заявки — списки зон и проектов, пошаговая подача и подробные страницы проектов.',
      'Я спроектировала опыт целиком: сделала плотные таблицы и карты читаемыми и превратила длинные бюрократические процессы в понятные пошаговые сценарии.'
    ]
  },
  spk: {
    kind: 'Аналитика · B2G', subtitle: 'Аналитическая платформа для проверки — глобальный поиск по компаниям и людям.',
    benefits: ['Аналитика', 'Глобальный поиск', 'Досье', 'Плотный UI'],
    title: 'Аналитическая платформа для быстрой проверки контрагентов',
    role: ['Продуктовый дизайнер', 'UX + UI'], status: ['Демо', '2025'], type: ['Аналитика', 'B2G', 'Web'],
    intro: [
      'Платформа собирает разрозненные открытые данные — реестры, выписки, закупки, ВЭД — в одном месте, чтобы аналитик проверял компанию или человека за минуты, а не за часы.',
      'Я спроектировала опыт «поиск в первую очередь» и экраны досье, со светлой и тёмной темами для долгих аналитических сессий.'
    ]
  }
};
function loc(p) { return (lang === 'ru' && CS_RU[p.id]) ? Object.assign({}, p, CS_RU[p.id]) : p; }
const PSR = {
  en: {
    aml: { problem: 'Analysts had to make risk decisions from scattered, dense data — easy to miss a signal, slow to investigate.', solution: 'I mapped the review journey and designed clear screening, scoring, and case-investigation flows that surface the right information at each step.', result: 'Complex regulatory logic turned into interfaces analysts can move through quickly and confidently.' },
    speakup: { problem: 'People won\'t report concerns unless the channel feels genuinely safe and private.', solution: 'I designed anonymous-first reporting flows and a clear reviewer side, keeping the tone calm and reassuring throughout.', result: 'A reporting experience that earns trust — simple for employees, structured for the teams handling cases.' },
    'ai-landings': { problem: 'An abstract AI product is hard to explain and easy to scroll past.', solution: 'I built a flexible section-and-component system so each landing tells a clear story and converts, in light and dark.', result: 'New landings ship fast and stay on-brand, with a consistent, modern look across the suite.' },
    compliance: { problem: 'An eleven-module compliance product risked feeling overwhelming on a single page.', solution: 'I structured the landing around what teams actually need to know, with trust cues and matching light and dark versions.', result: 'A clear, product-led page that makes a dense product feel approachable and credible.' },
    'digital-office': { problem: 'Teams lost time switching between disconnected tools for tasks, documents, and communication.', solution: 'I designed the core flows and a reusable component set that bring everyday work into one consistent workspace.', result: 'A dense enterprise product that stays organised and easy to learn as it grows.' },
    nisp: { problem: 'Registries, maps, and multi-step applications made the platform dense and hard to navigate.', solution: 'I made tables and maps readable and turned long bureaucratic processes into clear, guided step-by-step flows.', result: 'A data-heavy platform that feels structured and usable — from browsing registries to submitting an application.' }
  },
  ru: {
    aml: { problem: 'Аналитикам приходилось принимать решения о риске по разрозненным, плотным данным — легко пропустить сигнал и долго расследовать.', solution: 'Я разложила путь проверки и спроектировала понятные сценарии скрининга, скоринга и расследования кейсов, которые показывают нужное на каждом шаге.', result: 'Сложная регуляторная логика превратилась в интерфейсы, по которым аналитик движется быстро и уверенно.' },
    speakup: { problem: 'Люди не сообщают о проблемах, пока канал не ощущается по-настоящему безопасным и приватным.', solution: 'Я спроектировала сценарии с анонимностью по умолчанию и понятную сторону для проверяющих, сохраняя спокойный, располагающий тон.', result: 'Опыт обращений, который вызывает доверие — простой для сотрудников и структурированный для команд, обрабатывающих кейсы.' },
    'ai-landings': { problem: 'Абстрактный AI-продукт сложно объяснить, и его легко пролистать.', solution: 'Я собрала гибкую систему секций и компонентов, чтобы каждый лендинг рассказывал ясную историю и конвертил — в светлой и тёмной теме.', result: 'Новые лендинги выходят быстро и остаются в стиле, с единым современным видом по всей линейке.' },
    compliance: { problem: 'Продукт из одиннадцати модулей рисковал выглядеть перегруженным на одной странице.', solution: 'Я выстроила лендинг вокруг того, что важно командам, с сигналами доверия и согласованными светлой и тёмной версиями.', result: 'Ясная, продуктовая страница, которая делает плотный продукт понятным и вызывающим доверие.' },
    'digital-office': { problem: 'Команды теряли время, переключаясь между разрозненными инструментами для задач, документов и общения.', solution: 'Я спроектировала ключевые сценарии и переиспользуемый набор компонентов, объединяющие ежедневную работу в одном пространстве.', result: 'Плотный корпоративный продукт, который остаётся организованным и понятным по мере роста.' },
    nisp: { problem: 'Реестры, карты и многошаговые заявки делали платформу плотной и сложной в навигации.', solution: 'Я сделала таблицы и карты читаемыми и превратила длинные бюрократические процессы в понятные пошаговые сценарии.', result: 'Платформа с плотными данными, которая ощущается структурной и удобной — от просмотра реестров до подачи заявки.' },
    spk: { problem: 'Проверка контрагента означала прыжки между множеством отдельных реестров и источников — медленно и легко что-то упустить.', solution: 'Я спроектировала глобальный поиск, объединяющий людей, компании, выписки и данные о торговле, с досье, собирающими всё вместе.', result: 'Быстрый способ проверки через поиск, со спокойным тёмным интерфейсом для долгих сессий.' }
  }
};
const LOGOS = { 'digital-office': 'shots/logo-do.png', 'spk': 'shots/logo-ean.png' };
const SCREENS = {
  'ai-landings': ['shots/compliance.png'],
  'nisp': ['shots/nisp-screens.png'],
  'digital-office': ['shots/do-messenger.png', 'shots/digital-office-screens.png'],
  'spk': ['shots/ean-dossier.png', 'shots/ean-zakupki.png', 'shots/spk.png']
};

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
function shot(kind, accent, i) {
  const tints = [`${accent}10`, `${accent}1c`, `${accent}14`];
  return `<div class="shot" style="background:linear-gradient(135deg, ${tints[i % 3]}, ${accent}26)">${mock(kind, accent)}</div>`;
}
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
  badge.innerHTML = `${t('drag')} <span>🖐</span>`;
  wrap.appendChild(badge);
  g.addEventListener('mouseenter', () => badge.classList.add('on'));
  g.addEventListener('mouseleave', () => badge.classList.remove('on'));
  g.addEventListener('mousemove', e => {
    const r = wrap.getBoundingClientRect();
    badge.style.left = (e.clientX - r.left) + 'px';
    badge.style.top = (e.clientY - r.top) + 'px';
  });
}

/* WORK list (landing) — re-renders on language change */
const list = document.getElementById('workList');
if (list) {
  function renderProjects() {
    const animate = firstApply;
    list.innerHTML = '';
    caseStudies.forEach((raw) => {
      const p = loc(raw);
      const el = document.createElement('a');
      el.href = 'casestudy.html?id=' + raw.id;
      el.className = 'proj proj-link-card reveal' + (animate ? '' : ' in');
      const btn = `<span class="cs-btn"><span>${t('cs.viewcase')}</span> <span>→</span></span>`;
      el.innerHTML = `
        <div class="proj-head-row">
          <div class="proj-head-left">
            ${LOGOS[raw.id] ? `<img class="proj-logo" src="${LOGOS[raw.id]}" alt="" />` : ''}
            <div class="proj-meta"><span class="name">${raw.name}</span><span class="kind">${p.kind}</span><span class="yr">${raw.yr}</span></div>
          </div>
          ${btn}
        </div>
        <p class="subtitle">${p.subtitle}</p>
        <div class="benefits">${p.benefits.map(b => `<span>${b}</span>`).join('')}</div>
        <div class="proj-cover"><img src="shots/${raw.id}.png" alt="${raw.name}" loading="lazy" /></div>`;
      list.appendChild(el);
      if (animate) io.observe(el);
    });
    enableTilt(list);
  }
  langHandlers.push(renderProjects);
}

/* CASE STUDY page — re-renders on language change */
const csEl = document.getElementById('caseStudy');
if (csEl) {
  const id = new URLSearchParams(location.search).get('id');
  const raw = caseStudies.find(c => c.id === id) || caseStudies[0];
  const nextRaw = caseStudies[(caseStudies.findIndex(c => c.id === raw.id) + 1) % caseStudies.length];
  function renderCaseStudy() {
    const p = loc(raw);
    document.title = `${raw.name} — Aruzhan`;
    const chips = arr => (arr || []).map(x => `<span class="cs-chip">${x}</span>`).join('');
    const paras = arr => (arr || []).map(x => `<p>${x}</p>`).join('');
    csEl.innerHTML = `
      <a class="cs-back" href="index.html">${t('cs.back')}</a>
      ${LOGOS[raw.id] ? `<div class="cs-icon cs-icon-img"><img src="${LOGOS[raw.id]}" alt="${raw.name}" /></div>` : `<div class="cs-icon" style="background:linear-gradient(135deg, ${raw.accent}, ${raw.accent}bb)">${raw.icon}</div>`}
      <p class="cs-eyebrow">${raw.name} · ${p.kind} — ${raw.yr}</p>
      <h1 class="cs-title">${p.title || p.subtitle}</h1>
      <div class="cs-grid">
        <div class="cs-intro"><p class="cs-label">${t('cs.intro')}</p>${paras(p.intro) || `<p>${p.subtitle}</p>`}</div>
        <div class="cs-meta">
          <div class="cs-meta-block"><p class="cs-label">${t('cs.role')}</p><div class="cs-chips">${chips(p.role || p.benefits)}</div></div>
          <div class="cs-meta-block"><p class="cs-label">${t('cs.status')}</p><div class="cs-chips">${chips(p.status)}</div></div>
          <div class="cs-meta-block"><p class="cs-label">${t('cs.type')}</p><div class="cs-chips">${chips(p.type || p.benefits)}</div></div>
        </div>
      </div>
      ${(function(){var x=(PSR[lang]||PSR.en)[raw.id];return x?`<div class="psr"><div class="psr-card"><h3>${t('cs.problems')}</h3><p>${x.problem}</p></div><div class="psr-card"><h3>${t('cs.solution')}</h3><p>${x.solution}</p></div><div class="psr-card"><h3>${t('cs.results')}</h3><p>${x.result}</p></div></div>`:'';})()}
      <div class="cs-cover"><img src="shots/${raw.id}.png" alt="${raw.name}" /></div>
      ${(SCREENS[raw.id]||[]).length ? `<div class="cs-gallery-label"><span>${t('cs.gallery')}</span></div>` + (SCREENS[raw.id]).map(src => `<div class="cs-shot"><img src="${src}" alt="${raw.name}" loading="lazy" /></div>`).join('') : ''}
      <div class="cs-next"><span>${t('cs.next')}</span><a href="casestudy.html?id=${nextRaw.id}">${nextRaw.name} →</a></div>`;
    const g = csEl.querySelector('.gallery');
    if (g) { enableDragScroll(g); attachDragBadge(csEl.querySelector('.gallery-wrap'), g); }
  }
  langHandlers.push(renderCaseStudy);
}

/* HERO: falling skill pills (mini physics) */
const pillField = document.getElementById('pillField');
if (pillField) {
  const pills = [
    { en: 'Prototyping', ru: 'Прототипы', e: '🔁', c: '#ffd166' },
    { en: 'User research', ru: 'Исследования', e: '🔍', c: '#ff9fb2' },
    { en: 'Pushing pixels', ru: 'Двигаю пиксели', e: '🎯', c: '#b9a3ff' },
    { en: 'Killing modals', ru: 'Убираю модалки', e: '🗡️', c: '#8fdc9b' },
    { en: 'Naming things', ru: 'Придумываю названия', e: '🏷️', c: '#7fb8ff' },
    { en: 'Reducing clicks', ru: 'Меньше кликов', e: '⚡', c: '#ffb27a' },
    { en: 'Design tokens', ru: 'Токены', e: '🎨', c: '#76dcc9' },
    { en: 'Sweating details', ru: 'Детали', e: '💧', c: '#ff8f6b' },
    { en: 'Asking “why?”', ru: 'Спрашиваю «зачем?»', e: '❓', c: '#f0b6ff' },
    { en: 'Shipping it', ru: 'Релизы', e: '🚀', c: '#ffe08a' }
  ];
  const label = i => `<span class="pi">${pills[i].e}</span>${lang === 'ru' ? pills[i].ru : pills[i].en}`;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // slow, gentle physics: light gravity, capped fall speed, minimal bounce
  const GRAV = 0.28, MAXV = 6, REST = 0.14, AIR = 0.99, GROUND = 0.9, STAGGER = 20;
  let bodies = [], raf = 0, zTop = 20, W = 0, H = 0, order = [];

  function build() {
    cancelAnimationFrame(raf);
    pillField.querySelectorAll('.pill').forEach(p => p.remove());
    bodies = [];
    W = pillField.clientWidth; H = pillField.clientHeight;
    const cols = Math.max(2, Math.floor(W / 190));
    // randomised drop order so it doesn't fall left-to-right every time
    order = pills.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) { const j = (i * 7 + 3) % (i + 1); const tmp = order[i]; order[i] = order[j]; order[j] = tmp; }
    pills.forEach((p, i) => {
      const el = document.createElement('div');
      el.className = 'pill';
      el.style.background = p.c; el.style.left = '0'; el.style.top = '0'; el.style.opacity = '1';
      el.innerHTML = label(i);
      pillField.appendChild(el);
      const w = el.offsetWidth, h = el.offsetHeight;
      const col = i % cols;
      // all start just above the top of the tray (below the header) and fall in
      const x = Math.max(8, Math.min((col + 0.5) * (W / cols) - w / 2 + ((i * 37) % 40 - 20), W - w - 8));
      const y = -h - 20 - (i % 3) * 24;
      // staggered release: each chip waits its turn before gravity kicks in
      const wait = reduce ? 0 : order.indexOf(i) * STAGGER;
      const b = { el, w, h, x, y, vx: ((i % 2) ? -1 : 1) * (0.15 + (i % 3) * 0.2), vy: 0, rot: 0, held: false, wait };
      bodies.push(b); addDrag(b); render(b);
    });
    if (reduce) { settleStatic(); return; }
    raf = requestAnimationFrame(step);
  }
  function render(b) { b.el.style.transform = `translate(${b.x}px,${b.y}px) rotate(${b.rot}deg)`; }
  function step() {
    for (const b of bodies) {
      if (b.held) continue;
      if (b.wait > 0) { b.wait--; continue; }   // hold above the tray until its turn
      b.vy += GRAV; if (b.vy > MAXV) b.vy = MAXV; b.x += b.vx; b.y += b.vy; b.vx *= AIR;
      if (b.x < 0) { b.x = 0; b.vx = -b.vx * REST; }
      if (b.x + b.w > W) { b.x = W - b.w; b.vx = -b.vx * REST; }
      if (b.y + b.h > H) { b.y = H - b.h; b.vy = -b.vy * REST; b.vx *= GROUND; if (Math.abs(b.vy) < 1.0) b.vy = 0; }
    }
    for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) collide(bodies[i], bodies[j]);
    for (const b of bodies) { const tr = Math.max(-14, Math.min(14, b.vx * 1.6)); b.rot += (tr - b.rot) * 0.12; render(b); }
    raf = requestAnimationFrame(step);
  }
  function collide(a, b) {
    if (a.wait > 0 || b.wait > 0) return;
    const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
    const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
    if (ox <= 0 || oy <= 0) return;
    if (ox < oy) {
      const dir = a.x < b.x ? -1 : 1;
      if (a.held) { b.x -= dir * ox; b.vx = a.vx * .6; } else if (b.held) { a.x += dir * ox; a.vx = b.vx * .6; }
      else { a.x += dir * ox / 2; b.x -= dir * ox / 2; const tv = a.vx; a.vx = b.vx * .5; b.vx = tv * .5; }
    } else {
      const dir = a.y < b.y ? -1 : 1;
      if (a.held) { b.y -= dir * oy; b.vy = 0; } else if (b.held) { a.y += dir * oy; a.vy = 0; }
      else { a.y += dir * oy / 2; b.y -= dir * oy / 2; a.vy *= .5; b.vy *= .5; }
    }
  }
  function settleStatic() { let x = 10; for (const b of bodies) { if (x + b.w > W) x = 10; b.x = x; b.y = H - b.h - 10; b.rot = 0; render(b); x += b.w + 12; } }
  function addDrag(b) {
    const pt = e => e.touches ? e.touches[0] : e;
    let lx = 0, ly = 0, ox = 0, oy = 0;
    const down = e => { b.held = true; b.el.classList.add('dragging'); b.el.style.zIndex = ++zTop; const r = pillField.getBoundingClientRect(), p = pt(e); ox = p.clientX - r.left - b.x; oy = p.clientY - r.top - b.y; lx = p.clientX; ly = p.clientY; e.preventDefault(); };
    const move = e => { if (!b.held) return; const r = pillField.getBoundingClientRect(), p = pt(e); b.x = Math.max(0, Math.min(p.clientX - r.left - ox, W - b.w)); b.y = Math.max(-b.h, Math.min(p.clientY - r.top - oy, H - b.h)); b.vx = p.clientX - lx; b.vy = p.clientY - ly; lx = p.clientX; ly = p.clientY; if (reduce) render(b); };
    const up = () => { if (b.held) { b.held = false; b.el.classList.remove('dragging'); } };
    b.el.addEventListener('mousedown', down); b.el.addEventListener('touchstart', down, { passive: false });
    addEventListener('mousemove', move); addEventListener('touchmove', move, { passive: false });
    addEventListener('mouseup', up); addEventListener('touchend', up);
  }
  // update pill labels in place when language changes (no re-drop)
  langHandlers.push(() => { bodies.forEach((b, i) => { b.el.innerHTML = label(i); }); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(build); else build();
  let prt; addEventListener('resize', () => { clearTimeout(prt); prt = setTimeout(build, 300); });
}

/* PLAYGROUND draggable chips — re-renders on language change */
const canvas = document.getElementById('pgCanvas');
if (canvas) {
  const pieces = [
    { en: '<div class="k">Aa</div><div class="s">Inter — display</div>', ru: '<div class="k">Aa</div><div class="s">Inter — заголовки</div>', x: 6, y: 24, cls: '' },
    { en: '<span class="hexv">#E8552F</span>', ru: '<span class="hexv">#E8552F</span>', x: 30, y: 14, cls: 'color', style: 'background:#e8552f' },
    { en: '<span class="hexv">#2FAA5E</span>', ru: '<span class="hexv">#2FAA5E</span>', x: 30, y: 56, cls: 'color', style: 'background:#2faa5e' },
    { en: '<span class="hexv">#3F5BBB</span>', ru: '<span class="hexv">#3F5BBB</span>', x: 47, y: 32, cls: 'color', style: 'background:#3f5bbb' },
    { en: '✺', ru: '✺', x: 64, y: 12, cls: 'emoji' },
    { en: '◐', ru: '◐', x: 80, y: 52, cls: 'emoji' },
    { en: 'grid is good', ru: 'сетка — сила', x: 58, y: 64, cls: 'pill', style: 'background:#fbe7df;color:#e8552f' },
    { en: 'ship it', ru: 'в релиз', x: 12, y: 66, cls: 'pill', style: 'background:#f4f1ea;color:#14130f' },
    { en: '<div class="k">8pt</div><div class="s">spacing scale</div>', ru: '<div class="k">8pt</div><div class="s">шкала отступов</div>', x: 72, y: 26, cls: '' },
    { en: '<div class="k">↺</div><div class="s">motion: 240ms</div>', ru: '<div class="k">↺</div><div class="s">анимация: 240ms</div>', x: 44, y: 68, cls: '' }
  ];
  let zTop = 10;
  function placeChips() {
    canvas.querySelectorAll('.chip').forEach(c => c.remove());
    const W = canvas.clientWidth, H = canvas.clientHeight;
    pieces.forEach(p => {
      const c = document.createElement('div');
      c.className = 'chip ' + p.cls;
      if (p.style) c.setAttribute('style', p.style);
      c.innerHTML = lang === 'ru' ? p.ru : p.en;
      canvas.appendChild(c);
      c.style.left = Math.min(p.x / 100 * W, W - c.offsetWidth - 8) + 'px';
      c.style.top = Math.min(p.y / 100 * H, H - c.offsetHeight - 8) + 'px';
      makeDraggable(c);
    });
  }
  function makeDraggable(el) {
    let sx, sy, ox, oy, dragging = false;
    const down = e => { dragging = true; el.classList.add('dragging'); el.style.zIndex = ++zTop; const pt = e.touches ? e.touches[0] : e; sx = pt.clientX; sy = pt.clientY; ox = parseFloat(el.style.left); oy = parseFloat(el.style.top); e.preventDefault(); };
    const move = e => { if (!dragging) return; const pt = e.touches ? e.touches[0] : e; const W = canvas.clientWidth, H = canvas.clientHeight; let nx = ox + (pt.clientX - sx), ny = oy + (pt.clientY - sy); nx = Math.max(0, Math.min(nx, W - el.offsetWidth)); ny = Math.max(0, Math.min(ny, H - el.offsetHeight)); el.style.left = nx + 'px'; el.style.top = ny + 'px'; };
    const up = () => { dragging = false; el.classList.remove('dragging'); };
    el.addEventListener('mousedown', down); el.addEventListener('touchstart', down, { passive: false });
    addEventListener('mousemove', move); addEventListener('touchmove', move, { passive: false });
    addEventListener('mouseup', up); addEventListener('touchend', up);
  }
  langHandlers.push(placeChips);
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(placeChips, 200); });
}

/* ---------- wire language buttons + first render ---------- */
document.querySelectorAll('.lang-switch button').forEach(b => b.addEventListener('click', () => applyLang(b.dataset.lang)));
applyLang(lang);
enableMagnetic();

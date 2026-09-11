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
    'hero.hello': 'Hi, I\'m Aruzhan',
    'hero.h1': 'Product Designer focused on <em>B2B, AI</em> and complex digital products.',
    'hero.current': 'Currently designing <b>complex B2B workflows</b> and a <b>multi-brand design system</b>.',
    'hero.trayLabel': 'How I spend my days — drag them around',
    'projects.head': 'Projects', 'trusted.label': 'Selected product work',
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
    'cta.h3': 'Have a role or project in mind?', 'cta.p': 'I\'m open to full-time roles and select freelance work in 2026. Let\'s find 20 minutes to talk.', 'cta.btn': 'Get in touch',
    'foot.msg': 'Let\'s connect.<br>I\'m always down for a chat.', 'foot.built': 'Built with love &amp; a little code',
    'about.h1': 'It\'s Aruzhan. But you read it like <em>"ah-roo-zhan"</em>.', 'about.sub': 'Looks harder than it actually is — thank you, mom and dad.',
    'about.p1': 'I\'m a <b>UI-UX designer</b> with 1.5 years of experience — in-house and on select freelance projects.',
    'about.p2': 'I\'ve worked on websites, SaaS platforms, mobile apps, dashboards, and design systems. I usually sit somewhere between <em>UX logic and UI craft</em> — I like figuring out how things should work, what\'s making them confusing, and how to turn that into something clear and usable.',
    'about.p3': 'In my current role I work mostly on <b>complex B2B tools</b> — dense workflows, edge cases, regulations and trade-offs. These products are often treated as "just functional", but I think they deserve the same care, clarity, and visual polish as any consumer-facing app.',
    'about.p4': 'My process usually starts with asking <em>a lot of questions</em>. I\'d rather understand the real problem (and the constraints around it) before pushing a single pixel — good design is mostly good decisions made early.',
    'about.p5': 'When I\'m not designing, I\'m usually still close to it — exploring AI product design, learning 3D in Maya, and playing with data visualization just to see what\'s possible. I\'m early in my journey and genuinely curious, so most of my free time goes into picking up something new — not always successfully, but always gladly.',
    'about.whatido': 'What I do', 'about.tools': 'Tools',
    'about.sk1': 'Product &amp; UX Design', 'about.lv1': 'Advanced', 'about.sk2': 'Design Systems', 'about.lv2': 'Advanced',
    'about.sk3': 'Prototyping &amp; Motion', 'about.lv3': 'Advanced', 'about.sk4': 'Research', 'about.lv4': 'Advanced',
    'about.sk5': 'AI', 'about.lv5': 'Advanced',
    'pg.h1': 'Experiments, <em>off the clock</em>.', 'pg.p': 'Loose explorations, color studies, and interface ideas that didn\'t fit anywhere else. Grab a piece and drag it around — it\'s a playground, after all.', 'pg.hint': '✋ Drag the pieces around',
    'cs.back': '← All work', 'cs.intro': 'Intro', 'cs.role': 'Role', 'cs.status': 'Status', 'cs.type': 'Type',
    'cs.problems': 'The challenge', 'cs.solution': 'The solution', 'cs.results': 'The outcome', 'cs.gallery': 'Screenshot gallery',
    'cs.next': 'Next up', 'cs.viewcase': 'View case study', 'cs.viewproj': 'View project', 'cs.viewlive': 'View live site', 'cs.soon': 'Coming soon', 'drag': 'Drag'
  },
  ru: {
    'nav.work': 'Работы', 'nav.playground': 'Эксперименты', 'nav.about': 'Обо мне', 'nav.cv': 'Резюме ↗',
    'hero.hello': 'Привет, я Аружан',
    'hero.h1': 'Продуктовый дизайнер — <em>B2B, AI</em> и сложные цифровые продукты.',
    'hero.current': 'Сейчас проектирую <b>сложные B2B-процессы</b> и <b>мультибрендовую дизайн-систему</b>.',
    'hero.trayLabel': 'Чем я занимаюсь — перетаскивайте',
    'projects.head': 'Проекты', 'trusted.label': 'Избранные проекты',
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
    'cta.h3': 'Есть вакансия или проект?', 'cta.p': 'Открыта для работы в штате и избранных фриланс-проектов в 2026. Давайте найдём 20 минут поговорить.', 'cta.btn': 'Связаться',
    'foot.msg': 'Давайте на связь.<br>Всегда рада поговорить.', 'foot.built': 'Сделано с любовью и немного кодом',
    'about.h1': 'Это Аружан. Читается как <em>«а-ру-жан»</em>.', 'about.sub': 'Выглядит сложнее, чем есть — спасибо маме и папе.',
    'about.p1': 'Я <b>UI-UX-дизайнер</b> с 1,5-летним опытом — в штате и на отдельных фриланс-проектах.',
    'about.p2': 'Я работала над сайтами, SaaS-платформами, мобильными приложениями, дашбордами и дизайн-системами. Обычно я где-то между <em>UX-логикой и UI-ремеслом</em> — люблю разбираться, как всё должно работать, что сбивает с толку и как превратить это в понятное и удобное.',
    'about.p3': 'Сейчас я в основном работаю над <b>сложными B2B-инструментами</b> — плотные сценарии, крайние случаи, регуляторика и компромиссы. Такие продукты часто считают «просто функциональными», но я уверена, что они заслуживают той же заботы, ясности и визуальной проработки, что и любое потребительское приложение.',
    'about.p4': 'Мой процесс обычно начинается с <em>множества вопросов</em>. Я предпочитаю понять настоящую задачу (и её ограничения), прежде чем двигать хоть один пиксель — хороший дизайн это в основном хорошие решения, принятые рано.',
    'about.p5': 'Когда я не занимаюсь дизайном, я всё равно чаще всего рядом с ним — изучаю AI-дизайн продуктов, осваиваю 3D в Maya и играюсь с визуализацией данных, просто чтобы понять, что ещё возможно. Я в начале своего пути и по-настоящему любопытна, поэтому большую часть свободного времени учусь чему-то новому — не всегда успешно, но всегда с удовольствием.',
    'about.whatido': 'Что я делаю', 'about.tools': 'Инструменты',
    'about.sk1': 'Продуктовый и UX-дизайн', 'about.lv1': 'Продвинуто', 'about.sk2': 'Дизайн-системы', 'about.lv2': 'Продвинуто',
    'about.sk3': 'Прототипы и анимация', 'about.lv3': 'Продвинуто', 'about.sk4': 'Исследования', 'about.lv4': 'Продвинуто',
    'about.sk5': 'AI', 'about.lv5': 'Продвинуто',
    'pg.h1': 'Эксперименты <em>в свободное время</em>.', 'pg.p': 'Свободные исследования, цветовые этюды и идеи интерфейсов, которым не нашлось места. Возьмите элемент и потяните — это же лаборатория.', 'pg.hint': '✋ Перетаскивайте элементы',
    'cs.back': '← Все работы', 'cs.intro': 'Вступление', 'cs.role': 'Роль', 'cs.status': 'Статус', 'cs.type': 'Тип',
    'cs.problems': 'Задача', 'cs.solution': 'Решение', 'cs.results': 'Результат', 'cs.gallery': 'Галерея скриншотов',
    'cs.next': 'Далее', 'cs.viewcase': 'Смотреть кейс', 'cs.viewproj': 'Смотреть проект', 'cs.viewlive': 'Открыть сайт', 'cs.soon': 'Скоро', 'drag': 'Тяни'
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
    id: 'ai-landings', name: 'Compliance', kind: 'Landing · Marketing', yr: '2024', accent: '#e8552f', icon: '✨', url: '',
    subtitle: 'A set of marketing landing pages for an AI product suite.',
    benefits: ['Landing pages', 'Marketing', 'Conversion', 'Visual system'],
    gallery: ['cards', 'grid', 'cards', 'dashboard', 'cards'],
    title: 'Selling an AI compliance product in three scrolls',
    role: ['Product Designer', 'Visual Design'], status: ['Shipped', '2024'], type: ['Landing', 'Marketing', 'Web'],
    intro: [
      'Compliance runs automated checks on companies and counterparties. The product is easy to use and hard to explain — the value lives in data sources and risk logic nobody wants to read about.',
      'I built a section-and-component system for the landing family: a few ways to open, a few ways to show the product, a few ways to close. New pages get assembled from those blocks in a day and still look like one brand, in light and dark.'
    ]
  },
  {
    id: 'spk', name: 'Argus', kind: 'Analytics · B2G', yr: '2025', accent: '#38b6ff', icon: '🔎', url: '',
    subtitle: 'An analytics platform for due diligence — global search across companies and people.',
    benefits: ['Analytics', 'Global search', 'Dossiers', 'Data-dense UI'],
    gallery: ['dashboard', 'grid', 'dashboard', 'cards', 'dashboard'],
    title: 'Due diligence that takes minutes, not days',
    role: ['Product Designer', 'UX + UI'], status: ['Live demo', '2025'], type: ['Analytics', 'B2G', 'Web'],
    intro: [
      'Argus pulls scattered public data — company registries, filings, procurement, foreign trade — into one searchable place. An analyst who used to open eight sources now opens one.',
      'I designed the search-first experience and the dossier views: what appears the moment you type a name, how connections between people and companies are shown, and how a long analytical session stays readable in dark mode.'
    ]
  },
  {
    id: 'aml', name: 'Aegis', kind: 'Compliance · Fintech', yr: '2025', accent: '#3f5bbb', icon: '🛡️', url: '',
    subtitle: 'Anti-money-laundering platform — client screening, risk scoring, and case investigation.',
    benefits: ['Compliance', 'Risk scoring', 'Case workflows', 'Data-dense UI'],
    gallery: ['dashboard', 'grid', 'dashboard', 'cards', 'dashboard'],
    title: 'Making anti-money-laundering work readable',
    role: ['Product Designer', 'UX + UI'], status: ['In progress', '2025'], type: ['Compliance', 'Fintech', 'B2B'],
    intro: [
      'Aegis helps compliance analysts screen clients, score risk, and investigate suspicious activity. Every screen carries a lot: sanctions hits, ownership chains, transaction patterns, and the regulatory rule behind each of them.',
      'I own the design end to end — turning regulatory logic into flows an analyst can move through under time pressure, and keeping density from turning into noise.'
    ]
  },
  {
    id: 'speakup', name: 'Speak Up', kind: 'Ethics · HR', yr: '2025', accent: '#2faa5e', icon: '📣', url: '',
    subtitle: 'A safe whistleblowing and feedback platform for employees to raise concerns.',
    benefits: ['Whistleblowing', 'Trust & safety', 'Anonymous reports', 'Case tracking'],
    gallery: ['phone', 'cards', 'phone', 'grid', 'phone'],
    title: 'A channel people actually trust enough to use',
    role: ['Product Designer', 'UX + UI'], status: ['In progress', '2025'], type: ['Ethics', 'HR', 'B2B'],
    intro: [
      'Speak Up lets employees report concerns and share feedback — anonymously when they need to. Trust is the whole product: a channel people doubt is a channel nobody opens.',
      'I designed both sides — the reporting flow for employees and the case queue for reviewers — keeping the tone calm and making every privacy promise visible at the moment it matters, not buried in a policy.'
    ]
  },
  {
    id: 'digital-office', name: 'Cadence', kind: 'Enterprise product', yr: '2024—25', accent: '#d99a16', icon: '🗂️', url: '',
    subtitle: 'A digital workplace for tasks, documents, and team collaboration.',
    benefits: ['Enterprise', 'Task management', 'Dashboards', 'Design system'],
    gallery: ['dashboard', 'grid', 'dashboard', 'cards', 'grid'],
    title: 'One workspace instead of six tabs',
    role: ['Product Designer', 'Design System'], status: ['In progress', '2024—25'], type: ['Enterprise', 'Productivity', 'B2B'],
    intro: [
      'Cadence brings tasks, documents and team communication into one workspace, so a working day stops being a loop of switching between tools.',
      'I work on the core flows and a reusable component set — the part that decides whether a dense enterprise product stays learnable as teams keep adding to it.'
    ]
  }

];
const CS_RU = {
  aml: {
    kind: 'Комплаенс · Финтех', subtitle: 'Платформа противодействия отмыванию денег — скрининг клиентов, риск-скоринг и расследование кейсов.',
    benefits: ['Комплаенс', 'Риск-скоринг', 'Кейс-процессы', 'Плотный UI'],
    title: 'Как сделать AML-работу читаемой',
    role: ['Продуктовый дизайнер', 'UX + UI'], status: ['В работе', '2025'], type: ['Комплаенс', 'Финтех', 'B2B'],
    intro: [
      'Aegis помогает комплаенс-аналитикам проверять клиентов, оценивать риск и расследовать подозрительную активность. На каждом экране много всего: санкционные совпадения, цепочки владения, паттерны транзакций и регуляторное правило за каждым из них.',
      'Я веду дизайн целиком — превращаю регуляторную логику в сценарии, по которым аналитик проходит в условиях дедлайна, и слежу, чтобы плотность не превращалась в шум.'
    ]
  },
  speakup: {
    kind: 'Этика · HR', subtitle: 'Безопасная платформа для обращений сотрудников и обратной связи.',
    benefits: ['Обращения', 'Доверие', 'Анонимность', 'Учёт кейсов'],
    title: 'Канал, которому доверяют настолько, чтобы им пользоваться',
    role: ['Продуктовый дизайнер', 'UX + UI'], status: ['В работе', '2025'], type: ['Этика', 'HR', 'B2B'],
    intro: [
      'Speak Up позволяет сотрудникам сообщать о проблемах и делиться обратной связью — при необходимости анонимно. Доверие здесь и есть продукт: канал, в котором сомневаются, просто не открывают.',
      'Я спроектировала обе стороны — подачу обращения для сотрудника и очередь кейсов для проверяющего, — сохраняя спокойный тон и показывая каждое обещание о приватности в тот момент, когда оно важно, а не пряча его в политике.'
    ]
  },
  'ai-landings': {
    kind: 'Лендинг · Маркетинг', subtitle: 'Серия маркетинговых лендингов для линейки AI-продуктов.',
    benefits: ['Лендинги', 'Маркетинг', 'Конверсия', 'Визуальная система'],
    title: 'Как продать AI-проверки за три экрана',
    role: ['Продуктовый дизайнер', 'Визуальный дизайн'], status: ['Запущено', '2024'], type: ['Лендинг', 'Маркетинг', 'Web'],
    intro: [
      'Compliance автоматически проверяет компании и контрагентов. Продукт простой в использовании и сложный в объяснении — ценность спрятана в источниках данных и риск-логике, которую никто не хочет читать.',
      'Я собрала систему секций и компонентов для всей линейки лендингов: несколько способов открыть страницу, несколько — показать продукт, несколько — закрыть на действие. Новая страница собирается из этих блоков за день и остаётся в одном стиле, в светлой и тёмной теме.'
    ]
  },
  'digital-office': {
    kind: 'Корпоративный продукт', subtitle: 'Цифровой офис для задач, документов и командной работы.',
    benefits: ['Enterprise', 'Задачи', 'Дашборды', 'Дизайн-система'],
    title: 'Одно рабочее место вместо шести вкладок',
    role: ['Продуктовый дизайнер', 'Дизайн-система'], status: ['В работе', '2024—25'], type: ['Enterprise', 'Продуктивность', 'B2B'],
    intro: [
      'Cadence объединяет задачи, документы и общение команды в одном пространстве, чтобы рабочий день перестал быть циклом переключений между инструментами.',
      'Я работаю над ключевыми сценариями и переиспользуемым набором компонентов — тем, от чего зависит, останется ли плотный корпоративный продукт понятным, пока команды продолжают в него что-то добавлять.'
    ]
  },

  spk: {
    kind: 'Аналитика · B2G', subtitle: 'Аналитическая платформа для проверки — глобальный поиск по компаниям и людям.',
    benefits: ['Аналитика', 'Глобальный поиск', 'Досье', 'Плотный UI'],
    title: 'Проверка контрагента за минуты, а не за дни',
    role: ['Продуктовый дизайнер', 'UX + UI'], status: ['Демо', '2025'], type: ['Аналитика', 'B2G', 'Web'],
    intro: [
      'Argus собирает разрозненные открытые данные — реестры, выписки, закупки, ВЭД — в одном месте с общим поиском. Аналитик, который открывал восемь источников, открывает один.',
      'Я спроектировала поиск как точку входа и экраны досье: что появляется в момент, когда вводишь имя, как показаны связи между людьми и компаниями и как многочасовая сессия остаётся читаемой в тёмной теме.'
    ]
  }
};
function loc(p) { return (lang === 'ru' && CS_RU[p.id]) ? Object.assign({}, p, CS_RU[p.id]) : p; }
const PSR = {
  en: {
    'ai-landings': { problem: 'An abstract AI product gets scrolled past. People need to understand what it checks and why it matters before they\'ll click anything.', solution: 'I led with the concrete — real check results on screen instead of promises — and built reusable blocks so every page in the suite argues the same way.', result: 'Shipped and live. New landings go from brief to page in days, without a design round each time.' },
    spk: { problem: 'Vetting one counterparty meant jumping between separate registries, copying data by hand, and hoping nothing was missed.', solution: 'One global search across people, companies, filings and trade data, with dossiers that assemble the whole picture on a single page.', result: 'A live demo analysts can run a real check in — search to dossier without leaving the product.' },
    aml: { problem: 'Risk decisions were made from scattered, dense data. A missed signal is a regulatory problem, and an overloaded screen is how signals get missed.', solution: 'I mapped the review journey and designed screening, scoring and case-investigation flows that surface only what the next decision needs.', result: 'In progress — the core review flow is designed and in build, with a component set that keeps new rule types from breaking the layout.' },
    speakup: { problem: 'People stay silent unless they can see, not just be told, that a report is safe and goes somewhere.', solution: 'Anonymous-first reporting, plain language at every step, and a status the reporter can follow without revealing who they are.', result: 'In progress — a reporting experience that reads as fair to employees and stays structured for the teams handling cases.' },
    'digital-office': { problem: 'Work lived in disconnected tools. Context was lost in the gaps between them, and every new feature made the product harder to learn.', solution: 'Core flows built on one navigation model, plus a component set and tokens that keep new modules consistent by default.', result: 'In progress — a growing enterprise product where new modules ship without a redesign.' },
  },
  ru: {
    'ai-landings': { problem: 'Абстрактный AI-продукт просто пролистывают. Человек должен понять, что именно проверяется и зачем, прежде чем нажмёт хоть что-то.', solution: 'Я начинаю с конкретного — на экране настоящие результаты проверки, а не обещания, — и собрала переиспользуемые блоки, чтобы все страницы линейки аргументировали одинаково.', result: 'Запущено. Новый лендинг проходит путь от брифа до страницы за пару дней, без отдельного дизайн-раунда каждый раз.' },
    spk: { problem: 'Проверка одного контрагента означала прыжки между отдельными реестрами, ручное копирование данных и надежду, что ничего не упущено.', solution: 'Один глобальный поиск по людям, компаниям, выпискам и данным о торговле, с досье, которые собирают всю картину на одной странице.', result: 'Живое демо, в котором аналитик проводит реальную проверку — от поиска до досье, не выходя из продукта.' },
    aml: { problem: 'Решения о риске принимались по разрозненным плотным данным. Пропущенный сигнал — это регуляторная проблема, а перегруженный экран — то, как сигналы и пропускают.', solution: 'Я разложила путь проверки и спроектировала сценарии скрининга, скоринга и расследования так, чтобы на экране было только то, что нужно для следующего решения.', result: 'В работе — ключевой сценарий проверки спроектирован и в разработке, с набором компонентов, который не ломается от новых типов правил.' },
    speakup: { problem: 'Люди молчат, пока не увидят — а не услышат — что обращение безопасно и дойдёт до адресата.', solution: 'Анонимность по умолчанию, простой язык на каждом шаге и статус, который заявитель отслеживает, не раскрывая себя.', result: 'В работе — опыт обращений, который ощущается честным для сотрудника и остаётся структурированным для команды, обрабатывающей кейсы.' },
    'digital-office': { problem: 'Работа жила в разрозненных инструментах. Контекст терялся в зазорах между ними, и каждая новая функция делала продукт сложнее для освоения.', solution: 'Ключевые сценарии на единой модели навигации плюс набор компонентов и токенов, благодаря которым новые модули консистентны по умолчанию.', result: 'В работе — растущий корпоративный продукт, где новые модули выходят без редизайна.' },
  }
};
const MEANING = {
  en: {
    'aml': '<b>Aegis</b> — the shield of the gods · protection from financial-crime risk',
    'speakup': '<b>Speak Up</b> — a safe, honest channel to raise concerns',
    'ai-landings': '<b>Compliance</b> — AI-powered checks, all in one window',
    'digital-office': '<b>Cadence</b> — a steady rhythm · the flow of everyday work',
    'spk': '<b>Argus</b> — the hundred-eyed watchman · all-seeing anti-corruption oversight'
  },
  ru: {
    'aml': '<b>Aegis</b> — эгида, щит богов · защита от рисков финансовых преступлений',
    'speakup': '<b>Speak Up</b> — безопасный и честный канал, чтобы высказаться',
    'ai-landings': '<b>Compliance</b> — ИИ-проверки в одном окне',
    'digital-office': '<b>Cadence</b> — ровный ритм · поток ежедневной работы',
    'spk': '<b>Argus</b> — стоокий страж · всевидящий антикоррупционный надзор'
  }
};
const PREVIEW = {
  'aml': ['shots/aegis-1.png', 'shots/aegis-2.png', 'shots/aegis-3.png', 'shots/aegis-4.png', 'shots/aegis-5.png'],
  'speakup': ['shots/candor-1.png', 'shots/candor-2.png', 'shots/candor-3.png', 'shots/candor-4.png', 'shots/candor-5.png'],
  'ai-landings': ['shots/prism-1.png', 'shots/prism-2.png', 'shots/prism-3.png', 'shots/prism-4.png', 'shots/prism-5.png'],
  'digital-office': ['shots/cadence-1.png', 'shots/cadence-2.png', 'shots/cadence-3.png', 'shots/cadence-4.png', 'shots/cadence-5.png'],
  'spk': ['shots/spk.png', 'shots/ean-person.png', 'shots/ean-esf.png', 'shots/ean-proc.png']
};
const LOGOS = { 'spk': 'shots/logo-ean.png' };
const LINKS = { 'ai-landings': 'https://ac.adata.kz/compliance' };
const BADGES = { 'ai-landings': 'AI', 'spk': 'AI' };
const SCREENS = {
  'speakup': ['shots/candor-1.png', 'shots/candor-2.png', 'shots/candor-3.png', 'shots/candor-4.png', 'shots/candor-5.png'],
  'aml': ['shots/aegis-1.png', 'shots/aegis-2.png', 'shots/aegis-3.png', 'shots/aegis-4.png', 'shots/aegis-5.png'],
  'ai-landings': ['shots/prism-1.png', 'shots/prism-2.png', 'shots/prism-3.png', 'shots/prism-4.png', 'shots/prism-5.png'],
  'digital-office': ['shots/cadence-1.png', 'shots/cadence-2.png', 'shots/cadence-3.png', 'shots/cadence-4.png', 'shots/cadence-5.png'],
  'spk': ['shots/ean-login.png', 'shots/ean-person.png', 'shots/ean-esf.png', 'shots/ean-proc.png']
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
  let down = false, startX = 0, sl = 0, moved = false, pid = null;
  // kill native image / link drag so grab-to-scroll wins
  g.addEventListener('dragstart', e => e.preventDefault());
  g.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;        // let native scroll handle touch
    if (e.button !== 0) return;
    down = true; moved = false; pid = e.pointerId; startX = e.pageX; sl = g.scrollLeft;
    g.classList.add('dragging');
  });
  g.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.pageX - startX;
    if (!moved && Math.abs(dx) > 3) { moved = true; try { g.setPointerCapture(pid); } catch (_) {} }
    if (moved) { e.preventDefault(); g.scrollLeft = sl - dx; }
  });
  const end = () => { if (!down) return; down = false; g.classList.remove('dragging'); };
  g.addEventListener('pointerup', end);
  g.addEventListener('pointercancel', end);
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
      el.draggable = false;                                   // stop native link-drag hijacking strip scroll
      el.addEventListener('dragstart', e => e.preventDefault());
      const btn = `<span class="cs-btn"><span>${t('cs.viewcase')}</span> <span>→</span></span>`;
      el.innerHTML = `
        <div class="proj-head-row">
          <div class="proj-head-left">
            ${LOGOS[raw.id] ? `<img class="proj-logo" src="${LOGOS[raw.id]}" alt="" />` : ''}
            <div class="proj-meta"><span class="name">${raw.name}</span>${BADGES[raw.id] ? `<span class="proj-badge">${BADGES[raw.id]}</span>` : ''}<span class="kind">${p.kind}</span></div>
          </div>
          ${btn}
        </div>
        ${(MEANING[lang]||MEANING.en)[raw.id] ? `<p class="proj-meaning">${(MEANING[lang]||MEANING.en)[raw.id]}</p>` : ''}
        <p class="subtitle">${p.subtitle}</p>
        <div class="benefits">${p.benefits.map(b => `<span>${b}</span>`).join('')}</div>
        <div class="gallery-wrap"><div class="gallery preview">${(PREVIEW[raw.id] || ['shots/'+raw.id+'.png']).map(src => `<div class="pshot"><img src="${src}?v=hd2" alt="${raw.name}" loading="lazy" draggable="false" /></div>`).join('')}</div></div>`;
      list.appendChild(el);
      if (animate) io.observe(el);
      const g = el.querySelector('.gallery');
      if (g) { enableDragScroll(g); attachDragBadge(el.querySelector('.gallery-wrap'), g); }
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
      <p class="cs-eyebrow">${raw.name}${BADGES[raw.id] ? ` <span class="proj-badge">${BADGES[raw.id]}</span>` : ''} · ${p.kind}</p>
      <h1 class="cs-title">${p.title || p.subtitle}</h1>
      ${(MEANING[lang]||MEANING.en)[raw.id] ? `<p class="cs-meaning">${(MEANING[lang]||MEANING.en)[raw.id]}</p>` : ''}
      ${LINKS[raw.id] ? `<a class="cs-live" href="${LINKS[raw.id]}" target="_blank" rel="noopener">${t('cs.viewlive')} ↗</a>` : ''}
      <div class="cs-grid">
        <div class="cs-intro"><p class="cs-label">${t('cs.intro')}</p>${paras(p.intro) || `<p>${p.subtitle}</p>`}</div>
        <div class="cs-meta">
          <div class="cs-meta-block"><p class="cs-label">${t('cs.role')}</p><div class="cs-chips">${chips(p.role || p.benefits)}</div></div>
          <div class="cs-meta-block"><p class="cs-label">${t('cs.status')}</p><div class="cs-chips">${chips(p.status)}</div></div>
          <div class="cs-meta-block"><p class="cs-label">${t('cs.type')}</p><div class="cs-chips">${chips(p.type || p.benefits)}</div></div>
        </div>
      </div>
      ${(function(){var x=(PSR[lang]||PSR.en)[raw.id];return x?`<div class="psr"><div class="psr-card"><h3>${t('cs.problems')}</h3><p>${x.problem}</p></div><div class="psr-card"><h3>${t('cs.solution')}</h3><p>${x.solution}</p></div><div class="psr-card"><h3>${t('cs.results')}</h3><p>${x.result}</p></div></div>`:'';})()}
      ${(SCREENS[raw.id]||[]).length ? `<div class="cs-gallery-label"><span>${t('cs.gallery')}</span></div>` + (SCREENS[raw.id]).map(src => `<div class="cs-shot"><img src="${src}?v=hd2" alt="${raw.name}" loading="lazy" /></div>`).join('') : ''}
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
    { en: 'Product Design', ru: 'Продуктовый дизайн', c: '#ffd166' },
    { en: 'UX Research', ru: 'UX Research', c: '#ff9fb2' },
    { en: 'UI Design', ru: 'UI Design', c: '#b9a3ff' },
    { en: 'Design Systems', ru: 'Дизайн-системы', c: '#8fdc9b' },
    { en: 'Friendly Design', ru: 'Friendly Design', c: '#7fb8ff' },
    { en: 'Prototyping', ru: 'Прототипирование', c: '#ffb27a' },
    { en: 'Wireframing', ru: 'Вайрфреймы', c: '#76dcc9' },
    { en: 'B2B', ru: 'B2B', c: '#f0b6ff' },
    { en: 'B2C', ru: 'B2C', c: '#ffe08a' },
    { en: 'B2G', ru: 'B2G', c: '#9ad0ff' },
    { en: 'SaaS', ru: 'SaaS', c: '#ff8f6b' },
    { en: 'Claude Code', ru: 'Claude Code', c: '#e6926b' },
    { en: 'Claude Design', ru: 'Claude Design', c: '#cbb2ff' },
    { en: 'AI Design', ru: 'AI-дизайн', c: '#8fe0cb' },
    { en: 'Product thinking', ru: 'Product thinking', c: '#ffd166' },
    { en: 'Data visualization', ru: 'Data visualization', c: '#8fdc9b' },
    { en: 'AI Product Design', ru: 'AI Product Design', c: '#7fb8ff' },
    { en: 'Communication', ru: 'Communication', c: '#ffb27a' },
    { en: 'AI UX', ru: 'AI UX', c: '#76dcc9' },
    { en: 'Maya', ru: 'Maya', c: '#f0b6ff' },
    { en: '3D design', ru: '3D design', c: '#ff8f6b' }
  ];
  const label = i => lang === 'ru' ? pills[i].ru : pills[i].en;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // slow, gentle physics: light gravity, capped fall speed, minimal bounce
  const GRAV = 0.42, MAXV = 8, REST = 0.14, AIR = 0.99, GROUND = 0.9, STAGGER = 14;
  const ANG_DAMP = 0.86, TORQUE = 1.1, ANG_MAX = 9;   // marshmallow settle + edge topple
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
      const b = { el, w, h, x, y, vx: ((i % 2) ? -1 : 1) * (0.15 + (i % 3) * 0.2), vy: 0, rot: 0, va: 0, rest: ((i * 13) % 7 - 3) * 0.8, held: false, wait };
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
      if (b.y + b.h > H) { const hit = b.vy; b.y = H - b.h; b.vy = -b.vy * REST; b.vx *= GROUND; if (Math.abs(b.vy) < 1.0) b.vy = 0; if (hit > 2.5) b.va += b.vx * 0.4 + b.rest * 0.4; }
    }
    for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) collide(bodies[i], bodies[j]);
    for (const b of bodies) { updateAngle(b); render(b); }
    raf = requestAnimationFrame(step);
  }
  // marshmallow rotation: soft wobble-settle when resting, slide off when perched on an edge
  function updateAngle(b) {
    if (b.held) { b.va += (0 - b.rot) * 0.2; b.va *= 0.6; b.rot += b.va; return; }
    const bottom = b.y + b.h;
    const onGround = bottom >= H - 1;
    let supL = Infinity, supR = -Infinity, onPill = false;
    for (const o of bodies) {
      if (o === b) continue;
      if (Math.abs(o.y - bottom) < 6 && o.y >= b.y) {   // o sits directly under b
        const l = Math.max(b.x, o.x), r = Math.min(b.x + b.w, o.x + o.w);
        if (r > l) { supL = Math.min(supL, l); supR = Math.max(supR, r); onPill = true; }
      }
    }
    const com = b.x + b.w / 2;
    const slow = Math.abs(b.vx) < 0.7 && Math.abs(b.vy) < 1.3;
    // perched on another pill with its centre of mass past the edge, and room to slide → tip off
    const overL = onPill && com < supL - 2, overR = onPill && com > supR + 2;
    const canL = b.x > 2, canR = b.x + b.w < W - 2;
    if (!onGround && (overL && canL || overR && canR)) {
      const dir = overL ? -1 : 1;
      b.vx += dir * 0.45; b.vy += 0.15;                 // slide off the edge, then gravity takes over
      b.va += dir * 0.5;                                // a little tip for feedback
    } else if ((onGround || onPill) && slow) {
      b.va += (b.rest - b.rot) * 0.06;                  // settle to a soft, casual lean
    } else {
      const target = Math.max(-14, Math.min(14, b.vx * 1.6));
      b.va += (target - b.rot) * 0.09;                  // airborne / sliding: lean into motion
    }
    b.va *= ANG_DAMP;
    b.va = Math.max(-ANG_MAX, Math.min(ANG_MAX, b.va));
    b.rot += b.va;
    if (b.rot > 22) { b.rot = 22; if (b.va > 0) b.va = 0; }     // lean/tip, never spin
    if (b.rot < -22) { b.rot = -22; if (b.va < 0) b.va = 0; }
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
    const up = () => { if (b.held) { b.held = false; b.el.classList.remove('dragging'); const cap = 24; b.vx = Math.max(-cap, Math.min(cap, b.vx)); b.vy = Math.max(-cap, Math.min(cap, b.vy)); } };
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

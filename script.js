const copyTargets = {
  'copyTagline': 'The shadow that grows with you.',
  'cmd-invoke': document.getElementById('cmd-invoke')?.textContent?.trim() || '',
  'cmd-align': document.getElementById('cmd-align')?.textContent?.trim() || ''
};

const terminalScript = [
  { tag: '01', text: 'I build with restraint: dark layouts, clear labels, and interactions that never demand attention.' },
  { tag: '02', text: 'I keep the scene useful: copy actions, theme switching, and fallback behavior when the browser is old.' },
  { tag: '03', text: 'I speak in the shadow register so the page feels premium, but the intent stays obvious.' }
];

const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const yearEl = document.getElementById('year');
const terminalEl = document.getElementById('terminal');
const liveStatus = document.getElementById('liveStatus');
const navLinks = Array.from(document.querySelectorAll('.nav a'));
const revealTargets = Array.from(document.querySelectorAll('.section, .glass'));

function safeStorageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures.
  }
}

async function copyText(text) {
  if (!text) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to legacy copy.
  }

  const fallback = document.createElement('textarea');
  fallback.value = text;
  fallback.setAttribute('readonly', 'true');
  fallback.style.position = 'fixed';
  fallback.style.opacity = '0';
  document.body.appendChild(fallback);
  fallback.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  fallback.remove();
  return ok;
}

function setTheme(theme) {
  const next = theme === 'light' ? 'light' : 'dark';
  if (next === 'light') {
    root.setAttribute('data-theme', 'light');
    themeIcon.textContent = '☀';
    themeToggle.setAttribute('aria-pressed', 'true');
  } else {
    root.removeAttribute('data-theme');
    themeIcon.textContent = '☾';
    themeToggle.setAttribute('aria-pressed', 'false');
  }
  safeStorageSet('volfirrrr-theme', next);
}

function toggleTheme() {
  const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  setTheme(current === 'light' ? 'dark' : 'light');
}

function initTheme() {
  const saved = safeStorageGet('volfirrrr-theme');
  if (saved) {
    setTheme(saved);
    return;
  }

  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  setTheme(prefersLight ? 'light' : 'dark');
}

function wireCopyButtons() {
  document.querySelectorAll('[data-copy-target]').forEach(button => {
    button.addEventListener('click', async () => {
      const targetId = button.getAttribute('data-copy-target');
      const text = document.getElementById(targetId)?.textContent?.trim() || '';
      const ok = await copyText(text);
      const previous = button.textContent;
      button.textContent = ok ? 'COPIED' : 'FAILED';
      setTimeout(() => {
        button.textContent = previous;
      }, 1400);
    });
  });

  const taglineButton = document.getElementById('copyTagline');
  taglineButton?.addEventListener('click', async () => {
    const ok = await copyText(copyTargets.copyTagline);
    const previous = taglineButton.textContent;
    taglineButton.textContent = ok ? 'COPIED' : 'FAILED';
    setTimeout(() => {
      taglineButton.textContent = previous;
    }, 1400);
  });
}

function updateYear() {
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function buildTerminal() {
  if (!terminalEl) return;

  terminalEl.innerHTML = '';
  terminalScript.forEach(item => {
    const line = document.createElement('div');
    line.className = 'terminal-line';

    const tag = document.createElement('span');
    tag.className = 'terminal-tag';
    tag.textContent = `/${item.tag}`;

    const text = document.createElement('span');
    text.className = 'terminal-text';
    text.setAttribute('aria-label', item.text);

    line.append(tag, text);
    terminalEl.appendChild(line);
  });

  const cursorLine = document.createElement('div');
  cursorLine.className = 'terminal-line';
  const cursorTag = document.createElement('span');
  cursorTag.className = 'terminal-tag';
  cursorTag.textContent = '/04';
  const cursorText = document.createElement('span');
  cursorText.className = 'terminal-text';
  const cursor = document.createElement('span');
  cursor.className = 'terminal-cursor';
  cursor.textContent = '▍';
  cursorText.appendChild(cursor);
  cursorLine.append(cursorTag, cursorText);
  terminalEl.appendChild(cursorLine);

  let lineIndex = 0;
  let charIndex = 0;

  function tick() {
    if (lineIndex >= terminalScript.length) {
      liveStatus.textContent = 'calm / ready / online';
      return;
    }

    const current = terminalEl.querySelectorAll('.terminal-text')[lineIndex];
    if (!current) return;

    current.textContent = terminalScript[lineIndex].text.slice(0, charIndex + 1);
    charIndex += 1;

    if (charIndex >= terminalScript[lineIndex].text.length) {
      lineIndex += 1;
      charIndex = 0;
    }

    setTimeout(tick, lineIndex === terminalScript.length ? 0 : 20 + Math.random() * 20);
  }

  liveStatus.textContent = 'typing / live / active';
  tick();
}

function initReveal() {
  const observerSupported = 'IntersectionObserver' in window;
  if (!observerSupported) {
    revealTargets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealTargets.forEach(el => observer.observe(el));
}

function initNavState() {
  const sections = navLinks
    .map(link => ({ link, section: document.querySelector(link.getAttribute('href')) }))
    .filter(item => item.section);

  if (!('IntersectionObserver' in window)) {
    return;
  }

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.remove('active'));
      const active = navLinks.find(link => link.getAttribute('href') === `#${entry.target.id}`);
      active?.classList.add('active');
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.1 });

  sections.forEach(({ section }) => activeObserver.observe(section));
}

function init() {
  updateYear();
  initTheme();
  wireCopyButtons();
  buildTerminal();
  initReveal();
  initNavState();

  themeToggle?.addEventListener('click', toggleTheme);
}

init();

const lines = [
  'Simple systems. Strong execution. Clean outcomes.',
  'Build quietly. Ship clearly. Improve relentlessly.',
  'Small details, sharp signal, steady momentum.',
  'One page is enough when the message is right.',
  'The shadows are useful when they keep the lights clean.'
];

const systemCards = [
  {
    icon: '✦',
    title: 'Clear purpose',
    text: 'A homepage should answer three questions immediately: who you are, what you do, and where to go next.'
  },
  {
    icon: '⚙',
    title: 'Simple stack',
    text: 'Plain HTML, CSS, and JavaScript keeps hosting free, fast, and compatible with GitHub Pages, Netlify, or Vercel.'
  },
  {
    icon: '⌁',
    title: 'Easy expansion',
    text: 'You can later add blog posts, project pages, a contact form, or a full portfolio without rebuilding the whole site.'
  }
];

const systemContainer = document.getElementById('systemCards');
const motivationalLine = document.getElementById('motivationalLine');
const shuffleBtn = document.getElementById('shuffleBtn');
const yearEl = document.getElementById('year');
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const themeIcon = document.querySelector('.theme-icon');

function renderSystemCards() {
  systemContainer.innerHTML = systemCards.map(card => `
    <article class="card">
      <div class="icon" aria-hidden="true">${card.icon}</div>
      <h3>${card.title}</h3>
      <p>${card.text}</p>
    </article>
  `).join('');
}

function setTheme(theme) {
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
    themeIcon.textContent = '☀';
    themeToggle.setAttribute('aria-pressed', 'true');
  } else {
    root.removeAttribute('data-theme');
    themeIcon.textContent = '☾';
    themeToggle.setAttribute('aria-pressed', 'false');
  }
  localStorage.setItem('creator-theme', theme);
}

function toggleTheme() {
  const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  setTheme(current === 'light' ? 'dark' : 'light');
}

function shuffleLine() {
  const choice = lines[Math.floor(Math.random() * lines.length)];
  motivationalLine.textContent = choice;
}

function init() {
  renderSystemCards();
  yearEl.textContent = new Date().getFullYear();
  shuffleLine();

  const savedTheme = localStorage.getItem('creator-theme');
  if (savedTheme) setTheme(savedTheme);

  shuffleBtn.addEventListener('click', shuffleLine);
  themeToggle.addEventListener('click', toggleTheme);
}

init();

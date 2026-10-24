// 1. Split name into letters for staggered animation
let idx = 0;
document.querySelectorAll('.name .line').forEach(line => {
  [...line.dataset.text].forEach(c => {
    const s = document.createElement('span');
    s.className = 'ch';
    s.style.setProperty('--i', idx++);
    s.innerHTML = c === ' ' ? '&nbsp;' : c;
    line.appendChild(s);
  });
});

// 2. Split About paragraph into words for scroll-lit text
const words = document.getElementById('words');
words.innerHTML = words.textContent.split(' ').map(w => `<span class="w">${w}</span>`).join(' ');
const wEls = [...document.querySelectorAll('.w')];

// 3. Reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 90 + 'ms';
  io.observe(el);
});

// 4. Chapter rail (number + label change per section)
const railNum = document.getElementById('railNum');
const railLabel = document.getElementById('railLabel');
const chapters = document.querySelectorAll('[data-num]');
const chIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    railNum.textContent = e.target.dataset.num;
    railLabel.textContent = e.target.dataset.label;
  }
}), { threshold: .4 });
chapters.forEach(c => chIO.observe(c));

// 5. Scroll-driven effects
const bar = document.querySelector('.progress');
const journey = document.getElementById('journey');
const hTrack = document.getElementById('hTrack');
const marq = document.querySelector('.marquee');

function onScroll() {
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (y / max * 100) + '%';

  // word-by-word light up
  const r = words.getBoundingClientRect();
  const p = Math.min(1, Math.max(0, (innerHeight * .8 - r.top) / (r.height + innerHeight * .3)));
  wEls.forEach((w, i) => w.classList.toggle('on', i / wEls.length < p));

  // horizontal journey
  const jr = journey.getBoundingClientRect();
  const jp = Math.min(1, Math.max(0, -jr.top / (jr.height - innerHeight)));
  hTrack.style.transform = `translateX(${-jp * (hTrack.scrollWidth - innerWidth * .8)}px)`;

  // hero parallax
  document.querySelector('.hero-photo').style.transform = `translateY(${y * -.08}px)`;
}
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// 6. Cursor glow
addEventListener('mousemove', e => {
  const g = document.querySelector('.glow');
  g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px';
});

// 7. 3D tilt on cards
document.querySelectorAll('.tilt').forEach(c => {
  c.addEventListener('mousemove', e => {
    const b = c.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - .5, y = (e.clientY - b.top) / b.height - .5;
    c.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-6px)`;
  });
  c.addEventListener('mouseleave', () => c.style.transform = '');
});

// 8. Magnetic icons
document.querySelectorAll('.magnetic').forEach(m => {
  m.addEventListener('mousemove', e => {
    const b = m.getBoundingClientRect();
    m.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * .35}px, ${(e.clientY - b.top - b.height / 2) * .35}px)`;
  });
  m.addEventListener('mouseleave', () => m.style.transform = '');
});

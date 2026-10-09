// Progressive enhancement: content is readable before this script runs.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const toggle = document.querySelector('[data-motion-toggle]');
const animated = [...document.querySelectorAll('[data-motion]')];
const reveals = [...document.querySelectorAll('[data-reveal], .sage-step')];
const cards = document.querySelectorAll('.card, .pillar, .mq-card');
cards.forEach(card => card.classList.add('motion-card'));
let observer;
function setupMotion() {
  observer?.disconnect();
  if (reducedMotion.matches) {
    animated.forEach(el => el.classList.remove('is-inview'));
    reveals.forEach(el => el.classList.remove('is-revealed'));
    if (toggle) toggle.hidden = true;
    return;
  }
  if (toggle) toggle.hidden = animated.length === 0;
  if (!('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const el = entry.target;
      el.classList.toggle('is-inview', entry.isIntersecting);
      if (entry.isIntersecting && el.matches('[data-reveal], .sage-step')) {
        el.classList.add('ripl-reveal', 'is-revealed');
      }
    });
  }, { threshold: 0.12 });
  [...new Set([...animated, ...reveals])].forEach(el => observer.observe(el));
}
toggle?.addEventListener('click', () => {
  const paused = document.documentElement.toggleAttribute('data-motion-paused');
  toggle.setAttribute('aria-pressed', String(paused));
  toggle.textContent = paused ? 'Play motion' : 'Pause motion';
});
reducedMotion.addEventListener('change', setupMotion);
setupMotion();

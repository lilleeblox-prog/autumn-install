/* Made to Welcome — Theme JS */

/* ── Mobile nav ─────────────────────────────────── */
(function () {
  var btn = document.getElementById('hamburger-btn');
  var nav = document.getElementById('mobile-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    nav.setAttribute('aria-hidden', String(open));
    nav.classList.toggle('is-open', !open);
    btn.classList.toggle('is-open', !open);
  });
})();

/* ── Hero card form toggle ───────────────────────── */
(function () {
  var showBtn = document.getElementById('hero-show-form-btn');
  var cardContent = document.getElementById('hero-card-content');
  var heroForm = document.getElementById('hero-form');
  if (!showBtn || !cardContent || !heroForm) return;

  showBtn.addEventListener('click', function (e) {
    e.preventDefault();
    cardContent.style.display = 'none';
    heroForm.style.display = 'block';
  });
})();

/* ── Gallery carousel ────────────────────────────── */
(function () {
  var track = document.getElementById('gallery-track');
  var prevBtn = document.getElementById('gallery-prev');
  var nextBtn = document.getElementById('gallery-next');
  var dotsContainer = document.getElementById('gallery-dots');
  var locationEl = document.getElementById('gallery-location');
  if (!track) return;

  var slides = track.querySelectorAll('.mtw-gallery__slide');
  var dots = dotsContainer ? dotsContainer.querySelectorAll('.mtw-gallery__dot') : [];
  var locations = [];
  if (dotsContainer) {
    var blocks = track.querySelectorAll('.mtw-gallery__slide');
    blocks.forEach(function (s) {
      locations.push(s.getAttribute('data-location') || '');
    });
  }
  var current = 0;
  var total = slides.length;
  if (total === 0) return;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d, i) {
      d.classList.toggle('mtw-gallery__dot--active', i === current);
    });
    if (locationEl && locations[current]) {
      locationEl.textContent = locations[current];
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });
  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { goTo(i); });
  });
})();

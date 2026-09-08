/* Studio Vallone, interazioni */
document.addEventListener('DOMContentLoaded', function () {

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'Chiudi' : 'Indice';
    });
  }

  var head = document.querySelector('.site-head');
  if (head) {
    var onScroll = function () { head.classList.toggle('is-stuck', window.scrollY > 6); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .item').forEach(function (el) { io.observe(el); });

  document.querySelectorAll('a.mailto').forEach(function (a) {
    var ind = a.dataset.u + String.fromCharCode(64) + a.dataset.d;
    a.href = 'mail' + 'to:' + ind;
    a.textContent = ind;
  });

  var consenso = null;
  try { consenso = localStorage.getItem('sv-consenso'); } catch (e) { consenso = null; }
  if (!consenso) {
    var b = document.createElement('div');
    b.className = 'cbanner show';
    b.innerHTML = '<p>Questo sito utilizza solo cookie tecnici. La mappa nella pagina Contatti e fornita da Google e viene caricata unicamente con il consenso dell\'utente. Maggiori informazioni nella <a href="cookie.html">cookie policy</a> e nella <a href="privacy.html">informativa privacy</a>.</p>' +
      '<span class="actions"><button type="button" class="solo">Solo cookie tecnici</button><button type="button" class="primary tutti">Accetta contenuti esterni</button></span>';
    document.body.appendChild(b);
    b.addEventListener('click', function (ev) {
      var scelta = ev.target.classList.contains('tutti') ? 'tutti' : (ev.target.classList.contains('solo') ? 'solo' : null);
      if (!scelta) return;
      try { localStorage.setItem('sv-consenso', scelta); } catch (e) {}
      b.classList.remove('show');
      if (scelta === 'tutti' && window.svApriMappa) window.svApriMappa();
    });
  }

  var mapBtn = document.querySelector('.map-cta');
  if (mapBtn) {
    var apri = function () {
      var holder = mapBtn.parentElement;
      if (!holder || holder.querySelector('iframe')) return;
      var f = document.createElement('iframe');
      f.loading = 'lazy';
      f.title = 'Mappa, Via Caradosso 18, Milano';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.src = mapBtn.dataset.src;
      holder.appendChild(f);
      mapBtn.remove();
    };
    mapBtn.addEventListener('click', apri);
    window.svApriMappa = apri;
    if (consenso === 'tutti') apri();
  }
});

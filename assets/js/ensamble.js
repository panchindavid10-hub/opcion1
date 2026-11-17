/* ==========================================================================
   Muso Business — Avión que se arma y se desarma con el scroll
   Sin JavaScript (o con "reducir movimiento") se muestra el avión armado.
   ========================================================================== */
(function () {
  'use strict';

  var sec = document.getElementById('ensamble');
  if (!sec) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* Desplazamiento de cada pieza cuando está desarmada: [dx, dy, giro, inicio, fin]
     inicio/fin = tramo del scroll (0 a 1) en el que la pieza llega a su sitio */
  var PARTS = {
    fuselage: [0, -40, 0, 0.05, 0.16],
    wingL: [-120, 40, -9, 0.11, 0.22],
    wingR: [120, 40, 9, 0.12, 0.23],
    stabL: [-95, 75, -16, 0.18, 0.28],
    stabR: [95, 75, 16, 0.19, 0.29],
    engL: [-150, -160, -90, 0.30, 0.38],
    engR: [150, -160, 90, 0.32, 0.40],
    avionics: [140, -60, 0, 0.42, 0.50],
    gearN: [0, 455, 0, 0.60, 0.645],
    gearL: [-60, 300, 0, 0.615, 0.66],
    gearR: [60, 300, 0, 0.63, 0.675]
  };
  var STEPS = [[0.03, 0.30], [0.30, 0.42], [0.42, 0.52], [0.52, 0.60], [0.60, 0.68], [0.68, 0.84]];
  var STEP_PARTS = [['fuselage', 'wingL', 'wingR', 'stabL', 'stabR'], ['engL', 'engR'], ['avionics'], [], ['gearN', 'gearL', 'gearR'], []];
  var OUT = [0.86, 0.995]; // tramo final: se desarma de nuevo

  var els = {};
  Object.keys(PARTS).forEach(function (k) { els[k] = sec.querySelector('[data-part="' + k + '"]'); });
  var lines = sec.querySelectorAll('.asm-line');
  var tags = sec.querySelector('.asm-tags');
  var steps = sec.querySelectorAll('.asm-step');
  var bar = sec.querySelector('.asm-progress span');
  var hud = sec.querySelector('.asm-hud-val');
  var statusEl = sec.querySelector('.asm-status');
  var labels = (statusEl.getAttribute('data-labels') || '').split('|');

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function seg(p, a, b) { return clamp((p - a) / (b - a)); }

  var lastStep = -2, lastStatus = '';

  var spread = 1;
  function measure() { spread = window.innerWidth < 640 ? 0.7 : 1; }
  measure();

  function render(p) {
    var out = ease(seg(p, OUT[0], OUT[1]));
    var sum = 0, n = 0;

    Object.keys(PARTS).forEach(function (k) {
      var c = PARTS[k], el = els[k];
      if (!el) return;
      var t = ease(seg(p, c[3], c[4]));
      var f = (1 - t) + out * 1.2;          // 1 = desarmada, 0 = en su sitio
      el.style.transform = 'translate(' + (c[0] * f * spread).toFixed(1) + 'px,' + (c[1] * f).toFixed(1) + 'px) rotate(' + (c[2] * f).toFixed(2) + 'deg)';
      sum += t * (1 - out); n++;
    });

    // Líneas de fluidos (consumibles)
    var lt = ease(seg(p, 0.52, 0.59)) * (1 - ease(seg(p, OUT[0], OUT[0] + 0.05)));
    for (var i = 0; i < lines.length; i++) lines[i].style.strokeDashoffset = (1 - lt).toFixed(3);

    // Banderolas Remove Before Flight: aparecen y se retiran antes del vuelo
    var tin = ease(seg(p, 0.68, 0.72)), tout = ease(seg(p, 0.77, 0.81));
    tags.style.opacity = (tin * (1 - tout)).toFixed(3);
    tags.style.transform = 'translateY(' + (tout * 40 - (1 - tin) * 20).toFixed(1) + 'px)';

    hud.textContent = Math.round((sum / n) * (0.85 + 0.15 * lt) * 100) + '%';
    if (bar) bar.style.transform = 'scaleX(' + p.toFixed(3) + ')';

    // Estado
    var st = p < 0.04 ? 0 : p < 0.68 ? 1 : p < 0.80 ? 2 : p < OUT[0] ? 3 : 4;
    if (labels[st] && labels[st] !== lastStatus) { statusEl.textContent = labels[st]; lastStatus = labels[st]; }

    // Paso activo
    var idx = -1;
    for (var s = 0; s < STEPS.length; s++) if (p >= STEPS[s][0] && p < STEPS[s][1]) idx = s;
    if (p < STEPS[0][0]) idx = 0;
    if (idx !== lastStep) {
      lastStep = idx;
      steps.forEach(function (el, j) {
        el.classList.toggle('is-active', j === idx);
        el.classList.toggle('is-done', idx === -1 ? p >= STEPS[0][0] : j < idx);
      });
      Object.keys(els).forEach(function (k) { if (els[k]) els[k].classList.remove('is-active'); });
      if (idx >= 0) STEP_PARTS[idx].forEach(function (k) { if (els[k]) els[k].classList.add('is-active'); });
    }
    sec.classList.toggle('is-final', p >= STEPS[STEPS.length - 1][1]);
  }

  var ticking = false;
  function update() {
    ticking = false;
    var rect = sec.getBoundingClientRect();
    var total = sec.offsetHeight - window.innerHeight;
    render(total > 0 ? clamp(-rect.top / total) : 1);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  sec.classList.add('is-live');
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); onScroll(); });
  update();
})();

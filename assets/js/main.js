/* ==========================================================================
   Muso Business — Script principal
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Configuración general (editar aquí) ---------- */
  var CONFIG = {
    whatsapp: '593992759073',            // +593 99 275 9073
    email: 'ventas@musobusiness.com',     // pendiente: confirmar al registrar el dominio
    lang: document.documentElement.lang || 'es'
  };
  window.MUSO_CONFIG = CONFIG;

  var TEXT = {
    es: {
      waDefault: 'Hola Muso Business, quisiera información sobre sus repuestos.',
      waAog: 'URGENTE AOG — Hola Muso Business, tengo una aeronave en tierra y necesito un repuesto. P/N: ',
      quoteTitle: 'Hola Muso Business, solicito una cotización:',
      subject: 'Solicitud de cotización',
      labels: { name: 'Nombre', company: 'Empresa', contact: 'Contacto', part: 'Pieza / P/N', qty: 'Cantidad', urgency: 'Urgencia', details: 'Detalle' },
      required: 'Este campo es obligatorio.',
      contactInvalid: 'Ingrese un correo o teléfono válido.',
      sentWa: 'Abrimos WhatsApp con su solicitud lista para enviar.',
      sentMail: 'Abrimos su correo con la solicitud lista para enviar.',
      fixErrors: 'Revise los campos marcados.'
    },
    en: {
      waDefault: 'Hello Muso Business, I would like information about your parts.',
      waAog: 'URGENT AOG — Hello Muso Business, I have an aircraft on ground and need a part. P/N: ',
      quoteTitle: 'Hello Muso Business, I would like a quote:',
      subject: 'Quote request',
      labels: { name: 'Name', company: 'Company', contact: 'Contact', part: 'Part / P/N', qty: 'Quantity', urgency: 'Urgency', details: 'Details' },
      required: 'This field is required.',
      contactInvalid: 'Enter a valid email or phone number.',
      sentWa: 'WhatsApp opened with your request ready to send.',
      sentMail: 'Your email app opened with the request ready to send.',
      fixErrors: 'Please check the highlighted fields.'
    }
  };
  var T = TEXT[CONFIG.lang] || TEXT.es;

  function waUrl(msg) {
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg);
  }

  /* ---------- Encabezado al hacer scroll ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (header) header.classList.toggle('is-solid', open);
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- Enlaces de WhatsApp con mensaje ---------- */
  document.querySelectorAll('[data-wa]').forEach(function (el) {
    var type = el.getAttribute('data-wa');
    var msg = type === 'aog' ? T.waAog : (el.getAttribute('data-wa-msg') || T.waDefault);
    el.setAttribute('href', waUrl(msg));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener');
  });

  /* ---------- Correo ---------- */
  document.querySelectorAll('[data-email]').forEach(function (el) {
    el.setAttribute('href', 'mailto:' + CONFIG.email);
    if (!el.textContent.trim()) el.textContent = CONFIG.email;
  });

  /* ---------- Animaciones de entrada ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Contadores ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function runCounter(el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    var start = parseInt(el.getAttribute('data-from') || '0', 10);
    var dur = 1400, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(start + (end - start) * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && !reduce) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runCounter(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---------- Esquema del hero: activar animación ---------- */
  var bp = document.querySelector('.blueprint');
  if (bp) requestAnimationFrame(function () { bp.classList.add('is-loaded'); });

  /* ---------- Formulario de cotización ---------- */
  var form = document.getElementById('quote-form');
  if (form) {
    var status = form.querySelector('.form-status');
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var phoneRe = /^[+()\d\s-]{7,}$/;

    function setError(name, msg) {
      var input = form.elements[name];
      if (!input) return;
      var field = input.closest('.field');
      var err = field && field.querySelector('.field-error');
      if (field) field.classList.toggle('has-error', !!msg);
      if (err) err.textContent = msg || '';
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    }

    function validate() {
      var ok = true;
      ['name', 'contact', 'part'].forEach(function (n) {
        var v = (form.elements[n].value || '').trim();
        if (!v) { setError(n, T.required); ok = false; } else { setError(n, ''); }
      });
      var c = (form.elements.contact.value || '').trim();
      if (c && !emailRe.test(c) && !phoneRe.test(c)) { setError('contact', T.contactInvalid); ok = false; }
      return ok;
    }

    function buildMessage() {
      var L = T.labels, f = form.elements, lines = [T.quoteTitle, ''];
      function add(label, val) { val = (val || '').trim(); if (val) lines.push('• ' + label + ': ' + val); }
      add(L.name, f.name.value);
      add(L.company, f.company.value);
      add(L.contact, f.contact.value);
      add(L.part, f.part.value);
      add(L.qty, f.qty.value);
      var urg = form.querySelector('input[name="urgency"]:checked');
      add(L.urgency, urg ? (CONFIG.lang === 'en' && urg.value === 'Normal' ? 'Standard' : urg.value) : '');
      add(L.details, f.details.value);
      return lines.join('\n');
    }

    form.addEventListener('input', function (e) {
      if (e.target.name && e.target.closest('.has-error')) setError(e.target.name, '');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var via = (e.submitter && e.submitter.value) || 'whatsapp';
      if (!validate()) {
        if (status) status.textContent = T.fixErrors;
        var first = form.querySelector('[aria-invalid="true"]');
        if (first) first.focus();
        return;
      }
      var msg = buildMessage();
      var urg = form.querySelector('input[name="urgency"]:checked');
      if (via === 'email') {
        var subject = T.subject + (urg && urg.value === 'AOG' ? ' — AOG' : '') + ' — ' + form.elements.part.value.trim();
        window.location.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(msg);
        if (status) status.textContent = T.sentMail;
      } else {
        window.open(waUrl(msg), '_blank', 'noopener');
        if (status) status.textContent = T.sentWa;
      }
    });
  }

  /* ---------- Año del pie de página ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();

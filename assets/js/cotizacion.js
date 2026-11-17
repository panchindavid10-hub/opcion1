/* ==========================================================================
   Muso Business — Lista de cotización
   Guarda los repuestos seleccionados en el navegador del visitante y arma
   un único mensaje para WhatsApp o correo (cotización o compra directa).
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.MUSO_CONFIG || { whatsapp: '593992759073', email: 'ventas@musobusiness.com', lang: 'es' };
  var KEY = 'muso_cotizacion_v1';

  var I18N = {
    es: {
      added: 'Agregado a su lista de cotización',
      qty: 'Cant.', pn: 'P/N', serie: 'Serie',
      remove: 'Quitar', less: 'Menos', more: 'Más',
      msgQuote: 'Hola Muso Business, solicito una cotización de los siguientes repuestos:',
      msgBuy: 'Hola Muso Business, deseo comprar los siguientes repuestos:',
      urgency: 'Urgencia', name: 'Nombre', company: 'Empresa', contact: 'Contacto', notes: 'Notas',
      subjectQuote: 'Solicitud de cotización', subjectBuy: 'Pedido de compra',
      needItems: 'Agregue al menos un repuesto a la lista.',
      needFields: 'Complete su nombre y un correo o teléfono.',
      sentWa: 'Abrimos WhatsApp con su lista lista para enviar.',
      sentMail: 'Abrimos su correo con la lista lista para enviar.',
      confirmClear: '¿Vaciar la lista de cotización?'
    },
    en: {
      added: 'Added to your quote list',
      qty: 'Qty', pn: 'P/N', serie: 'Serial',
      remove: 'Remove', less: 'Less', more: 'More',
      msgQuote: 'Hello Muso Business, I would like a quote for the following parts:',
      msgBuy: 'Hello Muso Business, I would like to buy the following parts:',
      urgency: 'Urgency', name: 'Name', company: 'Company', contact: 'Contact', notes: 'Notes',
      subjectQuote: 'Quote request', subjectBuy: 'Purchase order',
      needItems: 'Add at least one part to the list.',
      needFields: 'Please enter your name and an email or phone.',
      sentWa: 'WhatsApp opened with your list ready to send.',
      sentMail: 'Your email app opened with the list ready to send.',
      confirmClear: 'Clear the quote list?'
    }
  };
  var T = I18N[CFG.lang] || I18N.es;

  /* ---------- Estado ---------- */
  var items = load();
  function load() {
    try { var v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v : []; }
    catch (e) { return []; }
  }
  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* almacenamiento no disponible */ }
    render();
  }
  function clampQty(n) { n = parseInt(n, 10); return isNaN(n) || n < 1 ? 1 : Math.min(n, 9999); }

  function add(item, opts) {
    if (!item || !item.name) return;
    var id = item.id || ('manual:' + item.name.toLowerCase());
    var qty = clampQty(item.qty);
    var found = items.filter(function (i) { return i.id === id; })[0];
    if (found) { found.qty = clampQty(found.qty + qty); }
    else { items.push({ id: id, name: item.name, pn: item.pn || '', serie: item.serie || '', qty: qty }); }
    persist();
    if (!opts || !opts.silent) { toast(T.added); bump(); }
  }
  function setQty(id, qty) {
    items.forEach(function (i) { if (i.id === id) i.qty = clampQty(qty); });
    persist();
  }
  function remove(id) {
    items = items.filter(function (i) { return i.id !== id; });
    persist();
  }

  /* ---------- Elementos ---------- */
  var drawer = document.getElementById('quote-drawer');
  var backdrop = document.querySelector('.drawer-backdrop');
  var list = document.querySelector('[data-qlist]');
  var empty = document.querySelector('[data-qempty]');
  var form = document.getElementById('quote-list-form');
  var status = document.querySelector('[data-qstatus]');
  var toastEl = document.querySelector('[data-toast]');
  var lastFocus = null;

  function icon(id) {
    return '<svg aria-hidden="true"><use href="#' + id + '"/></svg>';
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Render ---------- */
  function render() {
    var total = items.reduce(function (s, i) { return s + 1; }, 0);
    document.querySelectorAll('[data-quote-count]').forEach(function (el) {
      el.textContent = total;
      el.classList.toggle('has-items', total > 0);
    });
    if (!list) return;
    list.innerHTML = items.map(function (it) {
      var meta = [];
      if (it.pn) meta.push(T.pn + ' ' + esc(it.pn));
      if (it.serie) meta.push(T.serie + ' ' + esc(it.serie));
      return '<li class="qitem" data-id="' + esc(it.id) + '">' +
        '<div><strong>' + esc(it.name) + '</strong>' + (meta.length ? '<small>' + meta.join(' · ') + '</small>' : '') + '</div>' +
        '<div class="qitem-actions">' +
          '<div class="qty">' +
            '<button type="button" data-qdec aria-label="' + T.less + '">' + icon('i-minus') + '</button>' +
            '<input type="number" min="1" value="' + it.qty + '" aria-label="' + T.qty + '" data-qqty>' +
            '<button type="button" data-qinc aria-label="' + T.more + '">' + icon('i-plus') + '</button>' +
          '</div>' +
          '<button type="button" class="qremove" data-qremove aria-label="' + T.remove + '">' + icon('i-trash') + '</button>' +
        '</div></li>';
    }).join('');
    if (empty) empty.hidden = items.length > 0;
  }

  /* ---------- Abrir / cerrar ---------- */
  function open() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    if (backdrop) backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    var first = drawer.querySelector('[data-quote-close]');
    setTimeout(function () { if (first) first.focus(); }, 50);
  }
  function close() {
    if (!drawer || !drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    if (backdrop) backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-quote-open]')) { e.preventDefault(); open(); return; }
    if (e.target.closest('[data-quote-close]')) { close(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
    // Mantener el foco dentro del cajón
    if (e.key === 'Tab' && drawer && drawer.classList.contains('is-open')) {
      var f = drawer.querySelectorAll('button, [href], input, textarea, select');
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Acciones en la lista ---------- */
  if (list) {
    list.addEventListener('click', function (e) {
      var row = e.target.closest('.qitem'); if (!row) return;
      var id = row.getAttribute('data-id');
      var it = items.filter(function (i) { return i.id === id; })[0]; if (!it) return;
      if (e.target.closest('[data-qinc]')) setQty(id, it.qty + 1);
      else if (e.target.closest('[data-qdec]')) setQty(id, it.qty - 1);
      else if (e.target.closest('[data-qremove]')) remove(id);
    });
    list.addEventListener('change', function (e) {
      if (!e.target.matches('[data-qqty]')) return;
      setQty(e.target.closest('.qitem').getAttribute('data-id'), e.target.value);
    });
  }

  /* Agregar pieza manual (por P/N o descripción) */
  var qaddInput = document.getElementById('qadd-pn');
  var qaddQty = document.getElementById('qadd-qty');
  function manualAdd() {
    var v = (qaddInput.value || '').trim();
    if (!v) { qaddInput.focus(); return; }
    add({ id: 'manual:' + v.toLowerCase(), name: v, qty: qaddQty ? qaddQty.value : 1 });
    qaddInput.value = ''; if (qaddQty) qaddQty.value = 1;
    qaddInput.focus();
  }
  var qaddBtn = document.querySelector('[data-qadd]');
  if (qaddBtn) qaddBtn.addEventListener('click', manualAdd);
  if (qaddInput) qaddInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); manualAdd(); }
  });

  var clearBtn = document.querySelector('[data-qclear]');
  if (clearBtn) clearBtn.addEventListener('click', function () {
    if (!items.length) return;
    if (window.confirm(T.confirmClear)) { items = []; persist(); }
  });

  /* ---------- Envío ---------- */
  function setStatus(msg, isError) {
    if (!status) return;
    status.textContent = msg;
    status.classList.toggle('is-error', !!isError);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var via = (e.submitter && e.submitter.value) || 'whatsapp';
      var f = form.elements;
      if (!items.length) { setStatus(T.needItems, true); if (qaddInput) qaddInput.focus(); return; }
      var name = (f.qname.value || '').trim();
      var contact = (f.qcontact.value || '').trim();
      if (!name || !contact) {
        setStatus(T.needFields, true);
        (name ? f.qcontact : f.qname).focus();
        return;
      }
      var type = (form.querySelector('input[name="qtype"]:checked') || {}).value || 'quote';
      var urg = (form.querySelector('input[name="qurg"]:checked') || {}).value || 'Normal';
      if (CFG.lang === 'en' && urg === 'Normal') urg = 'Standard';

      var lines = [type === 'buy' ? T.msgBuy : T.msgQuote, ''];
      items.forEach(function (it, i) {
        var l = (i + 1) + '. ' + it.name;
        if (it.pn) l += ' — ' + T.pn + ' ' + it.pn;
        if (it.serie) l += ' — ' + T.serie + ' ' + it.serie;
        l += ' × ' + it.qty;
        lines.push(l);
      });
      lines.push('');
      lines.push('• ' + T.urgency + ': ' + urg);
      lines.push('• ' + T.name + ': ' + name);
      if ((f.qcompany.value || '').trim()) lines.push('• ' + T.company + ': ' + f.qcompany.value.trim());
      lines.push('• ' + T.contact + ': ' + contact);
      if ((f.qnotes.value || '').trim()) lines.push('• ' + T.notes + ': ' + f.qnotes.value.trim());
      var msg = lines.join('\n');

      if (via === 'email') {
        var subject = (type === 'buy' ? T.subjectBuy : T.subjectQuote) + (urg === 'AOG' ? ' — AOG' : '');
        window.location.href = 'mailto:' + CFG.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(msg);
        setStatus(T.sentMail);
      } else {
        window.open('https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
        setStatus(T.sentWa);
      }
    });
  }

  /* ---------- Avisos ---------- */
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.innerHTML = icon('i-check') + '<span>' + esc(msg) + '</span>';
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-show'); }, 2200);
  }
  function bump() {
    document.querySelectorAll('.quote-btn').forEach(function (b) {
      b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
    });
  }

  // Sincronizar entre pestañas
  window.addEventListener('storage', function (e) { if (e.key === KEY) { items = load(); render(); } });

  window.MusoQuote = { add: add, open: open, close: close, items: function () { return items.slice(); } };
  render();
})();

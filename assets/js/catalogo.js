/* ==========================================================================
   Muso Business — Catálogo de productos
   Lee los productos de data/productos.js, permite filtrar por categoría,
   buscar por nombre / número de parte / serie y agregar a la cotización.
   ========================================================================== */
(function () {
  'use strict';

  var grid = document.getElementById('product-grid');
  if (!grid) return;

  var CFG = window.MUSO_CONFIG || { lang: 'es' };
  var EN = CFG.lang === 'en';
  var DATA = window.MUSO_PRODUCTOS || [];

  var CATS = [
    { id: 'todos', es: 'Todas', en: 'All', icon: 'i-list' },
    { id: 'fuselaje', es: 'Fuselaje y estructuras', en: 'Airframe & structures', es_s: 'Fuselaje', en_s: 'Airframe', icon: 'i-plane' },
    { id: 'motores', es: 'Motores', en: 'Engines', icon: 'i-engine' },
    { id: 'avionica', es: 'Aviónica', en: 'Avionics', icon: 'i-gauge' },
    { id: 'consumibles', es: 'Consumibles', en: 'Consumables', icon: 'i-drop' },
    { id: 'gse', es: 'Apoyo en tierra (GSE)', en: 'Ground support (GSE)', es_s: 'GSE', en_s: 'GSE', icon: 'i-stairs' },
    { id: 'senaletica', es: 'Señalética', en: 'Signage', icon: 'i-cone' }
  ];
  var CAT = {}; CATS.forEach(function (c) { CAT[c.id] = c; });

  var TX = EN ? {
    showing: function (n, t) { return 'Showing <strong>' + n + '</strong> of ' + t + ' parts'; },
    pn: 'P/N', serie: 'Serial', cert: 'Cert.', onQuote: 'Given in quote',
    stock: 'In stock', order: 'On order', add: 'Add', addLong: 'Add to quote', added: 'Added',
    less: 'Less', more: 'More', qty: 'Quantity',
    emptyTitle: 'No matches in the published catalog',
    emptyText: function (q) { return q ? 'We also source parts on request. Add “' + q + '” to your list and we will look for it.' : 'Try another category or remove the filters.'; },
    addManual: function (q) { return 'Add “' + q + '” to my quote'; },
    reset: 'Clear filters'
  } : {
    showing: function (n, t) { return 'Mostrando <strong>' + n + '</strong> de ' + t + ' repuestos'; },
    pn: 'P/N', serie: 'Serie', cert: 'Cert.', onQuote: 'Se indica al cotizar',
    stock: 'En stock', order: 'Bajo pedido', add: 'Agregar', addLong: 'Agregar a la cotización', added: 'Agregado',
    less: 'Menos', more: 'Más', qty: 'Cantidad',
    emptyTitle: 'Sin resultados en el catálogo publicado',
    emptyText: function (q) { return q ? 'También conseguimos repuestos bajo pedido. Agregue «' + q + '» a su lista y lo buscamos por usted.' : 'Pruebe otra categoría o quite los filtros.'; },
    addManual: function (q) { return 'Agregar «' + q + '» a mi cotización'; },
    reset: 'Quitar filtros'
  };

  var state = { cat: 'todos', q: '', stock: false };
  var filtersEl = document.getElementById('cat-filters');
  var searchEl = document.getElementById('cat-search');
  var stockEl = document.getElementById('cat-stock');
  var countEl = document.getElementById('cat-count');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[\s\-_/.]+/g, ' ').trim();
  }
  function icon(id) { return '<svg aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function label(p, key) { return (EN && p[key + '_en']) ? p[key + '_en'] : p[key]; }

  /* Índice de búsqueda */
  DATA.forEach(function (p) {
    p._search = norm([p.nombre, p.nombre_en, p.pn, p.serie, p.subcategoria, p.subcategoria_en, CAT[p.categoria] && CAT[p.categoria].es].join(' '));
    p._pn = norm(p.pn).replace(/ /g, '');
  });

  /* ---------- Filtros ---------- */
  function renderFilters() {
    if (!filtersEl) return;
    filtersEl.innerHTML = CATS.map(function (c) {
      var n = c.id === 'todos' ? DATA.length : DATA.filter(function (p) { return p.categoria === c.id; }).length;
      return '<button type="button" class="filter-btn" data-cat="' + c.id + '" aria-pressed="' + (state.cat === c.id) + '">' +
        '<span>' + (EN ? c.en : c.es) + '</span><span class="count">' + n + '</span></button>';
    }).join('');
  }

  function matches(p) {
    if (state.cat !== 'todos' && p.categoria !== state.cat) return false;
    if (state.stock && p.disponibilidad !== 'stock') return false;
    if (state.q) {
      var q = norm(state.q), qc = q.replace(/ /g, '');
      var words = q.split(' ');
      var all = words.every(function (w) { return p._search.indexOf(w) !== -1; });
      if (!all && p._pn.indexOf(qc) === -1) return false;
    }
    return true;
  }

  /* ---------- Tarjetas ---------- */
  function card(p, i) {
    var c = CAT[p.categoria] || CATS[0];
    var inStock = p.disponibilidad === 'stock';
    return '<article class="product" style="animation-delay:' + Math.min(i * 30, 300) + 'ms" data-id="' + esc(p.id) + '">' +
      '<div class="product-top">' +
        '<span class="product-cat">' + icon(c.icon) + esc(EN ? (c.en_s || c.en) : (c.es_s || c.es)) + '</span>' +
        '<span class="badges">' +
          (p.certificacion ? '<span class="badge badge--ok">' + esc(p.certificacion) + '</span>' : '') +
          '<span class="badge' + (inStock ? ' badge--ok' : '') + '">' + (inStock ? TX.stock : TX.order) + '</span>' +
        '</span>' +
      '</div>' +
      '<h3>' + esc(label(p, 'nombre')) + '</h3>' +
      (p.subcategoria ? '<p class="sub">' + esc(label(p, 'subcategoria')) + '</p>' : '') +
      '<dl class="spec">' +
        '<dt>' + TX.pn + '</dt><dd>' + esc(p.pn || '—') + '</dd>' +
        '<dt>' + TX.serie + '</dt><dd>' + esc(p.serie || TX.onQuote) + '</dd>' +
      '</dl>' +
      '<div class="product-actions">' +
        '<div class="qty">' +
          '<button type="button" data-dec aria-label="' + TX.less + '">' + icon('i-minus') + '</button>' +
          '<input type="number" min="1" value="1" aria-label="' + TX.qty + '" data-qty>' +
          '<button type="button" data-inc aria-label="' + TX.more + '">' + icon('i-plus') + '</button>' +
        '</div>' +
        '<button type="button" class="btn-add" data-add aria-label="' + TX.addLong + ': ' + esc(label(p, 'nombre')) + '">' + icon('i-plus') + '<span>' + TX.add + '</span></button>' +
      '</div>' +
    '</article>';
  }

  function render() {
    var list = DATA.filter(matches);
    if (countEl) countEl.innerHTML = TX.showing(list.length, DATA.length);
    if (!list.length) {
      var q = state.q.trim();
      grid.innerHTML = '<div class="empty-state">' +
        '<h3>' + TX.emptyTitle + '</h3><p>' + esc(TX.emptyText(q)) + '</p>' +
        (q ? '<button type="button" class="btn" data-add-manual>' + esc(TX.addManual(q)) + '</button>' : '') +
        '<button type="button" class="link-clear" data-reset>' + TX.reset + '</button>' +
      '</div>';
      return;
    }
    grid.innerHTML = list.map(card).join('');
  }

  function setCat(id, updateHash) {
    if (!CAT[id]) id = 'todos';
    state.cat = id;
    if (filtersEl) filtersEl.querySelectorAll('.filter-btn').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-cat') === id));
    });
    if (updateHash && history.replaceState) {
      history.replaceState(null, '', id === 'todos' ? location.pathname + location.search : '#' + id);
    }
    render();
  }

  /* ---------- Eventos ---------- */
  if (filtersEl) filtersEl.addEventListener('click', function (e) {
    var b = e.target.closest('.filter-btn'); if (b) setCat(b.getAttribute('data-cat'), true);
  });
  var t;
  if (searchEl) searchEl.addEventListener('input', function () {
    clearTimeout(t);
    t = setTimeout(function () { state.q = searchEl.value; render(); }, 120);
  });
  if (stockEl) stockEl.addEventListener('change', function () { state.stock = stockEl.checked; render(); });

  grid.addEventListener('click', function (e) {
    if (e.target.closest('[data-reset]')) {
      state.q = ''; state.stock = false;
      if (searchEl) searchEl.value = '';
      if (stockEl) stockEl.checked = false;
      setCat('todos', true); return;
    }
    if (e.target.closest('[data-add-manual]')) {
      var q = state.q.trim();
      if (window.MusoQuote && q) window.MusoQuote.add({ id: 'manual:' + q.toLowerCase(), name: q, qty: 1 });
      return;
    }
    var art = e.target.closest('.product'); if (!art) return;
    var input = art.querySelector('[data-qty]');
    var v = parseInt(input.value, 10) || 1;
    if (e.target.closest('[data-inc]')) { input.value = Math.min(v + 1, 9999); return; }
    if (e.target.closest('[data-dec]')) { input.value = Math.max(v - 1, 1); return; }
    var addBtn = e.target.closest('[data-add]');
    if (addBtn) {
      var p = DATA.filter(function (x) { return x.id === art.getAttribute('data-id'); })[0];
      if (!p || !window.MusoQuote) return;
      window.MusoQuote.add({ id: p.id, name: label(p, 'nombre'), pn: p.pn, serie: p.serie, qty: v });
      input.value = 1;
      addBtn.classList.add('is-added');
      addBtn.querySelector('span').textContent = TX.added;
      setTimeout(function () {
        addBtn.classList.remove('is-added');
        addBtn.querySelector('span').textContent = TX.add;
      }, 1600);
    }
  });

  /* Enlaces del tipo productos.html#avionica */
  function fromHash() {
    var h = (location.hash || '').replace('#', '');
    if (CAT[h]) {
      setCat(h, false);
      var cat = document.getElementById('catalogo');
      if (cat) cat.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  window.addEventListener('hashchange', fromHash);

  renderFilters();
  var h0 = (location.hash || '').replace('#', '');
  if (CAT[h0]) { state.cat = h0; renderFilters(); }
  render();
  if (CAT[h0]) setTimeout(fromHash, 60);
})();

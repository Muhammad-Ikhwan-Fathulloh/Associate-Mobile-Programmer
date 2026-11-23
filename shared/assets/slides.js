(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var nav = document.querySelector('.nav');
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');
  var counter = document.getElementById('counter');
  var bar = document.getElementById('progress');
  var idx = -1;
  var VIEWS = ['Isi', 'Gambar', 'Tata cara'];

  /* ---- Susun ulang struktur: kicker + judul menjadi kepala, sisanya panel ---- */
  slides.forEach(function (s, n) {
    var split = s.querySelector('.split');
    var main = s.querySelector('.main');
    if (!split || !main) return;
    var head = document.createElement('div');
    head.className = 'shead';
    var kicker = main.querySelector(':scope > .kicker');
    var title = main.querySelector(':scope > h1, :scope > h2');
    if (kicker) head.appendChild(kicker);
    if (title) head.appendChild(title);
    var panel = document.createElement('div');
    panel.className = 'panel';
    s.insertBefore(head, split);
    s.insertBefore(panel, split);
    panel.appendChild(split);
    if (n === 0 && title && title.tagName === 'H1') s.classList.add('hero');
    s.dataset.view = '0';
    s.dataset.hasExtra = s.querySelector('.extra .fig, .extra .steps') ? '1' : '0';
    if (s.dataset.hasExtra === '1' && !main.children.length) s.dataset.view = '1';
    // indeks animasi untuk elemen gambar
    var k = 0;
    s.querySelectorAll('.fig svg > *').forEach(function (el) {
      if (el.tagName === 'defs') return;
      el.style.setProperty('--i', k++);
    });
  });

  /* ---- Navigasi tambahan: titik, tombol tampilan, layar penuh ---- */
  var dots = document.createElement('div');
  dots.className = 'dots';
  if (slides.length <= 24) {
    slides.forEach(function (_, i) {
      var d = document.createElement('i');
      d.title = 'Slide ' + (i + 1);
      dots.appendChild(d);
    });
    nav.insertBefore(dots, document.getElementById('next'));
  }

  var viewBtn = document.createElement('button');
  viewBtn.id = 'viewBtn';
  viewBtn.className = 'viewbtn';
  viewBtn.title = 'Ganti tampilan (panah atas atau bawah)';
  nav.appendChild(viewBtn);

  var fsBtn = document.createElement('button');
  fsBtn.className = 'fsbtn';
  fsBtn.textContent = 'Layar penuh';
  fsBtn.title = 'Layar penuh (F)';
  nav.appendChild(fsBtn);

  function toggleFs() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  }
  fsBtn.addEventListener('click', toggleFs);

  /* ---- Byline pada slide pertama ---- */
  (function () {
    var head = slides[0] && slides[0].querySelector('.shead');
    if (!head || head.querySelector('.byline')) return;
    var p = document.createElement('p');
    p.className = 'byline';
    p.innerHTML = 'by <a href="https://one.nocturnailed.com/" target="_blank" rel="noopener">Muhammad Ikhwan Fathulloh</a>';
    head.appendChild(p);
  })();

  /* ---- Narasi pengajar: aside.notes pada slide, tombol N ---- */
  var notesBtn = document.createElement('button');
  notesBtn.className = 'notesbtn';
  notesBtn.textContent = 'Narasi (N)';
  notesBtn.title = 'Tampilkan narasi pengajar (N)';
  notesBtn.style.display = 'none';
  nav.appendChild(notesBtn);
  function toggleNotes() { document.body.classList.toggle('show-notes'); }
  notesBtn.addEventListener('click', toggleNotes);

  /* ---- Ukuran huruf otomatis agar isi muat satu layar ---- */
  function fit(slide) {
    var panel = slide.querySelector('.panel');
    if (!panel) return;
    slide.classList.add('measuring');
    panel.classList.remove('scroll');
    var f = 1;
    slide.style.setProperty('--fit', f);
    var guard = 0;
    while (guard++ < 24 && (panel.scrollHeight > panel.clientHeight + 1 || panel.scrollWidth > panel.clientWidth + 1) && f > 0.45) {
      f = Math.round((f - 0.04) * 100) / 100;
      slide.style.setProperty('--fit', f);
    }
    if (panel.scrollHeight > panel.clientHeight + 1) panel.classList.add('scroll');
    slide.classList.remove('measuring');
  }

  function setView(v) {
    var s = slides[idx];
    if (s.dataset.hasExtra !== '1') v = 0;
    v = Math.max(0, Math.min(2, v));
    s.dataset.view = String(v);
    viewBtn.textContent = 'Tampilan: ' + VIEWS[v];
    viewBtn.style.display = s.dataset.hasExtra === '1' ? '' : 'none';
    fit(s);
  }

  function show(i, back) {
    if (i < 0 || i >= slides.length) return;
    if (idx >= 0) slides[idx].classList.remove('active', 'back');
    idx = i;
    var s = slides[idx];
    if (back) s.classList.add('back');
    s.classList.add('active');
    counter.textContent = (idx + 1) + ' / ' + slides.length;
    prev.disabled = idx === 0;
    next.disabled = idx === slides.length - 1;
    bar.style.width = ((idx + 1) / slides.length * 100) + '%';
    Array.prototype.forEach.call(dots.children, function (d, k) { d.classList.toggle('on', k === idx); });
    history.replaceState(null, '', '#' + (idx + 1));
    setView(parseInt(s.dataset.view, 10) || 0);
    notesBtn.style.display = s.querySelector('aside.notes') ? '' : 'none';
    document.dispatchEvent(new CustomEvent('slidechange', { detail: { index: idx, slide: s } }));
  }

  viewBtn.addEventListener('click', function () {
    var s = slides[idx];
    setView((parseInt(s.dataset.view, 10) + 1) % 3);
  });
  prev.addEventListener('click', function () { show(idx - 1, true); });
  next.addEventListener('click', function () { show(idx + 1); });

  document.addEventListener('keydown', function (e) {
    var t = e.target;
    var tag = t && t.tagName;
    if (document.body.classList.contains('sim-open')) return;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key;
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') { e.preventDefault(); show(idx + 1); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); show(idx - 1, true); }
    else if (k === 'ArrowDown') { e.preventDefault(); setView(parseInt(slides[idx].dataset.view, 10) + 1); }
    else if (k === 'ArrowUp') { e.preventDefault(); setView(parseInt(slides[idx].dataset.view, 10) - 1); }
    else if (k === 'Home') { show(0, true); }
    else if (k === 'End') { show(slides.length - 1); }
    else if (k === 'f' || k === 'F') { toggleFs(); }
    else if (k === 'n' || k === 'N') { toggleNotes(); }
  });

  window.addEventListener('hashchange', function () {
    var n = parseInt(location.hash.slice(1), 10);
    if (!isNaN(n) && n - 1 !== idx) show(Math.min(Math.max(n - 1, 0), slides.length - 1), n - 1 < idx);
  });

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { if (idx >= 0) fit(slides[idx]); }, 120);
  });

  var start = parseInt(location.hash.slice(1), 10);
  if (isNaN(start)) start = 1;
  show(Math.min(Math.max(start - 1, 0), slides.length - 1));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fit(slides[idx]); });
})();

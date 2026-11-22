/* Simulasi interaktif untuk slide. Berjalan offline di peramban.
   Slide yang punya simulasi ditandai dengan atribut data-sim pada elemen <section>. */
(function () {
  'use strict';

  function h(tag, props) {
    var e = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (k === 'class') e.className = v;
        else if (k === 'style') e.style.cssText = v;
        else if (k === 'value') e.value = v;
        else if (k === 'checked') e.checked = v;
        else if (k === 'disabled') e.disabled = v;
        else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), v);
        else e.setAttribute(k, v);
      });
    }
    for (var i = 2; i < arguments.length; i++) add(e, arguments[i]);
    return e;
  }

  function add(e, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(e, x); }); return; }
    e.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
  }

  function btn(label, fn, cls) {
    return h('button', { type: 'button', class: 'sbtn ' + (cls || ''), onclick: fn }, label);
  }

  function phone(title, body, width) {
    return h('div', { class: 'ph', style: width ? 'width:' + width + 'px' : '' },
      h('div', { class: 'ph-bar' }, title), h('div', { class: 'ph-body' }, body));
  }

  function logBox(max) {
    var ul = h('ul', { class: 'log' });
    return {
      el: ul,
      add: function (t, cls) {
        ul.insertBefore(h('li', { class: cls || '' }, t), ul.firstChild);
        while (ul.children.length > (max || 8)) ul.removeChild(ul.lastChild);
      },
      clear: function () { ul.innerHTML = ''; }
    };
  }

  var SIMS = {};

  /* ---------- Modul 1 ---------- */
  SIMS.counter = {
    title: 'StatefulWidget: counter',
    desc: 'Tekan + untuk memanggil setState. Hot reload membangun ulang tampilan tanpa menghapus state. Hot restart membuat state dari awal.',
    build: function (r) {
      var count = 0, builds = 0, inits = 0;
      var num = h('div', { class: 'big' }), info = h('div', { class: 'muted' });
      var lg = logBox(9);
      function build() { builds++; num.textContent = count; info.textContent = 'build() dipanggil ' + builds + 'x'; }
      function init() { inits++; lg.add('initState() ke-' + inits); build(); lg.add('build()'); }
      init();
      r.appendChild(h('div', { class: 'row' },
        phone('Counter', [num, info, h('div', { class: 'rowbtn' },
          btn('+', function () { count++; lg.add('setState() lalu build()'); build(); }),
          btn('Hot reload', function () { lg.add('Hot reload: build() ulang, state tetap'); build(); }),
          btn('Hot restart', function () { count = 0; builds = 0; lg.add('Hot restart: state dibuat ulang', 'warn'); init(); }, 'alt'))]),
        h('div', { class: 'col' }, h('strong', null, 'Log'), lg.el)));
    }
  };

  SIMS.lifecycle = {
    title: 'Siklus hidup State',
    desc: 'Ikuti urutan method saat widget dibuat, diperbarui, dan dihapus.',
    build: function (r) {
      var names = ['initState', 'didChangeDependencies', 'build', 'dispose'];
      var notes = ['sekali saat dibuat', 'setelah initState dan saat dependensi berubah', 'tiap kali tampilan perlu diperbarui', 'saat widget dihapus'];
      var counts = { initState: 0, didChangeDependencies: 0, build: 0, dispose: 0 };
      var active = false;
      var cells = {};
      var status = h('div', { class: 'badge' }, 'Belum dibuat');
      var tbl = h('table', { class: 'simtable' }, h('tr', null, h('th', null, 'Method'), h('th', null, 'Dipanggil'), h('th', null, 'Kapan')));
      names.forEach(function (n, i) {
        cells[n] = h('td', null, '0');
        tbl.appendChild(h('tr', null, h('td', null, h('code', null, n + '()')), cells[n], h('td', null, notes[i])));
      });
      var bs = {};
      function call(n) {
        counts[n]++; cells[n].textContent = counts[n];
        cells[n].classList.remove('flash'); void cells[n].offsetWidth; cells[n].classList.add('flash');
      }
      function refresh() {
        status.textContent = active ? 'Widget aktif' : 'Belum dibuat atau sudah dihapus';
        status.className = 'badge ' + (active ? 'ok' : '');
        bs.set.disabled = bs.dep.disabled = bs.close.disabled = !active;
        bs.create.disabled = active;
      }
      bs.create = btn('Tampilkan layar', function () { active = true; call('initState'); call('didChangeDependencies'); call('build'); refresh(); });
      bs.set = btn('setState()', function () { call('build'); });
      bs.dep = btn('Dependensi berubah', function () { call('didChangeDependencies'); call('build'); });
      bs.close = btn('Tutup layar', function () { active = false; call('dispose'); refresh(); }, 'alt');
      r.appendChild(h('div', { class: 'col' }, status, h('div', { class: 'rowbtn' }, bs.create, bs.set, bs.dep, bs.close), tbl));
      refresh();
    }
  };

  /* ---------- Modul 2 ---------- */
  function hex2rgb(x) { return [1, 3, 5].map(function (i) { return parseInt(x.substr(i, 2), 16); }); }
  function rgb2hex(c) { return '#' + c.map(function (v) { return ('0' + Math.round(v).toString(16)).slice(-2); }).join(''); }
  function mix(a, b, t) { var A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(A.map(function (v, i) { return v + (B[i] - v) * t; })); }
  function lum(x) { var c = hex2rgb(x); return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255; }

  SIMS.theme = {
    title: 'Tema Material 3 dengan colorSchemeSeed',
    desc: 'Pilih warna seed. Palet di bawah hanya perkiraan; palet asli dihitung otomatis oleh Material 3.',
    build: function (r) {
      var seed = '#3f51b5', dark = false;
      var box = h('div');
      var code = h('code', null);
      function draw() {
        var bg = dark ? '#1c1b1f' : '#fffbfe', fg = dark ? '#e6e1e5' : '#1c1b1f';
        var primary = dark ? mix(seed, '#ffffff', 0.35) : seed;
        var cont = dark ? mix(seed, '#000000', 0.6) : mix(seed, '#ffffff', 0.82);
        var onP = lum(primary) > 0.55 ? '#000' : '#fff';
        code.textContent = "ThemeData(colorSchemeSeed: Color(0xFF" + seed.slice(1).toUpperCase() + "), useMaterial3: true)";
        box.innerHTML = '';
        box.appendChild(h('div', { class: 'ph', style: 'background:' + bg + ';color:' + fg },
          h('div', { class: 'ph-bar', style: 'background:' + primary + ';color:' + onP }, 'Beranda'),
          h('div', { class: 'ph-body' },
            h('div', { class: 'mcard', style: 'background:' + cont + ';color:' + fg }, 'Catatan Lokal', h('br'), h('small', null, 'Card memakai warna container')),
            h('button', { type: 'button', class: 'mbtn', style: 'background:' + primary + ';color:' + onP }, 'Simpan'),
            h('div', { style: 'color:' + primary + ';font-weight:600;margin-top:8px' }, 'TextButton'))));
      }
      var presets = [['Indigo', '#3f51b5'], ['Teal', '#009688'], ['Oranye', '#ef6c00'], ['Merah muda', '#d81b60'], ['Hijau', '#2e7d32']];
      var picker = h('input', { type: 'color', value: seed, oninput: function (e) { seed = e.target.value; draw(); } });
      r.appendChild(h('div', { class: 'row' },
        box,
        h('div', { class: 'col' },
          h('strong', null, 'Warna seed'),
          h('div', { class: 'rowbtn' }, presets.map(function (p) {
            return btn(p[0], function () { seed = p[1]; picker.value = seed; draw(); });
          })),
          h('label', null, 'Warna bebas: ', picker),
          h('label', null, h('input', { type: 'checkbox', onchange: function (e) { dark = e.target.checked; draw(); } }), ' Mode gelap'),
          h('pre', { class: 'plain' }, code))));
      draw();
    }
  };

  SIMS.form = {
    title: 'Validasi form',
    desc: 'Judul minimal 3 karakter dan isi wajib diisi. Tekan Simpan untuk menjalankan validator.',
    build: function (r) {
      var submitted = false;
      var judul = h('input', { type: 'text', placeholder: 'Judul', oninput: check });
      var isi = h('textarea', { rows: 3, placeholder: 'Isi catatan', oninput: check });
      var e1 = h('div', { class: 'err' }), e2 = h('div', { class: 'err' });
      var snack = h('div', { class: 'snack' });
      function vJudul(v) { v = v.trim(); if (!v) return 'Judul wajib diisi'; if (v.length < 3) return 'Judul minimal 3 karakter'; return null; }
      function vIsi(v) { return v.trim() ? null : 'Isi wajib diisi'; }
      function check() {
        if (!submitted) return;
        e1.textContent = vJudul(judul.value) || ''; e2.textContent = vIsi(isi.value) || '';
      }
      function save() {
        submitted = true; check();
        var ok = !vJudul(judul.value) && !vIsi(isi.value);
        snack.textContent = ok ? 'Catatan disimpan' : '';
        snack.className = 'snack' + (ok ? ' show' : '');
      }
      r.appendChild(h('div', { class: 'row' },
        phone('Catatan Baru', [judul, e1, isi, e2, h('div', { class: 'rowbtn' }, btn('Simpan', save)), snack]),
        h('div', { class: 'col' }, h('pre', { class: 'plain' }, h('code', null,
          "validator: (v) {\n  final t = (v ?? '').trim();\n  if (t.isEmpty) return 'Judul wajib diisi';\n  if (t.length < 3) return 'Judul minimal 3 karakter';\n  return null;\n}")))));
    }
  };

  SIMS.responsive = {
    title: 'Layout responsif',
    desc: 'Geser lebar layar. Di bawah 600 dp tampilan satu kolom, selebihnya grid.',
    build: function (r) {
      var out = h('div', { class: 'frame' });
      var lbl = h('strong', null);
      function draw(w) {
        var cols = w < 600 ? 1 : 2;
        lbl.textContent = 'Lebar ' + w + ' dp, ' + cols + ' kolom (' + (cols === 1 ? 'ListView' : 'GridView') + ')';
        out.style.width = w + 'px';
        out.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
      }
      for (var i = 1; i <= 6; i++) out.appendChild(h('div', { class: 'mcard' }, 'Catatan ' + i));
      var rng = h('input', { type: 'range', min: 280, max: 720, step: 10, value: 360, oninput: function (e) { draw(+e.target.value); } });
      r.appendChild(h('div', { class: 'col' }, lbl, rng, h('div', { class: 'scroll' }, out)));
      draw(360);
    }
  };

  SIMS.nav = {
    title: 'Navigasi go_router',
    desc: 'Dorong dan tutup layar. Layar form mengembalikan hasil ke layar sebelumnya lewat pop.',
    build: function (r) {
      var stack = ['/'];
      var notes = [];
      var stackEl = h('div', { class: 'stackview' });
      var act = h('div', { class: 'rowbtn' });
      var lg = logBox(6);
      var body = h('div');
      function top() { return stack[stack.length - 1]; }
      function push(p) { stack.push(p); lg.add("context.push('" + p + "')"); draw(); }
      function pop(res) {
        var from = stack.pop();
        if (res) { notes.push(res); lg.add("context.pop(Note('" + res + "'))"); } else lg.add('context.pop() dari ' + from);
        draw();
      }
      var title = { '/': 'Beranda', '/catatan': 'Catatan', '/catatan/baru': 'Catatan Baru', '/lokasi': 'Lokasi dan Peta' };
      var input = h('input', { type: 'text', placeholder: 'Judul catatan', value: 'Rapat tim' });
      function draw() {
        stackEl.innerHTML = '';
        stack.slice().reverse().forEach(function (p, i) { stackEl.appendChild(h('div', { class: 'item' + (i === 0 ? ' top' : '') }, p)); });
        act.innerHTML = ''; body.innerHTML = '';
        var t = top();
        if (t === '/') { act.append(btn("push('/catatan')", function () { push('/catatan'); }), btn("push('/lokasi')", function () { push('/lokasi'); })); body.append(h('div', { class: 'muted' }, 'Menu: Catatan Lokal, Lokasi dan Peta')); }
        if (t === '/catatan') { act.append(btn("push('/catatan/baru')", function () { push('/catatan/baru'); })); body.append(notes.length ? h('ul', null, notes.map(function (n) { return h('li', null, n); })) : h('div', { class: 'muted' }, 'Belum ada catatan')); }
        if (t === '/catatan/baru') { body.append(input); act.append(btn('Simpan: pop(Note)', function () { pop(input.value.trim() || 'Tanpa judul'); })); }
        if (t === '/lokasi') body.append(h('div', { class: 'muted' }, 'Peta OpenStreetMap'));
        if (stack.length > 1) act.append(btn('pop()', function () { pop(); }, 'alt'));
        ttl.textContent = title[t];
      }
      var ttl = h('div', { class: 'ph-bar' });
      r.appendChild(h('div', { class: 'row' },
        h('div', { class: 'ph' }, ttl, h('div', { class: 'ph-body' }, body, act)),
        h('div', { class: 'col' }, h('strong', null, 'Navigation stack'), stackEl, h('strong', null, 'Log'), lg.el)));
      draw();
    }
  };

  /* ---------- Modul 3 ---------- */
  SIMS.crud = {
    title: 'CRUD SQLite pada tabel notes',
    desc: 'Tambah, ubah, dan hapus baris. SQL yang dijalankan repository ditampilkan di bawah.',
    build: function (r) {
      var rows = [], nextId = 1, clock = 1764000000;
      var sel = null;
      var input = h('input', { type: 'text', placeholder: 'title', value: 'Rapat tim' });
      var sql = h('pre', { class: 'plain' }, h('code', null, '-- belum ada query'));
      var tbody = h('tbody');
      function say(s) { sql.firstChild.textContent = s; }
      function draw() {
        tbody.innerHTML = '';
        rows.slice().sort(function (a, b) { return b.updated_at - a.updated_at || b.id - a.id; }).forEach(function (x) {
          tbody.appendChild(h('tr', { class: sel === x.id ? 'sel' : '', onclick: function () { sel = x.id; input.value = x.title; draw(); } },
            h('td', null, x.id), h('td', null, x.title), h('td', null, x.updated_at), h('td', null, x.sync_status)));
        });
        if (!rows.length) tbody.appendChild(h('tr', null, h('td', { colspan: 4, class: 'muted' }, 'Tabel kosong')));
      }
      function title() { return input.value.trim(); }
      r.appendChild(h('div', { class: 'col' },
        h('div', { class: 'rowbtn' }, input,
          btn('Tambah', function () {
            if (!title()) return;
            rows.push({ id: nextId, title: title(), updated_at: clock += 60, sync_status: 'PENDING' });
            say("INSERT INTO notes (title, content, updated_at, sync_status)\nVALUES (?, ?, ?, 'PENDING')   -- ['" + title() + "', ..., " + clock + "]\n-- id otomatis: " + nextId);
            nextId++; draw();
          }),
          btn('Ubah', function () {
            var x = rows.filter(function (y) { return y.id === sel; })[0];
            if (!x || !title()) return;
            x.title = title(); x.updated_at = clock += 60;
            say('UPDATE notes SET title = ?, updated_at = ?\nWHERE id = ?   -- [\'' + x.title + "', " + x.updated_at + ', ' + x.id + ']'); draw();
          }, 'alt'),
          btn('Hapus', function () {
            if (sel == null) return;
            rows = rows.filter(function (y) { return y.id !== sel; });
            say('DELETE FROM notes WHERE id = ?   -- [' + sel + ']'); sel = null; draw();
          }, 'alt')),
        h('div', { class: 'muted' }, 'Klik baris untuk memilihnya sebelum Ubah atau Hapus. Urutan: updated_at terbaru di atas.'),
        h('table', { class: 'simtable' }, h('thead', null, h('tr', null, ['id', 'title', 'updated_at', 'sync_status'].map(function (c) { return h('th', null, c); }))), tbody),
        sql));
      draw();
    }
  };

  SIMS.offline = {
    title: 'Offline-first dan sinkronisasi',
    desc: 'Data selalu disimpan lokal lebih dulu dengan status PENDING. Saat online, data dikirim lalu ditandai SYNCED.',
    build: function (r) {
      var online = false, id = 1, items = [];
      var list = h('div', { class: 'col' });
      var state = h('div', { class: 'badge' });
      var lg = logBox(6);
      var input = h('input', { type: 'text', value: 'Catatan lapangan' });
      function draw() {
        state.textContent = online ? 'Online' : 'Offline';
        state.className = 'badge ' + (online ? 'ok' : 'bad');
        list.innerHTML = '';
        if (!items.length) list.appendChild(h('div', { class: 'muted' }, 'Belum ada catatan'));
        items.forEach(function (x) { list.appendChild(h('div', { class: 'item2' }, x.t, h('span', { class: 'badge ' + (x.s === 'SYNCED' ? 'ok' : 'warn') }, x.s))); });
      }
      function sync() {
        if (!online) return;
        items.filter(function (x) { return x.s === 'PENDING'; }).forEach(function (x) {
          x.s = 'SENDING'; draw();
          setTimeout(function () { x.s = 'SYNCED'; lg.add('Server menerima "' + x.t + '"'); draw(); }, 700);
        });
      }
      r.appendChild(h('div', { class: 'col' },
        h('div', { class: 'rowbtn' }, state, btn('Ganti jaringan', function () { online = !online; lg.add(online ? 'Jaringan tersedia' : 'Jaringan terputus'); draw(); sync(); }, 'alt')),
        h('div', { class: 'rowbtn' }, input, btn('Simpan catatan', function () {
          items.push({ t: input.value.trim() || 'Tanpa judul', s: 'PENDING' }); lg.add('Disimpan ke SQLite (PENDING)'); draw(); sync();
        })),
        list, h('strong', null, 'Log'), lg.el));
      draw();
    }
  };

  /* ---------- Modul 4 ---------- */
  function jarakMeter(a, b, c, d) {
    var R = 6371000, rad = function (x) { return x * Math.PI / 180; };
    var dLat = rad(c - a), dLon = rad(d - b);
    var s = Math.pow(Math.sin(dLat / 2), 2) + Math.cos(rad(a)) * Math.cos(rad(c)) * Math.pow(Math.sin(dLon / 2), 2);
    return 2 * R * Math.asin(Math.sqrt(s));
  }

  SIMS.haversine = {
    title: 'Jarak dengan rumus Haversine',
    desc: 'Ubah koordinat A dan B atau pilih kota. Hasil memakai rumus yang sama dengan jarakMeter() di app/.',
    build: function (r) {
      var places = { Bandung: [-6.9175, 107.6191], Jakarta: [-6.2088, 106.8456], Surabaya: [-7.2575, 112.7521], Yogyakarta: [-7.7956, 110.3695] };
      var f = {};
      ['a1', 'a2', 'b1', 'b2'].forEach(function (k) { f[k] = h('input', { type: 'number', step: 'any', oninput: calc }); });
      var out = h('div', { class: 'big' }), sub = h('div', { class: 'muted' });
      function set(which, name) { var p = places[name]; f[which + '1'].value = p[0]; f[which + '2'].value = p[1]; calc(); }
      function sel(which, def) {
        var s = h('select', { onchange: function (e) { set(which, e.target.value); } }, Object.keys(places).map(function (n) { return h('option', { value: n }, n); }));
        s.value = def; return s;
      }
      function calc() {
        var v = ['a1', 'a2', 'b1', 'b2'].map(function (k) { return parseFloat(f[k].value); });
        if (v.some(isNaN)) { out.textContent = '-'; sub.textContent = 'Isi semua koordinat.'; return; }
        var m = jarakMeter(v[0], v[1], v[2], v[3]);
        out.textContent = (m / 1000).toFixed(1) + ' km';
        sub.textContent = Math.round(m).toLocaleString('id-ID') + ' meter (garis lurus di permukaan bumi)';
      }
      var sa = sel('a', 'Bandung'), sb = sel('b', 'Jakarta');
      r.appendChild(h('div', { class: 'col' },
        h('div', { class: 'row' }, h('div', { class: 'col' }, h('strong', null, 'Titik A'), sa, h('label', null, 'lat ', f.a1), h('label', null, 'lon ', f.a2)),
          h('div', { class: 'col' }, h('strong', null, 'Titik B'), sb, h('label', null, 'lat ', f.b1), h('label', null, 'lon ', f.b2))),
        out, sub));
      set('a', 'Bandung'); set('b', 'Jakarta');
    }
  };

  SIMS.permission = {
    title: 'Alur izin lokasi',
    desc: 'Atur kondisi perangkat lalu tekan Ambil posisi. Ikuti keputusan yang diambil LocationService.',
    build: function (r) {
      var service = true, perm = 'denied';
      var lg = logBox(10);
      var dlg = h('div', { class: 'dialog' });
      var sSel = h('select', { onchange: function (e) { perm = e.target.value; } },
        [['denied', 'denied (belum diberi)'], ['whileInUse', 'whileInUse (sudah diizinkan)'], ['deniedForever', 'deniedForever']].map(function (o) { return h('option', { value: o[0] }, o[1]); }));
      function done(ok, msg) { lg.add(msg, ok ? 'ok' : 'bad'); }
      function run() {
        lg.clear(); dlg.innerHTML = '';
        lg.add('isLocationServiceEnabled() = ' + service);
        if (!service) { done(false, 'LocationException: layanan lokasi nonaktif'); return; }
        lg.add('checkPermission() = ' + perm);
        if (perm === 'denied') {
          lg.add('requestPermission() menampilkan dialog sistem');
          dlg.appendChild(h('div', { class: 'dbox' }, 'Izinkan aplikasi mengakses lokasi?',
            h('div', { class: 'rowbtn' },
              btn('Izinkan', function () { perm = 'whileInUse'; sSel.value = perm; dlg.innerHTML = ''; finish(); }),
              btn('Tolak', function () { dlg.innerHTML = ''; done(false, 'LocationException: izin ditolak'); }, 'alt'),
              btn('Tolak permanen', function () { perm = 'deniedForever'; sSel.value = perm; dlg.innerHTML = ''; done(false, 'LocationException: izin ditolak permanen, buka pengaturan aplikasi'); }, 'alt'))));
          return;
        }
        finish();
      }
      function finish() {
        if (perm === 'deniedForever') { done(false, 'LocationException: izin ditolak permanen, buka pengaturan aplikasi'); return; }
        done(true, 'getCurrentPosition() = (-6.9218, 107.6071)');
      }
      r.appendChild(h('div', { class: 'col' },
        h('label', null, h('input', { type: 'checkbox', checked: true, onchange: function (e) { service = e.target.checked; } }), ' Layanan lokasi aktif'),
        h('label', null, 'Izin saat ini: ', sSel),
        h('div', { class: 'rowbtn' }, btn('Ambil posisi', run)),
        dlg, lg.el));
    }
  };

  /* ---------- Modul 5 ---------- */
  function labelJaringan(h2) {
    if (!h2.length || h2.indexOf('none') !== -1) return 'Tidak ada koneksi';
    if (h2.indexOf('wifi') !== -1) return 'Wi-Fi';
    if (h2.indexOf('mobile') !== -1) return 'Seluler';
    if (h2.indexOf('ethernet') !== -1) return 'Ethernet';
    if (h2.indexOf('vpn') !== -1) return 'VPN';
    return 'Lainnya';
  }

  SIMS.network = {
    title: 'Deteksi jenis jaringan',
    desc: 'Pilih kondisi koneksi perangkat. Label dan pesan dihitung dengan labelJaringan() dari app/.',
    build: function (r) {
      var opts = [['Wi-Fi saja', ['wifi']], ['Seluler saja', ['mobile']], ['Wi-Fi dan seluler', ['mobile', 'wifi']], ['Ethernet', ['ethernet']], ['VPN', ['vpn']], ['Mode pesawat', ['none']]];
      var out = h('div');
      function draw(v) {
        var lb = labelJaringan(v);
        out.innerHTML = '';
        out.appendChild(h('div', { class: 'mcard' }, 'Jenis koneksi: ', h('strong', null, lb)));
        out.appendChild(h('code', null, 'onConnectivityChanged: [' + v.map(function (x) { return 'ConnectivityResult.' + x; }).join(', ') + ']'));
        if (lb === 'Tidak ada koneksi') out.appendChild(h('div', { class: 'mcard warn' }, 'Tidak ada koneksi. Aplikasi tetap menampilkan data yang tersimpan.'));
        if (lb === 'Seluler') out.appendChild(h('div', { class: 'mcard warn' }, 'Jaringan seluler: tunda unduhan besar sampai Wi-Fi tersedia.'));
      }
      r.appendChild(h('div', { class: 'col' },
        h('div', { class: 'rowbtn' }, opts.map(function (o) { return btn(o[0], function () { draw(o[1]); }); })),
        out));
      draw(['wifi']);
    }
  };

  SIMS.handover = {
    title: 'Handover antar-menara',
    desc: 'Geser posisi perangkat. Perangkat pindah menara hanya jika sinyal menara lain jelas lebih kuat (ada margin), sehingga tidak bolak-balik.',
    build: function (r) {
      var serving = 'A';
      var A = 15, B = 85;
      var lg = logBox(5);
      var track = h('div', { class: 'track' });
      var tA = h('div', { class: 'tower', style: 'left:' + A + '%' }, 'A'), tB = h('div', { class: 'tower', style: 'left:' + B + '%' }, 'B');
      var dot = h('div', { class: 'dot' });
      track.append(tA, tB, dot);
      var barA = h('div', { class: 'bar' }), barB = h('div', { class: 'bar' });
      var status = h('div', { class: 'badge ok' });
      function sig(t, p) { return Math.max(0, 1 - Math.abs(p - t) / 60); }
      function update(p) {
        var sa = sig(A, p), sb = sig(B, p);
        if (serving === 'A' && sb > sa + 0.08) { serving = 'B'; lg.add('Handover: menara A ke B (sesi tetap)', 'ok'); }
        else if (serving === 'B' && sa > sb + 0.08) { serving = 'A'; lg.add('Handover: menara B ke A (sesi tetap)', 'ok'); }
        dot.style.left = p + '%';
        barA.style.width = Math.round(sa * 100) + '%'; barB.style.width = Math.round(sb * 100) + '%';
        barA.textContent = 'A ' + Math.round(sa * 100) + '%'; barB.textContent = 'B ' + Math.round(sb * 100) + '%';
        tA.classList.toggle('on', serving === 'A'); tB.classList.toggle('on', serving === 'B');
        var none = sa < 0.05 && sb < 0.05;
        status.textContent = none ? 'Tidak ada sinyal' : 'Terhubung ke menara ' + serving;
        status.className = 'badge ' + (none ? 'bad' : 'ok');
      }
      var rng = h('input', { type: 'range', min: 0, max: 100, value: 10, oninput: function (e) { update(+e.target.value); } });
      r.appendChild(h('div', { class: 'col' }, track, rng, status, barA, barB, lg.el));
      update(10);
    }
  };

  /* ---------- Modul 6 ---------- */
  SIMS.accel = {
    title: 'Accelerometer',
    desc: 'Atur nilai sumbu X, Y, Z (m/s²). Saat diam di meja, besar percepatan sekitar 9,8 karena gravitasi.',
    build: function (r) {
      var v = { x: 0, y: 0, z: 9.8 }, timer = null;
      var inputs = {}, labels = {};
      var mag = h('div', { class: 'big' }), bar = h('div', { class: 'meter' }, h('div', { class: 'fill' })), state = h('div', { class: 'badge' });
      function draw() {
        ['x', 'y', 'z'].forEach(function (k) { inputs[k].value = v[k]; labels[k].textContent = v[k].toFixed(2); });
        var m = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        mag.textContent = m.toFixed(2) + ' m/s²';
        bar.firstChild.style.width = Math.min(100, m / 20 * 100) + '%';
        var moving = m > 12;
        state.textContent = moving ? 'Perangkat bergerak' : 'Perangkat diam';
        state.className = 'badge ' + (moving ? 'warn' : 'ok');
      }
      ['x', 'y', 'z'].forEach(function (k) {
        labels[k] = h('span', { class: 'val' });
        inputs[k] = h('input', { type: 'range', min: -20, max: 20, step: 0.1, oninput: function (e) { v[k] = +e.target.value; draw(); } });
      });
      function shake() {
        var n = 0; clearInterval(timer);
        timer = setInterval(function () {
          v.x = (Math.random() - 0.5) * 36; v.y = (Math.random() - 0.5) * 36; v.z = (Math.random() - 0.5) * 36 + 9.8; draw();
          if (++n > 14) { clearInterval(timer); v = { x: 0, y: 0, z: 9.8 }; draw(); }
        }, 70);
      }
      r.appendChild(h('div', { class: 'col' },
        ['x', 'y', 'z'].map(function (k) { return h('label', null, 'Sumbu ' + k.toUpperCase() + ' ', inputs[k], labels[k]); }),
        h('div', { class: 'rowbtn' }, btn('Diam di meja', function () { clearInterval(timer); v = { x: 0, y: 0, z: 9.8 }; draw(); }), btn('Goyang', shake, 'alt')),
        mag, bar, state));
      draw();
    }
  };

  /* ---------- Modul 7 ---------- */
  function hexNoise(n) { var s = ''; for (var i = 0; i < n; i++) s += ('0' + Math.floor(Math.random() * 256).toString(16)).slice(-2); return s; }

  SIMS.tls = {
    title: 'Jabat tangan TLS dan penyadapan',
    desc: 'Bandingkan apa yang terlihat oleh penyadap di Wi-Fi publik pada HTTP dan HTTPS. Data acak di bawah hanya ilustrasi, bukan hasil enkripsi sebenarnya.',
    build: function (r) {
      var steps = [
        ['Aplikasi → Server', 'ClientHello: versi TLS dan daftar cipher'],
        ['Server → Aplikasi', 'ServerHello + sertifikat server'],
        ['Aplikasi', 'Memverifikasi sertifikat, lalu menyepakati kunci sesi'],
        ['Aplikasi → Server', 'Data aplikasi terenkripsi dengan kunci sesi']
      ];
      var step = 0, https = true;
      var log = h('ol', { class: 'log2' }), spy = h('pre', { class: 'plain spy' }, h('code', null));
      var nextBtn;
      function draw() {
        log.innerHTML = '';
        if (https) steps.slice(0, step).forEach(function (s) { log.appendChild(h('li', null, h('strong', null, s[0] + ': '), s[1])); });
        else log.appendChild(h('li', null, h('strong', null, 'Aplikasi → Server: '), 'Langsung kirim data tanpa enkripsi'));
        var c = spy.firstChild;
        if (!https) c.textContent = 'POST /login HTTP/1.1\nemail=ani@contoh.test&sandi=rahasia123';
        else if (step < 4) c.textContent = step === 0 ? '(belum ada lalu lintas)' : 'Terlihat: ClientHello dan sertifikat publik server.\nIsi data belum dikirim.';
        else c.textContent = '17 03 03 00 5a ' + hexNoise(30).replace(/(..)/g, '$1 ');
        nextBtn.disabled = https && step >= 4;
      }
      nextBtn = btn('Langkah berikut', function () { step++; draw(); });
      r.appendChild(h('div', { class: 'col' },
        h('div', { class: 'rowbtn' },
          btn('HTTPS', function () { https = true; step = 0; draw(); }),
          btn('HTTP (tanpa TLS)', function () { https = false; draw(); }, 'alt'), nextBtn),
        log, h('strong', null, 'Yang terlihat oleh penyadap di Wi-Fi publik'), spy));
      draw();
    }
  };

  SIMS.auth = {
    title: 'Autentikasi dan otorisasi',
    desc: 'Login untuk mendapatkan token, lalu coba endpoint dengan dan tanpa token.',
    build: function (r) {
      var token = null;
      var tokEl = h('div', { class: 'muted' }, 'Token: (belum login)');
      var lg = logBox(8);
      var email = h('input', { type: 'text', value: 'ani@contoh.test' }), pass = h('input', { type: 'password', value: 'rahasia123' });
      function req(path, withToken, admin) {
        var line = 'GET ' + path + (withToken && token ? '  Authorization: Bearer ' + token : '');
        if (!withToken || !token) lg.add(line + ' → 401 Unauthorized (belum terautentikasi)', 'bad');
        else if (admin) lg.add(line + ' → 403 Forbidden (tidak punya hak)', 'bad');
        else lg.add(line + ' → 200 OK', 'ok');
      }
      r.appendChild(h('div', { class: 'col' },
        h('div', { class: 'rowbtn' }, email, pass, btn('Login', function () {
          if (!email.value.trim() || !pass.value) { lg.add('Login gagal: data kosong', 'bad'); return; }
          token = 'tk_' + hexNoise(4); tokEl.textContent = 'Token: ' + token; lg.add('POST /login → 200, token diterima', 'ok');
        })),
        tokEl,
        h('div', { class: 'rowbtn' },
          btn('GET /data tanpa token', function () { req('/data', false); }, 'alt'),
          btn('GET /data dengan token', function () { req('/data', true); }),
          btn('GET /admin dengan token biasa', function () { req('/admin', true, true); }, 'alt'),
          btn('Keluar', function () { token = null; tokEl.textContent = 'Token: (belum login)'; lg.add('Token dihapus dari perangkat'); }, 'alt')),
        lg.el));
    }
  };

  SIMS.secure = {
    title: 'Secure storage dibanding teks biasa',
    desc: 'Simpan token. Secure storage menyimpan terenkripsi dan UI menampilkannya tersamarkan, sedangkan penyimpanan biasa bisa terbaca.',
    build: function (r) {
      var secure = null, plain = null;
      var a = h('div', { class: 'mcard' }), b = h('div', { class: 'mcard' });
      var input = h('input', { type: 'text', value: 'abc123xyz789' });
      function mask(v) { return v.length <= 4 ? '****' : new Array(v.length - 3).join('*') + v.slice(-4); }
      function draw() {
        a.innerHTML = ''; b.innerHTML = '';
        a.append(h('strong', null, 'Secure storage (Keystore atau Keychain)'), h('div', null, secure == null ? '(kosong)' : 'Tersimpan terenkripsi. Tampil di UI: ' + mask(secure)));
        b.append(h('strong', null, 'SharedPreferences (tidak terenkripsi)'), h('div', null, plain == null ? '(kosong)' : 'Terbaca: ' + plain));
      }
      r.appendChild(h('div', { class: 'col' },
        h('div', { class: 'rowbtn' }, input,
          btn('Simpan di secure storage', function () { secure = input.value; draw(); }),
          btn('Simpan di SharedPreferences', function () { plain = input.value; draw(); }, 'alt'),
          btn('Hapus semua', function () { secure = plain = null; draw(); }, 'alt')),
        a, b));
      draw();
    }
  };

  function periksaUrlAman(url) {
    var u;
    try { u = new URL(url.trim()); } catch (e) { return 'URL tidak valid.'; }
    if (!u.host) return 'URL tidak valid.';
    if (u.protocol !== 'https:') return 'Gunakan HTTPS (https://).';
    return null;
  }

  SIMS.urlcheck = {
    title: 'Validasi URL aman',
    desc: 'Ketik URL atau pilih contoh. Hasil mengikuti periksaUrlAman() pada app/.',
    build: function (r) {
      var out = h('div', { class: 'mcard' });
      var input = h('input', { type: 'text', value: 'https://jsonplaceholder.typicode.com/posts/1', oninput: check, style: 'width:100%' });
      function check() {
        var m = periksaUrlAman(input.value);
        out.className = 'mcard ' + (m ? 'bad' : 'okc');
        out.textContent = m ? 'Ditolak: ' + m + ' Request tidak dikirim.' : 'Aman: request boleh dikirim.';
      }
      var ex = ['https://jsonplaceholder.typicode.com/posts/1', 'http://jsonplaceholder.typicode.com/posts/1', 'bukan url', 'https://', 'ftp://contoh.test/berkas'];
      r.appendChild(h('div', { class: 'col' }, input, h('div', { class: 'rowbtn' }, ex.map(function (x) { return btn(x.length > 28 ? x.slice(0, 26) + '…' : x, function () { input.value = x; check(); }, 'alt'); })), out));
      check();
    }
  };

  /* ---------- Panel ---------- */
  var overlay = null, current = null, openBtn = null;

  function close() {
    if (overlay) { overlay.remove(); overlay = null; }
    document.body.classList.remove('sim-open');
  }

  function open(name) {
    var sim = SIMS[name];
    if (!sim) return;
    close();
    var body = h('div', { class: 'sim-body' });
    overlay = h('div', { class: 'sim-overlay', role: 'dialog', 'aria-label': sim.title, onclick: function (e) { if (e.target === overlay) close(); } },
      h('div', { class: 'sim-box' },
        h('div', { class: 'sim-head' }, h('strong', null, 'Simulasi: ' + sim.title), btn('Tutup (Esc)', close, 'alt')),
        h('p', { class: 'sim-desc' }, sim.desc), body));
    document.body.appendChild(overlay);
    document.body.classList.add('sim-open');
    sim.build(body);
  }

  document.addEventListener('slidechange', function (e) {
    close();
    var name = e.detail.slide.getAttribute('data-sim');
    current = name;
    if (!openBtn) {
      var nav = document.querySelector('.nav');
      if (!nav) return;
      openBtn = h('button', { type: 'button', id: 'simBtn', class: 'simbtn', onclick: function () { if (current) open(current); } }, '▶ Simulasi (S)');
      nav.appendChild(openBtn);
    }
    openBtn.style.display = name ? '' : 'none';
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { close(); return; }
    var tag = e.target && e.target.tagName;
    if ((e.key === 's' || e.key === 'S') && tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT' && current && !overlay) {
      open(current);
    }
  });
})();

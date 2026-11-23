/* Simulasi tambahan untuk jalur React Native. Dimuat setelah sim.js. */
(function () {
  'use strict';
  var A = window.AMP_SIM;
  if (!A) return;
  var h = A.h, btn = A.btn, phone = A.phone, logBox = A.logBox, SIMS = A.SIMS;

  function sel(options, value, onchange) {
    var s = h('select', { onchange: function () { onchange(s.value); } });
    options.forEach(function (o) { s.appendChild(h('option', { value: o }, o)); });
    s.value = value;
    return s;
  }
  function field(label, control) { return h('label', null, h('span', { style: 'min-width:130px' }, label), control); }

  /* ---------- Modul 1: dari JSX ke tampilan native ---------- */
  var NATIVE = {
    View: { android: 'ViewGroup', ios: 'UIView', jsx: '<View style={{ padding: 12 }} />', note: 'Wadah tata letak.' },
    Text: { android: 'TextView', ios: 'tampilan teks native', jsx: '<Text>Halo, dunia</Text>', note: 'Semua teks wajib berada di dalam Text.' },
    TextInput: { android: 'EditText', ios: 'UITextField', jsx: '<TextInput placeholder="Judul" />', note: 'Kolom isian, papan ketik muncul otomatis.' },
    ScrollView: { android: 'ScrollView', ios: 'UIScrollView', jsx: '<ScrollView>{...}</ScrollView>', note: 'Konten yang dapat digulir.' },
    Image: { android: 'ImageView', ios: 'UIImageView', jsx: '<Image source={foto} />', note: 'Menampilkan gambar.' }
  };
  SIMS.rn_bridge = {
    title: 'Dari JSX ke tampilan native',
    desc: 'Satu kode React Native menjadi komponen asli di tiap platform. Pilih komponen dan platform. Padanan kelas bersifat kasar, untuk membangun gambaran.',
    build: function (r) {
      var comp = 'View', plat = 'android';
      var out = h('div', { class: 'col' });
      function draw() {
        var d = NATIVE[comp];
        out.innerHTML = '';
        var isA = plat === 'android';
        var mock = h('div', { style: 'border:2px solid #1565c0;padding:12px;background:' + (isA ? '#e8f0fe' : '#f2f2f7') + ';border-radius:' + (isA ? '4px' : '12px') + ';min-height:48px' },
          comp === 'TextInput' ? h('div', { style: 'border-bottom:2px solid #1565c0;color:#78909c;padding:4px 0' }, 'Judul')
            : comp === 'Text' ? h('span', null, 'Halo, dunia')
              : comp === 'Image' ? h('div', { style: 'height:40px;background:linear-gradient(135deg,#90caf9,#a5d6a7);border-radius:4px' })
                : comp === 'ScrollView' ? h('div', null, 'Baris 1', h('br'), 'Baris 2', h('br'), 'Baris 3 ...') : 'Wadah');
        out.appendChild(h('div', null, h('strong', null, 'Kode React Native'), h('pre', { style: 'margin:4px 0;padding:8px;background:#0f1220;color:#e8eaf6;border-radius:8px;overflow:auto;font-size:14px' }, d.jsx)));
        out.appendChild(h('div', null, h('span', { class: 'badge ok' }, (isA ? 'Android: ' : 'iOS: ') + (isA ? d.android : d.ios))));
        out.appendChild(mock);
        out.appendChild(h('div', { class: 'muted' }, d.note));
      }
      var cs = sel(Object.keys(NATIVE), comp, function (v) { comp = v; draw(); });
      var ps = sel(['android', 'ios'], plat, function (v) { plat = v; draw(); });
      r.appendChild(h('div', { class: 'row' },
        h('div', { class: 'col' }, field('Komponen', cs), field('Platform', ps),
          h('div', { class: 'muted' }, 'JavaScript memerintahkan pembuatan tampilan. Hasil akhirnya adalah komponen asli, bukan halaman web.')),
        out));
      draw();
    }
  };

  /* ---------- Modul 1: state dan render ulang ---------- */
  SIMS.rn_state = {
    title: 'useState dan render ulang',
    desc: 'Mengubah state memicu render ulang. Mengubah variabel biasa tidak. Fast Refresh menjaga state, memuat ulang aplikasi mengosongkannya.',
    build: function (r) {
      var count = 0, plain = 0, renders = 0, inits = 0;
      var num = h('div', { class: 'big' }), info = h('div', { class: 'muted' }), pl = h('div', { class: 'muted' });
      var lg = logBox(9);
      function render(why) { renders++; num.textContent = count; pl.textContent = 'variabel biasa (let): ' + plain + ' (tampilan hanya berubah saat render)'; info.textContent = 'komponen dirender ' + renders + 'x'; lg.add('render #' + renders + ' · ' + why); }
      function boot() { inits++; count = 0; plain = 0; renders = 0; render('aplikasi dimuat'); }
      boot();
      r.appendChild(h('div', { class: 'row' },
        phone('Counter', [num, info, pl, h('div', { class: 'rowbtn' },
          btn('setCount(+1)', function () { count++; render('setCount dipanggil'); }),
          btn('plain++', function () { plain++; lg.add('plain naik, TIDAK ada render', 'warn'); }, 'alt'),
          btn('Fast Refresh', function () { render('Fast Refresh: kode diedit, state tetap'); }),
          btn('Reload app', function () { lg.add('Reload: state dibuang', 'warn'); boot(); }, 'alt'))]),
        h('div', { class: 'col' }, h('strong', null, 'Log'), lg.el)));
    }
  };

  /* ---------- Modul 6: useEffect dan cleanup ---------- */
  SIMS.rn_effect = {
    title: 'useEffect dan cleanup (langganan sensor)',
    desc: 'Effect menambah pendengar sensor. Tanpa cleanup, pendengar menumpuk dan baterai terkuras. Coba setiap kombinasi.',
    build: function (r) {
      var mounted = false, deps = '[] (sekali)', cleanup = true, id = 1, lastId = null, listeners = 0, renders = 0, cleanFn = null;
      var badge = h('span', { class: 'badge' }), info = h('div', { class: 'muted' }), lg = logBox(10);
      function status() {
        badge.textContent = 'pendengar sensor aktif: ' + listeners;
        badge.className = 'badge ' + (listeners === 0 ? '' : listeners === 1 ? 'ok' : 'bad');
        info.textContent = mounted ? 'Halaman tampil · render #' + renders + ' · id=' + id : 'Halaman tidak tampil';
      }
      function runEffect() {
        listeners++; lastId = id;
        lg.add('effect: addListener (id=' + id + ')', 'ok');
        cleanFn = cleanup ? function () { listeners--; lg.add('cleanup: listener.remove()'); } : null;
      }
      function commit() {
        renders++;
        var run = deps.indexOf('[]') === 0 ? false : deps.indexOf('[id]') === 0 ? lastId !== id : true;
        if (run) { if (cleanFn) cleanFn(); else if (lastId !== null) lg.add('tidak ada cleanup: pendengar lama tetap hidup', 'bad'); runEffect(); }
        status();
      }
      function mount() { if (mounted) return; mounted = true; renders = 0; lastId = null; lg.add('halaman dibuka'); commit(); }
      function unmount() { if (!mounted) return; mounted = false; lg.add('halaman ditutup'); if (cleanFn) cleanFn(); else lg.add('tidak ada cleanup: pendengar tetap hidup (bocor)', 'bad'); cleanFn = null; status(); }
      r.appendChild(h('div', { class: 'row' },
        h('div', { class: 'col' },
          field('Dependensi', sel(['[] (sekali)', '[id] (saat id berubah)', 'tanpa array (tiap render)'], deps, function (v) { deps = v; })),
          h('label', null, h('input', { type: 'checkbox', checked: true, onchange: function (e) { cleanup = e.target.checked; } }), 'Tulis cleanup (return () => remove())'),
          h('div', { class: 'rowbtn' },
            btn('Buka halaman', mount), btn('Render ulang', function () { if (mounted) { lg.add('state lain berubah'); commit(); } }, 'alt'),
            btn('Ganti id', function () { if (mounted) { id++; lg.add('id menjadi ' + id); commit(); } }, 'alt'), btn('Tutup halaman', unmount, 'alt')),
          badge, info, h('div', { class: 'muted' }, 'Ubah pilihan sebelum membuka halaman. Pilihan baru berlaku pada effect berikutnya.')),
        h('div', { class: 'col' }, h('strong', null, 'Log'), lg.el)));
      status();
    }
  };

  /* ---------- Modul 2: flexbox ---------- */
  SIMS.rn_flex = {
    title: 'Flexbox: StyleSheet langsung terlihat',
    desc: 'Ubah properti dan lihat tata letak serta kodenya. Di React Native arah bawaan adalah column.',
    build: function (r) {
      var st = { dir: 'column', jc: 'flex-start', ai: 'stretch', f2: '0' };
      var stage = h('div'), code = h('pre', { style: 'margin:0;padding:10px;background:#0f1220;color:#e8eaf6;border-radius:8px;font-size:14px' });
      var cols = ['#1565c0', '#2e7d32', '#e65100'];
      function draw() {
        stage.style.cssText = 'display:flex;height:250px;border:2px dashed #90a4ae;border-radius:8px;padding:6px;background:#f5f7fb;flex-direction:' + st.dir + ';justify-content:' + st.jc + ';align-items:' + st.ai;
        stage.innerHTML = '';
        [1, 2, 3].forEach(function (n, i) {
          var f = n === 2 && st.f2 !== '0' ? 'flex:' + st.f2 + ' 1 0%;' : '';
          stage.appendChild(h('div', { style: 'background:' + cols[i] + ';color:#fff;font-weight:700;padding:12px 20px;border-radius:6px;text-align:center;' + f }, String(n)));
        });
        code.textContent = 'container: {\n  flex: 1,\n  flexDirection: \'' + st.dir + '\',\n  justifyContent: \'' + st.jc + '\',\n  alignItems: \'' + st.ai + '\',\n},\nkotak2: { ' + (st.f2 === '0' ? '/* tanpa flex */' : 'flex: ' + st.f2) + ' }';
      }
      function ctl(label, key, opts) { return field(label, sel(opts, st[key], function (v) { st[key] = v; draw(); })); }
      r.appendChild(h('div', { class: 'row' },
        h('div', { class: 'col' },
          ctl('flexDirection', 'dir', ['column', 'row']),
          ctl('justifyContent', 'jc', ['flex-start', 'center', 'flex-end', 'space-between', 'space-around']),
          ctl('alignItems', 'ai', ['stretch', 'flex-start', 'center', 'flex-end']),
          ctl('flex kotak 2', 'f2', ['0', '1', '2']), code),
        h('div', { class: 'col' }, phone('Tata letak', stage, 300))));
      draw();
    }
  };

  /* ---------- Modul 2: navigasi expo-router ---------- */
  SIMS.rn_nav = {
    title: 'Navigasi expo-router',
    desc: 'Nama file di folder app menjadi alamat halaman. Ketuk berkas untuk router.push, lalu coba tombol kembali.',
    build: function (r) {
      var FILES = [['app/index.tsx', '/', 'Associate Mobile App'], ['app/notes.tsx', '/notes', 'Catatan'], ['app/note-form.tsx', '/note-form', 'Form Catatan'], ['app/location.tsx', '/location', 'Lokasi dan Peta']];
      var stack = [0], lg = logBox(8), screen = h('div'), stackBox = h('div', { class: 'muted' });
      function draw() {
        var cur = FILES[stack[stack.length - 1]];
        screen.innerHTML = '';
        screen.appendChild(h('div', { style: 'background:#1565c0;color:#fff;padding:8px 10px;font-weight:700;display:flex;gap:8px' }, stack.length > 1 ? '←' : '', cur[2]));
        screen.appendChild(h('div', { style: 'padding:16px;min-height:90px' }, 'Isi halaman ', h('code', null, cur[1])));
        stackBox.textContent = 'Tumpukan: ' + stack.map(function (i) { return FILES[i][1]; }).join(' → ');
      }
      function push(i) { stack.push(i); lg.add("router.push('" + FILES[i][1] + "')", 'ok'); draw(); }
      function back() { if (stack.length > 1) { stack.pop(); lg.add('router.back()'); draw(); } else lg.add('sudah di halaman pertama', 'warn'); }
      r.appendChild(h('div', { class: 'row' },
        h('div', { class: 'col' }, h('strong', null, 'Folder app/'),
          FILES.map(function (f, i) { return btn(f[0] + '  →  ' + f[1], function () { push(i); }, 'alt'); }),
          btn('router.back()', back), stackBox, lg.el),
        h('div', { class: 'col' }, phone('Ponsel', screen, 280))));
      draw();
    }
  };

  /* ---------- Modul 8: pengujian jest ---------- */
  SIMS.rn_tests = {
    title: 'npm test: kode salah, tes merah',
    desc: 'Sisipkan kesalahan ke fungsi validasiJudul, lalu jalankan pengujian. Tes yang baik menangkap kesalahan sebelum pengguna.',
    build: function (r) {
      var bug = { trim: false, limit: false, pesan: false };
      var code = h('pre', { style: 'margin:0;padding:10px;background:#0f1220;color:#e8eaf6;border-radius:8px;font-size:14px;overflow:auto' });
      var res = h('div', { class: 'col' });
      function fn(j) {
        var len = (bug.trim ? j : j.trim()).length;
        if (len === 0) return bug.pesan ? 'Judul kosong' : 'Judul wajib diisi.';
        if (len > (bug.limit ? 1000 : 100)) return 'Judul maksimal 100 karakter.';
        return null;
      }
      function src() {
        return 'export function validasiJudul(judul: string) {\n  const n = ' + (bug.trim ? 'judul' : 'judul.trim()') + '.length;\n  if (n === 0) return \'' + (bug.pesan ? 'Judul kosong' : 'Judul wajib diisi.') + '\';\n  if (n > ' + (bug.limit ? '1000' : '100') + ') return \'Judul maksimal 100 karakter.\';\n  return null;\n}';
      }
      var TESTS = [
        ['judul kosong ditolak', '', 'Judul wajib diisi.'],
        ['judul berisi spasi ditolak', '   ', 'Judul wajib diisi.'],
        ['judul 101 karakter ditolak', new Array(102).join('a'), 'Judul maksimal 100 karakter.'],
        ['judul normal diterima', 'Belanja', null]
      ];
      function run() {
        res.innerHTML = '';
        var pass = 0;
        TESTS.forEach(function (t) {
          var got = fn(t[1]), ok = got === t[2];
          if (ok) pass++;
          res.appendChild(h('div', { class: 'mcard ' + (ok ? 'okc' : 'bad') }, (ok ? '✓ ' : '✗ ') + t[0],
            ok ? '' : h('div', { class: 'muted' }, 'Diharapkan: ' + JSON.stringify(t[2]) + ' · Hasil: ' + JSON.stringify(got))));
        });
        res.appendChild(h('div', { class: 'badge ' + (pass === TESTS.length ? 'ok' : 'bad') }, 'Tests: ' + pass + ' passed, ' + (TESTS.length - pass) + ' failed'));
      }
      function chk(label, key) {
        return h('label', null, h('input', { type: 'checkbox', onchange: function (e) { bug[key] = e.target.checked; code.textContent = src(); run(); } }), label);
      }
      code.textContent = src();
      r.appendChild(h('div', { class: 'row' },
        h('div', { class: 'col' }, chk('Lupa trim() (spasi dianggap isi)', 'trim'), chk('Batas 100 menjadi 1000', 'limit'), chk('Pesan error berubah', 'pesan'), code,
          h('div', { class: 'rowbtn' }, btn('npm test', run))),
        res));
      run();
    }
  };
})();

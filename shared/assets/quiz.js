(function () {
  var scores = {};
  function refresh() {
    document.querySelectorAll('.skor').forEach(function (c) {
      var u = c.dataset.unit;
      var s = scores[u] || { ok: 0, n: 0 };
      c.textContent = s.ok + ' / 6';
      var st = document.querySelector('.stat[data-unit="' + u + '"]');
      st.textContent = s.n === 0 ? 'belum dikerjakan' : (s.n < 6 ? 'sedang dikerjakan' : (s.ok >= 5 ? 'Siap' : 'Perlu diulang'));
    });
  }
  function pick(q, i) {
    if (q.dataset.done) return;
    q.dataset.done = '1';
    var ans = parseInt(q.dataset.ans, 10);
    var btns = q.querySelectorAll('.opt');
    btns.forEach(function (b, k) {
      b.disabled = true;
      if (k === ans) b.classList.add('right');
      else if (k === i) b.classList.add('wrong');
    });
    q.querySelector('.why').hidden = false;
    var u = q.dataset.unit;
    scores[u] = scores[u] || { ok: 0, n: 0 };
    scores[u].n++;
    if (i === ans) scores[u].ok++;
    refresh();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.opt');
    if (b) { pick(b.closest('.quizq'), parseInt(b.dataset.i, 10)); return; }
    var r = e.target.closest('.reveal');
    if (r) { r.nextElementSibling.hidden = false; r.hidden = true; }
  });
  document.addEventListener('keydown', function (e) {
    var k = 'abcd'.indexOf(e.key.toLowerCase());
    if (k < 0 || e.ctrlKey || e.metaKey || e.altKey) return;
    var q = document.querySelector('.slide.active .quizq');
    if (q) pick(q, k);
  });
  refresh();
})();

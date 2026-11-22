(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var prev = document.getElementById('prev');
  var next = document.getElementById('next');
  var counter = document.getElementById('counter');
  var bar = document.getElementById('progress');
  var idx = -1;

  function show(i) {
    if (i < 0 || i >= slides.length) return;
    if (idx >= 0) slides[idx].classList.remove('active');
    idx = i;
    slides[idx].classList.add('active');
    counter.textContent = (idx + 1) + ' / ' + slides.length;
    prev.disabled = idx === 0;
    next.disabled = idx === slides.length - 1;
    bar.style.width = ((idx + 1) / slides.length * 100) + '%';
    history.replaceState(null, '', '#' + (idx + 1));
    window.scrollTo(0, 0);
  }

  prev.addEventListener('click', function () { show(idx - 1); });
  next.addEventListener('click', function () { show(idx + 1); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      show(idx + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      show(idx - 1);
    }
  });

  var start = parseInt(location.hash.slice(1), 10);
  if (isNaN(start)) start = 1;
  show(Math.min(Math.max(start - 1, 0), slides.length - 1));
})();

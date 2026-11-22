/* Pewarna sintaks ringan untuk Dart, YAML, Bash, dan XML. Berjalan offline. */
(function () {
  var KW = new Set(('abstract as assert async await break case catch class const continue covariant default ' +
    'deferred do dynamic else enum export extends extension external factory false final finally for ' +
    'Function get hide if implements import in interface is late library mixin new null on operator part ' +
    'required rethrow return sealed set show static super switch sync this throw true try typedef var ' +
    'void while with yield').split(' '));

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function span(cls, s) {
    return '<span class="tk-' + cls + '">' + esc(s) + '</span>';
  }

  function dart(src) {
    var re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|('(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*")|(@\w+)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)|([\s\S])/g;
    var out = '';
    var m;
    while ((m = re.exec(src))) {
      if (m[1]) out += span('c', m[1]);
      else if (m[2]) out += span('s', m[2]);
      else if (m[3]) out += span('a', m[3]);
      else if (m[4]) out += span('n', m[4]);
      else if (m[5]) {
        var w = m[5];
        var nextCh = src.charAt(re.lastIndex);
        if (KW.has(w)) out += span('k', w);
        else if (/^[A-Z]/.test(w)) out += span('t', w);
        else if (nextCh === '(') out += span('f', w);
        else out += esc(w);
      } else out += esc(m[6]);
    }
    return out;
  }

  function yaml(src) {
    return src.split('\n').map(function (line) {
      var cm = line.match(/^(.*?)(\s*#.*)$/);
      var body = line, comment = '';
      if (cm && cm[1].indexOf('#') === -1) { body = cm[1]; comment = cm[2]; }
      var km = body.match(/^(\s*)([\w.-]+)(:)(.*)$/);
      var html;
      if (km) {
        var val = km[4];
        var vh = esc(val);
        var vm = val.match(/^(\s*)(\S.*)$/);
        if (vm) {
          vh = esc(vm[1]) + (/^[\^~<>=\d]/.test(vm[2]) ? span('n', vm[2]) : span('s', vm[2]));
        }
        html = esc(km[1]) + span('f', km[2]) + esc(km[3]) + vh;
      } else {
        html = esc(body);
      }
      return html + (comment ? span('c', comment) : '');
    }).join('\n');
  }

  function bash(src) {
    return src.split('\n').map(function (line) {
      var cm = line.match(/^(.*?)(#.*)$/);
      var body = line, comment = '';
      if (cm) { body = cm[1]; comment = cm[2]; }
      var first = true;
      var html = body.replace(/(\s+)|("[^"]*"|'[^']*')|(--?[\w-]+)|(\S+)/g, function (all, ws, str, flag, word) {
        if (ws) return esc(ws);
        if (str) return span('s', str);
        if (flag) return span('t', flag);
        if (first) { first = false; return span('f', word); }
        return esc(word);
      });
      return html + (comment ? span('c', comment) : '');
    }).join('\n');
  }

  function xml(src) {
    var re = /(<!--[\s\S]*?-->)|(<\/?[\w:.-]+)|(\s[\w:.-]+)(=)("[^"]*")|(\/?>)|([\s\S])/g;
    var out = '';
    var m;
    while ((m = re.exec(src))) {
      if (m[1]) out += span('c', m[1]);
      else if (m[2]) out += span('k', m[2]);
      else if (m[3]) out += esc(m[3].charAt(0)) + span('t', m[3].slice(1)) + esc(m[4]) + span('s', m[5]);
      else if (m[6]) out += span('k', m[6]);
      else out += esc(m[7]);
    }
    return out;
  }

  function detect(src) {
    var s = src.replace(/^(\s*#[^\n]*\n)+/, '').trim();
    if (s.indexOf('├──') !== -1 || s.indexOf('└──') !== -1) return 'plain';
    if (/^</.test(s)) return 'xml';
    if (/^(flutter|cd|dart|git|npm|\$)\b/.test(s) && s.indexOf('{') === -1 && s.indexOf(';') === -1) return 'bash';
    if (/^(name|dependencies|dev_dependencies|environment|flutter):/m.test(s) && s.indexOf('{') === -1 && s.indexOf(';') === -1) return 'yaml';
    return 'dart';
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve) {
      var ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) { /* abaikan */ }
      document.body.removeChild(ta);
      resolve();
    });
  }

  function addTools(pre, src, lang) {
    pre.classList.add('has-tools');
    var bar = document.createElement('div');
    bar.className = 'code-tools';

    var label = document.createElement('span');
    label.className = 'code-lang';
    label.textContent = lang;
    bar.appendChild(label);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Salin';
    btn.addEventListener('click', function () {
      copyText(src).then(function () {
        btn.textContent = 'Tersalin';
        setTimeout(function () { btn.textContent = 'Salin'; }, 1400);
      });
    });
    bar.appendChild(btn);

    if (lang === 'dart' && /(void\s+main\s*\(|extends\s+(Stateless|Stateful)Widget)/.test(src)) {
      var pad = document.createElement('button');
      pad.type = 'button';
      pad.textContent = 'DartPad';
      pad.title = 'Menyalin kode lalu membuka DartPad. Tempel kode di editor.';
      pad.addEventListener('click', function () {
        copyText(src).then(function () {
          pad.textContent = 'Kode tersalin';
          setTimeout(function () { pad.textContent = 'DartPad'; }, 1800);
          window.open('https://dartpad.dev/', '_blank', 'noopener');
        });
      });
      bar.appendChild(pad);
    }
    pre.insertBefore(bar, pre.firstChild);
  }

  function run() {
    var blocks = document.querySelectorAll('pre > code');
    Array.prototype.forEach.call(blocks, function (code) {
      if (code.dataset.hl) return;
      var src = code.textContent;
      var lang = detect(src);
      var html;
      if (lang === 'dart') html = dart(src);
      else if (lang === 'yaml') html = yaml(src);
      else if (lang === 'bash') html = bash(src);
      else if (lang === 'xml') html = xml(src);
      else html = esc(src);
      code.innerHTML = html;
      code.dataset.hl = lang;
      addTools(code.parentNode, src, lang === 'plain' ? 'teks' : lang);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();

#!/usr/bin/env node
'use strict';
/**
 * strip-comments.js — hapus komentar dari file kode, tanpa dependensi (Node >= 14).
 *
 * Pendekatan: tokenizer berbasis state machine per keluarga bahasa. String dan
 * literal dikenali dulu, sehingga "//" di dalam "http://..." atau '#' di dalam
 * string TIDAK ikut terhapus. Cara kerjanya table-driven: menambah bahasa baru
 * cukup menambah satu entri di SPECS dan satu baris di registri ekstensi.
 *
 * Pakai:
 *   node strip-comments.js src/app.js                 -> hasil ke stdout
 *   node strip-comments.js src/ -w                    -> timpa file di tempat
 *   node strip-comments.js src/ -o clean/             -> tulis ke folder lain
 *   node strip-comments.js src/ --dry-run             -> hanya lapor statistik
 *   cat x.py | node strip-comments.js - --lang python -> dari stdin
 *   node strip-comments.js --list                     -> daftar bahasa
 */
const fs = require('fs');
const path = require('path');

/* ------------------------------------------------------------------ *
 *  Pembangun token
 * ------------------------------------------------------------------ */
const line = (open, o = {}) => ({ kind: 'line', open, ...o });
const lineRe = (re, first, o = {}) => ({ kind: 'line', re, first, ...o });
const block = (open, close, o = {}) => ({ kind: 'block', open, close, ...o });
const blockRe = (re, first, close, o = {}) => ({ kind: 'block', re, first, close, ...o });
const str = (open, close = open, o = {}) => ({ kind: 'string', open, close, esc: '\\', ml: false, ...o });
const strRe = (re, first, closeFn, o = {}) => ({ kind: 'string', re, first, closeFn, esc: null, ml: true, ...o });
const lit = (re, first) => ({ kind: 'lit', re, first });
const embed = (re, stop, spec) => ({ kind: 'embed', re, first: '<', stop, spec });

// Literal karakter: 'a', '\n', '\x41', '\u{1F600}' (dipakai agar 'a lifetime Rust / 1'000 C++ tidak dianggap string)
const CHAR = /'(?:\\(?:x[0-9a-fA-F]+|[0-7]{1,3}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8}|u\{[0-9a-fA-F]+\}|.)|[^\\'\n])'/yu;
const charLit = () => lit(CHAR, "'");
const cLine = () => line('//');
const cBlock = () => block('/*', '*/');
const urlLit = () => lit(/url\(\s*[^'")\s][^)]*\)/iy, 'uU'); // url(http://...) tanpa kutip

const SH_PREV = /[\s;&|()`]/; // '#' hanya komentar jika didahului spasi/pemisah (bukan $# atau a#b)
const YAML_QUOTE_PREV = /[\s[{,:?-]/;

/* ------------------------------------------------------------------ *
 *  Spesifikasi bahasa
 * ------------------------------------------------------------------ */
const tripleML = (q) => str(q, q, { ml: true });

const SPECS = {
  c: { tokens: [cBlock(), cLine(), str('"'), charLit()] },
  cpp: {
    tokens: [
      cBlock(), cLine(),
      strRe(/R"([^()\\\s]{0,16})\(/y, 'R', (m) => ')' + m[1] + '"'),
      str('"'), charLit(),
    ],
  },
  csharp: {
    tokens: [
      cBlock(), cLine(),
      str('"""', '"""', { ml: true, esc: null }),
      str('$@"', '"', { esc: null, doubled: true, ml: true }),
      str('@$"', '"', { esc: null, doubled: true, ml: true }),
      str('@"', '"', { esc: null, doubled: true, ml: true }),
      str('"'), charLit(),
    ],
  },
  java: { tokens: [cBlock(), cLine(), tripleML('"""'), str('"'), charLit()] },
  kotlin: { tokens: [block('/*', '*/', { nested: true }), cLine(), tripleML('"""'), str('"'), charLit()] },
  scala: { tokens: [block('/*', '*/', { nested: true }), cLine(), tripleML('"""'), str('"'), charLit()] },
  swift: { tokens: [block('/*', '*/', { nested: true }), cLine(), tripleML('"""'), str('"')] },
  go: { tokens: [cBlock(), cLine(), str('`', '`', { esc: null, ml: true }), str('"'), charLit()] },
  rust: {
    tokens: [
      block('/*', '*/', { nested: true }), cLine(),
      strRe(/b?r(#*)"/y, 'rb', (m) => '"' + m[1]),
      str('"', '"', { ml: true }), charLit(),
    ],
  },
  js: {
    regexLiterals: true,
    tokens: [cBlock(), cLine(), str('`', '`', { ml: true, tmpl: true }), str('"'), str("'")],
  },
  php: {
    tokens: [
      cBlock(), cLine(), lineRe(/#(?!\[)/y, '#'),
      str("'", "'", { ml: true }), str('"', '"', { ml: true }), str('`', '`', { ml: true }),
    ],
  },
  dart: {
    tokens: [block('/*', '*/', { nested: true }), cLine(), tripleML("'''"), tripleML('"""'), str("'"), str('"')],
  },
  groovy: { tokens: [cBlock(), cLine(), tripleML("'''"), tripleML('"""'), str("'"), str('"')] },
  clike: { tokens: [cBlock(), cLine(), str('"'), str("'")] },
  zig: { tokens: [cLine(), str('"'), charLit()] },
  jsonc: { tokens: [cBlock(), cLine(), str('"'), str("'")] },
  css: { tokens: [cBlock(), urlLit(), str('"'), str("'")] },
  scss: { tokens: [cBlock(), cLine(), urlLit(), str('"'), str("'")] },

  python: {
    tokens: [line('#'), tripleML("'''"), tripleML('"""'), str('"'), str("'")],
  },
  ruby: {
    regexLiterals: true,
    tokens: [
      block('=begin', '\n=end', { lineStart: true, toEol: true }),
      line('#'),
      str("'", "'", { ml: true }), str('"', '"', { ml: true }), str('`', '`', { ml: true }),
    ],
  },
  crystal: { tokens: [line('#'), str('"', '"', { ml: true }), charLit()] },
  perl: {
    regexLiterals: true,
    tokens: [
      blockRe(/=[a-zA-Z]/y, '=', '\n=cut', { lineStart: true, toEol: true }),
      line('#', { prev: /[^$@%&]/ }),
      str("'", "'", { ml: true }), str('"', '"', { ml: true }), str('`', '`', { ml: true }),
    ],
  },
  sh: {
    tokens: [
      line('#', { prev: SH_PREV }),
      str("'", "'", { esc: null, ml: true }), str('"', '"', { ml: true }), str('`', '`', { ml: true }),
    ],
  },
  makefile: {
    tokens: [
      line('#', { prev: SH_PREV }),
      str("'", "'", { esc: null }), str('"'),
    ],
  },
  hashline: { tokens: [line('#', { indent: true })] }, // Dockerfile, .gitignore
  powershell: {
    tokens: [
      block('<#', '#>'), line('#'),
      str('@"', '"@', { esc: null, ml: true }), str("@'", "'@", { esc: null, ml: true }),
      str("'", "'", { esc: null, doubled: true, ml: true }), str('"', '"', { esc: '`', doubled: true, ml: true }),
    ],
  },
  r: { tokens: [line('#'), str('"', '"', { ml: true }), str("'", "'", { ml: true })] },
  julia: {
    tokens: [block('#=', '=#', { nested: true }), line('#'), tripleML('"""'), str('"', '"', { ml: true }), charLit()],
  },
  elixir: {
    tokens: [line('#'), tripleML('"""'), tripleML("'''"), str('"', '"', { ml: true }), str("'", "'", { ml: true })],
  },
  nim: {
    tokens: [
      blockRe(/#\[/y, '#', ']#', { nested: true, nestOpen: '#[' }),
      line('#'), tripleML('"""'), str('"'), charLit(),
    ],
  },
  coffee: {
    tokens: [block('###', '###'), line('#'), tripleML("'''"), tripleML('"""'), str("'"), str('"')],
  },
  tcl: { tokens: [line('#', { prev: /[\s;]/ }), str('"', '"', { ml: true })] },
  nix: { tokens: [cBlock(), line('#'), str("''", "''", { esc: null, ml: true }), str('"', '"', { ml: true })] },
  graphql: { tokens: [line('#'), tripleML('"""'), str('"')] },
  hcl: { tokens: [cBlock(), cLine(), line('#'), str('"')] },
  cmake: {
    tokens: [blockRe(/#\[(=*)\[/y, '#', (m) => ']' + m[1] + ']'), line('#'), str('"', '"', { ml: true })],
  },
  yaml: {
    tokens: [
      line('#', { prev: /\s/ }),
      str('"', '"', { prev: YAML_QUOTE_PREV }),
      str("'", "'", { esc: null, doubled: true, prev: YAML_QUOTE_PREV }),
    ],
  },
  toml: {
    tokens: [line('#'), tripleML("'''"), tripleML('"""'), str("'", "'", { esc: null }), str('"')],
  },
  ini: { tokens: [line('#', { indent: true }), line(';', { indent: true })] },
  properties: { tokens: [line('#', { indent: true }), line('!', { indent: true })] },

  sql: {
    tokens: [
      cBlock(), line('--'),
      str("'", "'", { esc: null, doubled: true, ml: true }),
      str('"', '"', { esc: null, doubled: true, ml: true }),
      str('`', '`', { esc: null, ml: true }),
    ],
  },
  lua: {
    tokens: [
      blockRe(/--\[(=*)\[/y, '-', (m) => ']' + m[1] + ']'),
      line('--'),
      strRe(/\[(=*)\[/y, '[', (m) => ']' + m[1] + ']'),
      str('"'), str("'"),
    ],
  },
  haskell: {
    tokens: [
      blockRe(/\{-(?!#)/y, '{', '-}', { nested: true, nestOpen: '{-' }),
      lineRe(/--+(?![!#$%&*+./<=>?@\\^|~:])/y, '-'),
      str('"'), charLit(),
    ],
  },
  lisp: { tokens: [line(';'), block('#|', '|#', { nested: true }), str('"', '"', { ml: true }), lit(/#\\./yu, '#')] },
  clojure: { tokens: [line(';'), str('"', '"', { ml: true }), lit(/\\./yu, '\\')] },
  erlang: { tokens: [line('%'), str('"', '"', { ml: true }), lit(/\$\\?./yu, '$')] },
  tex: { tokens: [lit(/\\[\s\S]/y, '\\'), line('%')] },
  vb: { tokens: [line("'"), str('"', '"', { esc: null, doubled: true })] },
  ada: { tokens: [line('--'), str('"', '"', { esc: null, doubled: true }), lit(/'.'/yu, "'")] },
  pascal: {
    tokens: [
      cLine(), blockRe(/\{(?!\$)/y, '{', '}'), block('(*', '*)'),
      str("'", "'", { esc: null, doubled: true }),
    ],
  },
  ocaml: {
    tokens: [blockRe(/\(\*(?!\))/y, '(', '*)', { nested: true, nestOpen: '(*' }), str('"', '"', { ml: true }), charLit()],
  },
  fsharp: {
    tokens: [
      cLine(),
      blockRe(/\(\*(?!\))/y, '(', '*)', { nested: true, nestOpen: '(*' }),
      str('"', '"', { ml: true }), charLit(),
    ],
  },
  fortran: {
    tokens: [line('!'), str("'", "'", { esc: null, doubled: true }), str('"', '"', { esc: null, doubled: true })],
  },
  asm: { tokens: [line(';'), str('"'), str("'")] },

  xml: { tokens: [block('<!--', '-->')] },
  html: {
    tokens: [
      block('<!--', '-->'),
      embed(/<script\b[^>]*>/iy, '</script', 'js'),
      embed(/<style\b[^>]*lang\s*=\s*["']?(?:scss|less)["']?[^>]*>/iy, '</style', 'scss'),
      embed(/<style\b[^>]*>/iy, '</style', 'css'),
    ],
  },
};

const LANG_ALIASES = { ts: 'js', javascript: 'js', typescript: 'js', py: 'python', rb: 'ruby', bash: 'sh', shell: 'sh',
  yml: 'yaml', 'c++': 'cpp', cs: 'csharp', kt: 'kotlin', rs: 'rust', ps1: 'powershell', hs: 'haskell', json: 'jsonc' };

/* Registri ekstensi dan nama file -> spesifikasi */
const EXT = {};
const NAMES = {};
const reg = (spec, exts, names = []) => {
  exts.forEach((e) => (EXT[e] = spec));
  names.forEach((n) => (NAMES[n.toLowerCase()] = spec));
};
reg('c', ['c', 'h', 'm']);
reg('cpp', ['cpp', 'cc', 'cxx', 'c++', 'hpp', 'hh', 'hxx', 'h++', 'ino', 'cu', 'cuh', 'mm']);
reg('csharp', ['cs', 'csx']);
reg('java', ['java']);
reg('kotlin', ['kt', 'kts']);
reg('scala', ['scala', 'sc']);
reg('swift', ['swift']);
reg('go', ['go']);
reg('rust', ['rs']);
reg('js', ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'mts', 'cts']);
reg('php', ['php', 'phtml']);
reg('dart', ['dart']);
reg('groovy', ['groovy', 'gradle'], ['Jenkinsfile']);
reg('clike', ['proto', 'sol', 'glsl', 'vert', 'frag', 'hlsl', 'fx', 'shader', 'v', 'sv', 'svh']);
reg('zig', ['zig']);
reg('jsonc', ['json', 'jsonc', 'json5']);
reg('css', ['css', 'pcss']);
reg('scss', ['scss', 'sass', 'less']);
reg('python', ['py', 'pyw', 'pyi', 'bzl', 'bazel', 'star']);
reg('ruby', ['rb', 'rake', 'gemspec', 'ru', 'thor', 'podspec'], ['Rakefile', 'Gemfile', 'Podfile', 'Vagrantfile', 'Guardfile', 'Brewfile']);
reg('crystal', ['cr']);
reg('perl', ['pl', 'pm']);
reg('sh', ['sh', 'bash', 'zsh', 'ksh', 'fish', 'env'],
  ['.bashrc', '.zshrc', '.profile', '.bash_profile', '.env']);
reg('makefile', ['mk', 'mak'], ['Makefile', 'GNUmakefile']);
reg('hashline', [], ['Dockerfile', '.gitignore', '.dockerignore', '.npmignore', '.gitattributes']);
reg('powershell', ['ps1', 'psm1', 'psd1']);
reg('r', ['r']);
reg('julia', ['jl']);
reg('elixir', ['ex', 'exs']);
reg('nim', ['nim']);
reg('coffee', ['coffee']);
reg('tcl', ['tcl']);
reg('nix', ['nix']);
reg('graphql', ['graphql', 'gql']);
reg('hcl', ['tf', 'tfvars', 'hcl']);
reg('cmake', ['cmake'], ['CMakeLists.txt']);
reg('yaml', ['yml', 'yaml']);
reg('toml', ['toml']);
reg('ini', ['ini', 'cfg', 'editorconfig'], ['.editorconfig']);
reg('properties', ['properties']);
reg('sql', ['sql']);
reg('lua', ['lua']);
reg('haskell', ['hs', 'elm', 'purs']);
reg('lisp', ['lisp', 'lsp', 'cl', 'el', 'scm', 'ss', 'rkt']);
reg('clojure', ['clj', 'cljs', 'cljc', 'edn']);
reg('erlang', ['erl', 'hrl']);
reg('tex', ['tex', 'sty']);
reg('vb', ['vb', 'vbs', 'bas']);
reg('ada', ['adb', 'ads', 'ada', 'vhd', 'vhdl']);
reg('pascal', ['pas', 'pp', 'dpr', 'lpr']);
reg('ocaml', ['ml', 'mli']);
reg('fsharp', ['fs', 'fsi', 'fsx']);
reg('fortran', ['f90', 'f95', 'f03', 'f08']);
reg('asm', ['asm', 'nasm']);
reg('xml', ['xml', 'xsl', 'xslt', 'xsd', 'plist', 'csproj', 'vcxproj', 'xaml', 'resx']);
reg('html', ['html', 'htm', 'xhtml', 'svg', 'vue', 'svelte']);

// Indeks token per karakter pertama (dibuat sekali)
new Set(Object.values(SPECS)).forEach((spec) => {
  spec.index = Object.create(null);
  for (const tok of spec.tokens) {
    for (const c of tok.first !== undefined ? tok.first : tok.open[0]) (spec.index[c] || (spec.index[c] = [])).push(tok);
  }
});

function detectLanguage(file, forced) {
  if (forced) {
    const k = forced.toLowerCase().replace(/^\./, '');
    return SPECS[k] ? k : LANG_ALIASES[k] || EXT[k] || null;
  }
  const base = path.basename(file).toLowerCase();
  if (NAMES[base]) return NAMES[base];
  const ext = path.extname(base).slice(1);
  return EXT[ext] || null;
}

/* ------------------------------------------------------------------ *
 *  Mesin penghapus komentar
 * ------------------------------------------------------------------ */
const LICENSE = /licen[sc]e|copyright|©|spdx-license|@preserve|^\/\*!/i;
const DIRECTIVE = /^(?:\/{2,3}|\/\*+|#|--|;|%|<!--)\s*(?:go:|\+build|@ts-|eslint|prettier-ignore|istanbul|c8 ignore|noqa|type:|pylint:|mypy:|pragma|-\*-|coding[:=]|vim?:|nolint|@jsx|@flow|webpack[A-Z]|#?region|#?endregion|noinspection|swiftlint:|sourceMappingURL|sourceURL|@vite-ignore|<reference|<amd)/i;
const REGEX_KEYWORDS = new Set(['return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void', 'throw',
  'case', 'do', 'else', 'yield', 'await', 'and', 'or', 'not', 'if', 'unless', 'when', 'while', 'until', 'split', 'grep']);

function matchToken(tok, src, i) {
  if (tok.lineStart && i > 0 && src[i - 1] !== '\n') return null;
  if (tok.indent) {
    for (let j = i - 1; j >= 0 && src[j] !== '\n'; j--) if (src[j] !== ' ' && src[j] !== '\t') return null;
  }
  if (tok.prev && !tok.prev.test(i === 0 ? '\n' : src[i - 1])) return null;
  if (tok.open !== undefined) {
    return src.startsWith(tok.open, i) ? { len: tok.open.length, close: tok.close } : null;
  }
  tok.re.lastIndex = i;
  const m = tok.re.exec(src);
  if (!m) return null;
  return { len: m[0].length, close: tok.closeFn ? tok.closeFn(m) : tok.close };
}

function stripComments(source, lang, opts = {}) {
  const startSpec = SPECS[lang];
  if (!startSpec) throw new Error(`Bahasa tidak didukung: ${lang}`);

  let text = source;
  let bom = '';
  if (text.charCodeAt(0) === 0xfeff) { bom = '\ufeff'; text = text.slice(1); }
  const crlf = text.includes('\r\n');
  if (crlf) text = text.replace(/\r\n/g, '\n');

  const src = text;
  const n = src.length;
  const out = [];
  let lineBuf = '';
  let removed = false;
  let i = 0;
  let cur = startSpec;
  let lastTok = '';
  let prevIdent = false;
  let noKeepUntil = -1;

  const endLine = () => {
    if (removed) {
      if (lineBuf.trim() === '') { if (opts.keepLines) out.push(''); }
      else out.push(lineBuf.replace(/[ \t]+$/, ''));
    } else out.push(lineBuf);
    lineBuf = '';
    removed = false;
  };
  const emit = (t) => {
    let s = 0;
    let k;
    while ((k = t.indexOf('\n', s)) !== -1) { lineBuf += t.slice(s, k); endLine(); s = k + 1; }
    lineBuf += t.slice(s);
  };
  const operand = () => { lastTok = '"'; prevIdent = false; };
  const code = (ch) => {
    if (ch === '\n') endLine(); else lineBuf += ch;
    if (cur.regexLiterals) {
      if (/[\w$]/.test(ch)) { lastTok = prevIdent ? lastTok + ch : ch; prevIdent = true; }
      else { prevIdent = false; if (ch !== ' ' && ch !== '\t' && ch !== '\n') lastTok = ch; }
    }
  };
  const regexAllowed = () =>
    lastTok === '' || REGEX_KEYWORDS.has(lastTok) || (lastTok.length === 1 && '(,=:[!&|?{};+-*%<>~^'.includes(lastTok));

  const keepText = (t) =>
    (opts.keepLicense && LICENSE.test(t)) || (opts.keepDirectives && DIRECTIVE.test(t));

  const scanRegex = () => {
    emit('/'); i++;
    let inClass = false;
    while (i < n) {
      const c = src[i];
      if (c === '\n') return;
      emit(c); i++;
      if (c === '\\') { if (i < n && src[i] !== '\n') { emit(src[i]); i++; } continue; }
      if (c === '[') inClass = true;
      else if (c === ']') inClass = false;
      else if (c === '/' && !inClass) break;
    }
    operand();
  };

  const scanString = (tok, m) => {
    emit(src.substr(i, m.len)); i += m.len;
    const close = m.close;
    const cl = close.length;
    while (i < n) {
      const c = src[i];
      if (tok.tmpl && c === '$' && src[i + 1] === '{') {
        emit('${'); i += 2;
        const saved = lastTok;
        lastTok = '';
        scan(true, null);
        lastTok = saved;
        if (i < n) { emit('}'); i++; }
        continue;
      }
      if (tok.esc && c === tok.esc) { emit(src.substr(i, 2)); i += 2; continue; }
      if (tok.doubled && src.startsWith(close + close, i)) { emit(close + close); i += 2 * cl; continue; }
      if (src.startsWith(close, i)) { emit(close); i += cl; return; }
      if (!tok.ml && c === '\n') return; // string tak tertutup: berhenti di akhir baris
      emit(c); i++;
    }
  };

  const blockEnd = (tok, m) => {
    const nestOpen = tok.nested ? (tok.nestOpen || tok.open) : null;
    let depth = 1;
    let j = i + m.len;
    for (;;) {
      const c = src.indexOf(m.close, j);
      if (c < 0) return n;
      if (nestOpen) {
        const o = src.indexOf(nestOpen, j);
        if (o >= 0 && o < c) { depth++; j = o + nestOpen.length; continue; }
      }
      depth--;
      j = c + m.close.length;
      if (depth === 0) break;
    }
    if (tok.toEol) { const e = src.indexOf('\n', j); j = e < 0 ? n : e; }
    return j;
  };

  const dropText = (t) => {
    removed = true;
    if (opts.keepLines) for (let q = t.split('\n').length - 1; q > 0; q--) emit('\n');
  };

  function scan(inTpl, stopStr) {
    let depth = 0;
    while (i < n) {
      const ch = src[i];
      if (stopStr && ch === '<' && src.substr(i, stopStr.length).toLowerCase() === stopStr) return;
      if (inTpl) {
        if (ch === '{') depth++;
        else if (ch === '}') { if (depth === 0) return; depth--; }
      }
      const list = cur.index[ch];
      let handled = false;
      if (list) {
        for (const tok of list) {
          const m = matchToken(tok, src, i);
          if (!m) continue;
          handled = true;
          if (tok.kind === 'lit') {
            emit(src.substr(i, m.len)); i += m.len; operand();
          } else if (tok.kind === 'string') {
            scanString(tok, m); operand();
          } else if (tok.kind === 'embed') {
            emit(src.substr(i, m.len)); i += m.len;
            const savedSpec = cur;
            const savedTok = lastTok;
            cur = SPECS[tok.spec];
            lastTok = '';
            scan(false, tok.stop);
            cur = savedSpec;
            lastTok = savedTok;
          } else if (tok.kind === 'line') {
            let end = src.indexOf('\n', i);
            if (end < 0) end = n;
            const marker = src.substr(i, m.len);
            if (opts.keepLicense && i >= noKeepUntil) {
              let gEnd = end;
              for (;;) {
                let p = gEnd + 1;
                if (p >= n) break;
                while (p < n && (src[p] === ' ' || src[p] === '\t')) p++;
                if (!src.startsWith(marker, p)) break;
                const e = src.indexOf('\n', p);
                gEnd = e < 0 ? n : e;
              }
              if (LICENSE.test(src.slice(i, gEnd))) { emit(src.slice(i, gEnd)); i = gEnd; break; }
              noKeepUntil = gEnd;
            }
            const t = src.slice(i, end);
            if (opts.keepDirectives && DIRECTIVE.test(t)) emit(t); else dropText(t);
            i = end;
          } else { // block
            const end = blockEnd(tok, m);
            const t = src.slice(i, end);
            if (keepText(t)) emit(t);
            else {
              dropText(t);
              i = end;
              if ((lineBuf.endsWith(' ') || lineBuf.endsWith('\t')) && (src[i] === ' ' || src[i] === '\t')) i++;
              break;
            }
            i = end;
          }
          break;
        }
      }
      if (handled) continue;
      if (ch === '/' && cur.regexLiterals && regexAllowed()) { scanRegex(); continue; }
      code(ch);
      i++;
    }
  }

  // Shebang selalu dipertahankan
  if (src.startsWith('#!')) {
    const e = src.indexOf('\n');
    const head = e < 0 ? src : src.slice(0, e);
    emit(head);
    i = head.length;
  }
  scan(false, null);

  if (removed) {
    out.push(lineBuf.trim() === '' ? '' : lineBuf.replace(/[ \t]+$/, ''));
  } else out.push(lineBuf);

  let result = out.join('\n');
  if (crlf) result = result.replace(/\n/g, '\r\n');
  return bom + result;
}

/* ------------------------------------------------------------------ *
 *  CLI
 * ------------------------------------------------------------------ */
const HELP = `strip-comments — hapus komentar dari file kode

Pemakaian:
  node strip-comments.js <file|folder|-> [...] [opsi]

Opsi:
  -w, --write            timpa file asli (gunakan bersama git atau --backup)
  -o, --out <folder>     tulis hasil ke folder lain (struktur dipertahankan)
      --dry-run          hanya tampilkan statistik, tidak menulis apa pun
      --backup           simpan salinan <file>.bak sebelum menimpa
      --lang <nama>      paksa bahasa (wajib untuk stdin, mis. --lang python)
      --ext a,b          saat memindai folder, hanya ekstensi ini
      --ignore a,b       nama folder tambahan yang dilewati
      --keep-license     pertahankan komentar lisensi/copyright (@preserve, /*! )
      --keep-directives  pertahankan komentar fungsional (//go:, @ts-, eslint-, noqa, dll.)
      --keep-lines       pertahankan jumlah baris (komentar diganti baris kosong)
      --list             tampilkan bahasa dan ekstensi yang didukung
  -h, --help             bantuan ini

Tanpa -w/-o/--dry-run, satu file dicetak ke stdout.`;

function parseArgs(argv) {
  const o = {
    paths: [], write: false, out: null, dry: false, backup: false, lang: null, exts: null,
    ignore: new Set(['node_modules', '.git', 'dist', 'build', 'vendor', '.venv', 'venv', '__pycache__', 'target', '.next', 'coverage']),
    keepLicense: false, keepDirectives: false, keepLines: false, list: false, help: false,
  };
  const need = (k, a) => { if (a === undefined) throw new Error(`Opsi ${k} butuh nilai`); return a; };
  for (let k = 0; k < argv.length; k++) {
    const a = argv[k];
    if (a === '-w' || a === '--write') o.write = true;
    else if (a === '-o' || a === '--out') o.out = need(a, argv[++k]);
    else if (a === '--dry-run') o.dry = true;
    else if (a === '--backup') o.backup = true;
    else if (a === '--lang') o.lang = need(a, argv[++k]);
    else if (a === '--ext') o.exts = new Set(need(a, argv[++k]).split(',').map((s) => s.trim().replace(/^\./, '')));
    else if (a === '--ignore') need(a, argv[++k]).split(',').forEach((s) => o.ignore.add(s.trim()));
    else if (a === '--keep-license') o.keepLicense = true;
    else if (a === '--keep-directives') o.keepDirectives = true;
    else if (a === '--keep-lines') o.keepLines = true;
    else if (a === '--list') o.list = true;
    else if (a === '-h' || a === '--help') o.help = true;
    else if (a === '-') o.paths.push('-');
    else if (a.startsWith('-')) throw new Error(`Opsi tidak dikenal: ${a}`);
    else o.paths.push(a);
  }
  return o;
}

function* walk(dir, ignore) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isSymbolicLink()) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!ignore.has(e.name)) yield* walk(p, ignore); }
    else if (e.isFile()) yield p;
  }
}

function listLanguages() {
  const byLang = {};
  for (const [e, s] of Object.entries(EXT)) (byLang[s] = byLang[s] || []).push('.' + e);
  for (const [nm, s] of Object.entries(NAMES)) (byLang[s] = byLang[s] || []).push(nm);
  for (const s of Object.keys(byLang).sort()) console.log(`${s.padEnd(11)} ${byLang[s].join(' ')}`);
}

function main(argv) {
  let o;
  try { o = parseArgs(argv); } catch (e) { console.error(e.message); return 1; }
  if (o.help || (argv.length === 0)) { console.log(HELP); return 0; }
  if (o.list) { listLanguages(); return 0; }
  if (o.paths.length === 0) { console.error('Tidak ada file/folder. Lihat --help.'); return 1; }

  const stripOpts = { keepLicense: o.keepLicense, keepDirectives: o.keepDirectives, keepLines: o.keepLines };

  // stdin
  if (o.paths.length === 1 && o.paths[0] === '-') {
    const lang = detectLanguage('', o.lang);
    if (!lang) { console.error('Untuk stdin, tentukan bahasa: --lang <nama> (lihat --list)'); return 1; }
    process.stdout.write(stripComments(fs.readFileSync(0, 'utf8'), lang, stripOpts));
    return 0;
  }

  const targets = [];
  let anyDir = false;
  for (const p of o.paths) {
    let st;
    try { st = fs.statSync(p); } catch { console.error(`Tidak ditemukan: ${p}`); return 1; }
    if (st.isDirectory()) {
      anyDir = true;
      for (const f of walk(p, o.ignore)) {
        if (o.exts && !o.exts.has(path.extname(f).slice(1).toLowerCase())) continue;
        targets.push({ file: f, base: p });
      }
    } else targets.push({ file: p, base: path.dirname(p) });
  }

  const toStdout = !o.write && !o.out && !o.dry;
  if (toStdout && (anyDir || targets.length !== 1)) {
    console.error('Untuk banyak file/folder, gunakan -w, -o <folder>, atau --dry-run.');
    return 1;
  }

  let scanned = 0, changed = 0, saved = 0, skipped = 0;
  for (const { file, base } of targets) {
    const buf = fs.readFileSync(file);
    if (buf.subarray(0, 8000).includes(0)) { skipped++; continue; } // biner
    const lang = detectLanguage(file, o.lang);
    if (!lang) { skipped++; if (!anyDir) console.error(`Bahasa tidak dikenali: ${file} (pakai --lang)`); continue; }
    const text = buf.toString('utf8');
    if (!Buffer.from(text, 'utf8').equals(buf)) { console.error(`Lewati (bukan UTF-8): ${file}`); skipped++; continue; }

    const result = stripComments(text, lang, stripOpts);
    scanned++;
    const diff = text.length - result.length;
    if (result !== text) { changed++; saved += diff; }

    if (toStdout) { process.stdout.write(result); continue; }
    if (o.dry) { if (result !== text) console.log(`${file}  (-${diff} karakter)`); continue; }
    if (o.out) {
      const dest = path.join(o.out, path.relative(base, file));
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, result);
    } else if (result !== text) {
      if (o.backup) fs.copyFileSync(file, file + '.bak');
      fs.writeFileSync(file, result);
    }
  }
  if (!toStdout) {
    console.error(`Selesai: ${scanned} file diproses, ${changed} berubah, ${saved} karakter dihapus, ${skipped} dilewati.`);
  }
  return 0;
}

module.exports = { stripComments, detectLanguage, SPECS };
if (require.main === module) process.exitCode = main(process.argv.slice(2));
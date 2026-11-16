/* Selbstlernkurs e und ln – gemeinsamer Rahmen aller Seiten.
 *
 * Jede Seite bindet nur _Quellen/kurs.css und _Quellen/kurs.js ein; alles
 * andere kommt von hier, ohne Nachladen von fremden Servern:
 *
 *   - Kopf und Fuß (Home, Kapitel, zurück/weiter) aus der Liste SEITEN
 *   - Formelsatz: \( … \) und \[ … \] im Text werden beim Laden gesetzt,
 *     nachträglich eingefügter Text mit Kurs.formeln(element)
 *   - Funktionsgraphen: Kurs.graph(svg, {...})
 *   - Fortschritt: Kurs.geschafft() hakt die Seite ab; gespeichert nur im
 *     Browser dieses Geräts, ohne Konto und ohne Übertragung (CLAUDE.md §5b)
 *
 * Die Reihenfolge der Seiten steht NUR hier. Kommt eine Seite dazu, wird sie
 * in SEITEN eingetragen – Home-Seite und Weiter-Knöpfe ziehen nach.
 */
(function () {
'use strict';

var KURS = 'e-Funktion und ln-Funktion';

var KAPITEL = [
  { nr: '1', titel: 'Die natürliche Exponentialfunktion', seiten: [
    { datei: '1_1_Exponentialfunktion.html', nr: '1.1', titel: 'Die Zahl e',
      text: 'Welche Exponentialfunktion stimmt mit ihrer Ableitung überein?' },
    { datei: '1_2_Eigenschaften.html', nr: '1.2', titel: 'Eigenschaften der e-Funktion',
      text: 'Definitions- und Wertemenge, Monotonie, Transformationen' },
    { datei: '1_3_Grenzwertbestimmung.html', nr: '1.3', titel: 'Grenzwerte der e-Funktion',
      text: 'Verhalten im Unendlichen, Vergleich mit Potenzfunktionen' },
    { datei: '1_4_Ueben.html', nr: '1.4', titel: 'Üben',
      text: 'Aufgaben zur natürlichen Exponentialfunktion' } ] },
  { nr: '2', titel: 'Die Umkehrfunktion graphisch', seiten: [
    { datei: '2_UmkehrfunktionGraphisch.html', nr: '2', titel: 'Umkehrfunktion graphisch',
      text: 'Vom Funktionswert zurück zum x-Wert: Spiegeln an der Winkelhalbierenden' } ] },
  { nr: '3', titel: 'Die natürliche Logarithmusfunktion', seiten: [
    { datei: '3_1_lnFunktion.html', nr: '3.1', titel: 'Die ln-Funktion',
      text: 'Die Umkehrfunktion der e-Funktion' },
    { datei: '3_2_Eigenschaften.html', nr: '3.2', titel: 'Eigenschaften der ln-Funktion',
      text: 'Definitions- und Wertemenge, Nullstelle, Transformationen' },
    { datei: '3_3_Grenzwertbestimmung.html', nr: '3.3', titel: 'Grenzwerte der ln-Funktion',
      text: 'Verhalten am Rand, Vergleich mit Potenzfunktionen' },
    { datei: '3_4_Ueben.html', nr: '3.4', titel: 'Üben',
      text: 'Aufgaben zur natürlichen Logarithmusfunktion' } ] },
  { nr: '4', titel: 'Die Umkehrfunktion rechnerisch', seiten: [
    { datei: '4_1_UmkehrfunktionRechnerisch.html', nr: '4.1', titel: 'Umkehrfunktion rechnerisch',
      text: 'Den Term der Umkehrfunktion bestimmen' },
    { datei: '4_2_Umkehrbarkeit.html', nr: '4.2', titel: 'Kriterium der Umkehrbarkeit',
      text: 'Wann ist eine Funktion umkehrbar?' },
    { datei: '4_3_Ableitungen.html', nr: '4.3', titel: 'Umkehrbarkeit und Ableitung',
      text: 'Strenge Monotonie mit der Ableitung nachweisen' } ] }
];

var SEITEN = [];
KAPITEL.forEach(function (k) {
  k.seiten.forEach(function (s) { s.kapitel = k; SEITEN.push(s); });
});

/* ------------------------------------------------------------ Fortschritt */

var SPEICHER = 'kurs-e-ln-fortschritt';

function fortschritt() {
  try { return JSON.parse(localStorage.getItem(SPEICHER)) || {}; }
  catch (e) { return {}; }
}
function speichern(stand) {
  try { localStorage.setItem(SPEICHER, JSON.stringify(stand)); } catch (e) { /* privat */ }
}

function dateiname() {
  var teile = decodeURIComponent(location.pathname).split('/');
  return teile[teile.length - 1] || 'index.html';
}

/* ------------------------------------------------------------ Formeln
 * Gesetzt von MathJax (mathjax/tex-svg.js, lokal). Im Quelltext stehen die
 * Formeln als TeX in \( … \) und \[ … \]. Was erst später eingefügt wird
 * (Rückmeldungen), setzt Kurs.formeln(element); Kurs.formel(tex) liefert eine
 * einzelne Formel als HTML. Dezimalkomma als {,}, sonst setzt TeX Abstand.
 */
function esc(t) {
  return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formel(tex, abgesetzt) {
  if (window.MathJax && MathJax.tex2svg) {
    return MathJax.tex2svg(tex, { display: !!abgesetzt }).outerHTML;
  }
  return esc(tex);
}

function formeln(wurzel) {
  if (window.MathJax && MathJax.typeset) {
    try { MathJax.typeset([wurzel || document.body]); } catch (e) { /* Formel bleibt als TeX stehen */ }
  }
}

/* ------------------------------------------------------------ Graphen
 * Kurs.graph(svg, {
 *   x: [-1, 8], y: [-3, 3],          sichtbarer Bereich
 *   einheit: 28,                     Pixel je Einheit (Standard 28)
 *   kurven: [{ f: Math.log, farbe: 'blau', name: 'f(x) = ln(x)', bei: 5 }],
 *   punkte: [{ x: 1, y: 0, farbe: 'rot' }]
 * })
 */
var FARBE = { blau: 'var(--k-blau)', rot: 'var(--k-rot)', gruen: 'var(--k-gruen)',
  orange: 'var(--k-orange)', lila: 'var(--k-lila)', tuerkis: 'var(--k-tuerkis)',
  pink: 'var(--k-pink)', grau: 'var(--leise)' };
var SVG = 'http://www.w3.org/2000/svg';

function el(name, attr, eltern) {
  var e = document.createElementNS(SVG, name);
  for (var k in attr) e.setAttribute(k, attr[k]);
  if (eltern) eltern.appendChild(e);
  return e;
}

/* Kleine Formel in einem SVG-Text, ohne MathJax: Buchstaben kursiv, Ziffern
 * und Zeichen aufrecht, '^x' / '^{-x}' hoch- und '_y' tiefgestellt.
 * Beispiel: 'f(x) = e^x', 'S_y(0|1)', 'G_f neu'. */
function svgFormel(t, quelle) {
  /* Mit MathJax: dieselbe Formel wie im Text, als verschachteltes SVG an der
     Stelle des Textes. Wörter (ab drei Buchstaben, außer ln …) setzt MathJax
     aufrecht als \text{…}. */
  if (window.MathJax && MathJax.tex2svg) {
    var tex = quelle.replace(/[A-Za-zäöüÄÖÜß]{3,}/g, function (w) {
      return /^(sin|cos|tan|lim|log)$/.test(w) ? '\\' + w : '\\text{' + w + '}';
    }).replace(/\bln\b/g, '\\ln').replace(/ (?=\\text)/g, '\\ ');
    var innen = MathJax.tex2svg(tex, { display: false }).querySelector('svg');
    if (innen) {
      var EX = 6.8;                              /* 1ex in Einheiten des Graphen bei 15px */
      var b = parseFloat(innen.getAttribute('width')) * EX;
      var h = parseFloat(innen.getAttribute('height')) * EX;
      var tief = -parseFloat((innen.style.verticalAlign || '0').replace('ex', '')) * EX;
      var x = parseFloat(t.getAttribute('x')), y = parseFloat(t.getAttribute('y'));
      var anker = t.getAttribute('text-anchor');
      if (anker === 'end') x -= b; else if (anker === 'middle') x -= b / 2;
      innen.setAttribute('x', x);
      innen.setAttribute('y', y - h + tief);
      innen.setAttribute('width', b);
      innen.setAttribute('height', h);
      innen.style.verticalAlign = '';
      innen.style.color = t.style.fill;
      innen.setAttribute('class', 'formel-im-graph');
      /* heller Grund dahinter, damit Gitter und Skala die Formel nicht stören */
      var grund = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      grund.setAttribute('x', x - 2); grund.setAttribute('y', y - h + tief - 1);
      grund.setAttribute('width', b + 4); grund.setAttribute('height', h + 2);
      grund.setAttribute('rx', 3); grund.setAttribute('class', 'formel-grund');
      t.parentNode.insertBefore(grund, t);
      t.parentNode.insertBefore(innen, t);
      t.parentNode.removeChild(t);
      return;
    }
  }
  var NSV = 'http://www.w3.org/2000/svg', i = 0, versatz = 0;
  function stueck(txt, stufe) {          /* stufe: 0 normal, 1 hoch, -1 tief */
    var dy = stufe === 1 ? -6 : stufe === -1 ? 4 : 0;
    (txt.match(/[A-Za-zäöüÄÖÜß]+|[^A-Za-zäöüÄÖÜß]+/g) || []).forEach(function (teil, n) {
      var s = document.createElementNS(NSV, 'tspan');
      s.textContent = teil.replace(/-/g, '−');
      /* Variablen kursiv; ln, sin … und ganze Wörter aufrecht */
      var aufrecht = !/[A-Za-z]/.test(teil) || /^(ln|log|sin|cos|tan|lim)$/.test(teil) || teil.length >= 3;
      s.setAttribute('font-style', aufrecht ? 'normal' : 'italic');
      if (stufe) s.setAttribute('font-size', '10');
      if (n === 0 && dy - versatz) s.setAttribute('dy', dy - versatz);
      versatz = dy;
      t.appendChild(s);
    });
  }
  var normal = '';
  while (i < quelle.length) {
    var z = quelle[i];
    if (z === '^' || z === '_') {
      if (normal) { stueck(normal, 0); normal = ''; }
      var inhalt;
      if (quelle[i + 1] === '{') { var e = quelle.indexOf('}', i); inhalt = quelle.slice(i + 2, e); i = e + 1; }
      else { inhalt = quelle[i + 1]; i += 2; }
      stueck(inhalt, z === '^' ? 1 : -1);
    } else { normal += z; i++; }
  }
  if (normal) stueck(normal, 0);
}

function graph(svg, o) {
  while (svg.firstChild) svg.removeChild(svg.firstChild);   /* neu zeichnen erlaubt */
  /* einheitY: eigener Maßstab für die y-Achse (Standard: wie x) */
  var u = o.einheit || 28, uy = o.einheitY || u, x0 = o.x[0], x1 = o.x[1], y0 = o.y[0], y1 = o.y[1];
  var rand = 14, B = (x1 - x0) * u + 2 * rand, H = (y1 - y0) * uy + 2 * rand;
  function X(x) { return rand + (x - x0) * u; }
  function Y(y) { return rand + (y1 - y) * uy; }
  svg.setAttribute('viewBox', '0 0 ' + B + ' ' + H);
  svg.setAttribute('class', ((svg.getAttribute('class') || '') + ' graph').trim());
  svg.style.maxWidth = B * 1.25 + 'px';
  var id = 'pf' + Math.random().toString(36).slice(2, 8);
  var defs = el('defs', {}, svg);
  var mk = el('marker', { id: id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7,
    markerHeight: 7, orient: 'auto-start-reverse' }, defs);
  el('path', { d: 'M0 0L10 5L0 10z', 'class': 'achse-spitze' }, mk);
  var gitter = '';
  for (var gx = Math.ceil(x0); gx <= x1; gx++) gitter += 'M' + X(gx) + ' ' + Y(y1) + 'V' + Y(y0);
  var gitterY = o.gitterY || 1;
  for (var gy = Math.ceil(y0 / gitterY) * gitterY; gy <= y1; gy += gitterY) gitter += 'M' + X(x0) + ' ' + Y(gy) + 'H' + X(x1);
  el('path', { d: gitter, 'class': 'gitter' }, svg);
  if (y0 <= 0 && y1 >= 0) el('line', { x1: X(x0) - rand / 2, y1: Y(0), x2: X(x1) + rand / 2, y2: Y(0), 'class': 'achse', 'marker-end': 'url(#' + id + ')' }, svg);
  if (x0 <= 0 && x1 >= 0) el('line', { x1: X(0), y1: Y(y0) + rand / 2, x2: X(0), y2: Y(y1) - rand / 2, 'class': 'achse', 'marker-end': 'url(#' + id + ')' }, svg);
  function text(t, x, y, cls, anker) {
    var e = el('text', { x: x, y: y, 'class': cls || 'skala', 'text-anchor': anker || 'middle' }, svg);
    e.textContent = t; return e;
  }
  text('x', X(x1) + 2, Y(0) - 7, 'achsname', 'end');
  text('y', X(0) + 8, Y(y1) - 1, 'achsname', 'start');
  var schritt = o.skala || 1;
  for (var sx = Math.ceil(x0 / schritt) * schritt; sx < x1; sx += schritt)
    if (Math.abs(sx) > 1e-9) text(String(sx).replace('-', '−'), X(sx), Y(0) + 14);
  var schrittY = o.skalaY || schritt;
  for (var sy = Math.ceil(y0 / schrittY) * schrittY; sy < y1; sy += schrittY)
    if (Math.abs(sy) > 1e-9) text(String(sy).replace('-', '−'), X(0) - 5, Y(sy) + 4, 'skala', 'end');
  var clip = 'cl' + id;
  el('rect', { x: X(x0), y: Y(y1), width: X(x1) - X(x0), height: Y(y0) - Y(y1) },
     el('clipPath', { id: clip }, defs));
  var pfade = [];
  (o.kurven || []).forEach(function (k) {
    var d = '', schritte = 600, an = false;
    for (var s = 0; s <= schritte; s++) {
      var x = x0 + (x1 - x0) * s / schritte, y = k.f(x);
      if (!isFinite(y) || y < y0 - 20 || y > y1 + 20) { an = false; continue; }
      d += (an ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(y).toFixed(1);
      an = true;
    }
    var pfad = el('path', { d: d, 'class': 'kurve', stroke: FARBE[k.farbe] || k.farbe || FARBE.blau,
                 'clip-path': 'url(#' + clip + ')' }, svg);
    pfade.push(pfad);
    if (k.blass) pfad.setAttribute('stroke-opacity', '.25');
    if (k.name) {
      var bx = k.bei !== undefined ? k.bei : x1 - 1.5;
      /* Standard: links über dem Punkt; anker 'start': rechts daneben;
         ort: [x, y] – frei im Koordinatensystem, linksbündig (wie auf dem AB) */
      var t = k.ort ? text('', X(k.ort[0]), Y(k.ort[1]), 'kurvenname', 'start')
            : k.anker === 'start' ? text('', X(bx) + 10, Y(k.f(bx)) + 5, 'kurvenname', 'start')
                                  : text('', X(bx) - 4, Y(k.f(bx)) + (k.dy || -8), 'kurvenname', 'end');
      t.style.fill = FARBE[k.farbe] || FARBE.blau;
      svgFormel(t, k.name);
    }
  });
  (o.punkte || []).forEach(function (p) {
    el('circle', { cx: X(p.x), cy: Y(p.y), r: 3.5, fill: FARBE[p.farbe] || FARBE.rot }, svg);
    if (p.name) {                       /* Beschriftung, z. B. 'S_y(0|1)'; dx/dy verschieben */
      var t = text('', X(p.x) + (p.dx || 8), Y(p.y) + (p.dy || -8), 'kurvenname', p.anker || 'start');
      t.style.fill = FARBE[p.farbe] || FARBE.rot;
      svgFormel(t, p.name);
    }
  });
  /* für Ergänzungen der Seite: Umrechnung in Pixel und Zeichenhilfe */
  return { X: X, Y: Y, pfade: pfade, el: function (name, attr) { return el(name, attr, svg); } };
}

/* ------------------------------------------------------------ Rahmen */

var HAUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5M5.5 9.8V20h4.8v-5.5h3.4V20h4.8V9.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>';

var LINKS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var RECHTS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function rahmen() {
  var hier = dateiname();
  var nr = -1;
  SEITEN.forEach(function (s, i) { if (s.datei === hier) nr = i; });
  if (nr < 0) return;                               /* Home-Seite baut sich selbst */
  var s = SEITEN[nr], vor = SEITEN[nr - 1], nach = SEITEN[nr + 1];
  document.title = s.nr + ' ' + s.titel + ' · ' + KURS;

  var kopf = document.createElement('header');
  kopf.className = 'kopf';
  kopf.innerHTML =
    '<p class="kapitelzeile"><span>Kapitel ' + s.kapitel.nr + ' · ' + s.kapitel.titel + '</span>' +
    '<span class="stand" title="Seite ' + (nr + 1) + ' von ' + SEITEN.length + '">' + (nr + 1) + ' / ' + SEITEN.length + '</span></p>' +
    '<h1><span class="nr">' + s.nr + '</span> ' + s.titel + '</h1>';
  var main = document.querySelector('main');
  main.parentNode.insertBefore(kopf, main);

  var fuss = document.createElement('nav');
  fuss.className = 'blaettern';
  fuss.setAttribute('aria-label', 'Blättern');
  fuss.innerHTML =
    '<a class="haus" href="index.html" title="Zur Übersicht">' + HAUS + '<span>Übersicht</span></a>' +
    '<span class="pfeile">' +
    (vor ? '<a class="zurueck" href="' + vor.datei + '" title="' + vor.nr + ' ' + vor.titel + '">' + LINKS + '<span>Zurück</span></a>' : '') +
    /* „Weiter“ steht immer da, gesperrt mit Schloss, bis die Seite bei diesem
       Besuch gelöst ist (Kurs.geschafft); die Übersicht ist immer offen. */
    (nach ? '<a class="weiter" data-href="' + nach.datei + '" aria-disabled="true" role="link">' +
            '<span>Weiter</span>' + RECHTS + '</a>'
          : '') +                       /* letzte Seite: zurück geht es über das Haus */
    '</span>' +
    (nach ? '<p class="als-naechstes"><span class="gesperrt-text" aria-live="polite"></span>' +
            '<span class="fertig-text">Als Nächstes: ' + nach.nr + ' ' + nach.titel + '</span></p>' : '');
  main.parentNode.insertBefore(fuss, main.nextSibling);
  /* Wer das blasse „Weiter“ antippt, erfährt, warum es nicht geht */
  var weiter = fuss.querySelector('.weiter');
  if (weiter) weiter.addEventListener('click', function () {
    if (!weiter.hasAttribute('aria-disabled')) return;
    var t = fuss.querySelector('.gesperrt-text');
    t.textContent = '„Weiter“ wird frei, sobald die Seite gelöst ist.';
    clearTimeout(weiter._aus);
    weiter._aus = setTimeout(function () { t.textContent = ''; }, 4000);
  });

  if (document.body.hasAttribute('data-ohne-aufgabe')) geschafft();
}

function geschafft() {
  var stand = fortschritt();
  stand[dateiname()] = true;
  speichern(stand);
  document.body.classList.add('geschafft');
  zeigeKaesten();
  weiterFrei();
}

/* Eine Seite, die auf der Übersicht abgehakt ist (gelöst oder von Hand),
   steht beim Öffnen vollständig da: alle Schritte offen, alle Kästen sichtbar,
   „Weiter“ frei. Die Eingabefelder bleiben leer. Was eine Seite erst nach dem
   Lösen zeichnet, zeichnet sie in ihrer Funktion window.kursKomplett nach. */
function komplett() {
  document.body.classList.add('geschafft', 'komplett');
  Array.prototype.forEach.call(document.querySelectorAll('.schritt'), function (e) { e.classList.add('offen'); });
  Array.prototype.forEach.call(document.querySelectorAll('.ausblenden'), function (e) { e.classList.add('zeigen'); });
  zeigeKaesten();
  weiterFrei();
  var main = document.querySelector('main');
  if (main) {
    var p = document.createElement('p');
    p.className = 'komplett-hinweis';
    p.textContent = 'Diese Seite ist abgehakt. Deshalb ist alles aufgeklappt; die Aufgaben können Sie trotzdem noch einmal bearbeiten.';
    main.insertBefore(p, main.firstChild);
  }
  if (typeof window.kursKomplett === 'function') window.kursKomplett();
}

function weiterFrei() {
  var w = document.querySelector('.blaettern .weiter');
  if (w) {
    var t = document.querySelector('.blaettern .gesperrt-text');
    if (t) t.textContent = '';
    w.setAttribute('href', w.getAttribute('data-href'));
    w.removeAttribute('aria-disabled');
    w.removeAttribute('title');
  }
}

function zeigeKaesten() {
  Array.prototype.forEach.call(document.querySelectorAll('.merke.verdeckt, .ab-hinweis.verdeckt'), function (m) {
    m.classList.remove('verdeckt');
  });
}

/* ------------------------------------------------------------ Home-Seite */

function home(ziel) {
  var stand = fortschritt();
  var erledigt = SEITEN.filter(function (s) { return stand[s.datei]; }).length;
  var naechste = SEITEN.filter(function (s) { return !stand[s.datei]; })[0];
  var html = '<div class="gesamt"><div class="balken"><span style="width:' +
    Math.round(100 * erledigt / SEITEN.length) + '%"></span></div>' +
    '<p>' + erledigt + ' von ' + SEITEN.length + ' Seiten bearbeitet</p>' +
    (naechste ? '<a class="knopf" href="' + naechste.datei + '">' +
      (erledigt ? 'Weiter mit ' : 'Beginnen mit ') + naechste.nr + ' ' + naechste.titel + ' →</a>' : '') +
    '</div>';
  KAPITEL.forEach(function (k) {
    var fertig = k.seiten.filter(function (s) { return stand[s.datei]; }).length;
    html += '<section class="kapitel"><h2><span class="nr">' + k.nr + '</span> ' + k.titel +
      '<span class="zahl">' + fertig + '/' + k.seiten.length + '</span></h2><ul>';
    k.seiten.forEach(function (s) {
      var i = SEITEN.indexOf(s);
      var frei = i === 0 || !!stand[SEITEN[i - 1].datei];
      /* Der Haken ist ein eigener Knopf: Von Hand gesetzt zählt er wie eine
         gelöste Seite – etwa an einem neuen Gerät, auf dem nichts gespeichert ist. */
      /* Frei ist eine Seite, wenn die vorige abgehakt ist – gelöst oder von Hand */
      var inhalt = '<span class="nr">' + s.nr + '</span><span class="was"><b>' + s.titel + '</b>' +
        '<small>' + s.text + '</small></span>';
      html += '<li class="' + (stand[s.datei] ? 'erledigt' : '') + (frei ? '' : ' gesperrt') + '">' +
        '<button type="button" class="haken" data-datei="' + s.datei + '" aria-pressed="' + !!stand[s.datei] + '"' +
        (frei ? '' : ' disabled') +
        ' title="' + (stand[s.datei] ? 'Haken entfernen' : 'Als bearbeitet abhaken') + '"' +
        ' aria-label="' + s.nr + ' ' + s.titel + (stand[s.datei] ? ': bearbeitet' : ': offen') + '"></button>' +
        (frei ? '<a href="' + s.datei + '">' + inhalt + '</a>'
              : '<span class="zu" title="Frei, sobald ' + SEITEN[i - 1].nr + ' abgehakt ist">' + inhalt + '</span>') +
        '</li>';
    });
    html += '</ul></section>';
  });
  ziel.innerHTML = html;
  Array.prototype.forEach.call(ziel.querySelectorAll('button.haken'), function (b) {
    b.addEventListener('click', function () {
      var st = fortschritt(), d = b.getAttribute('data-datei');
      if (st[d]) delete st[d]; else st[d] = true;
      speichern(st);
      home(ziel);
    });
  });
  formeln(ziel);
}

function zuruecksetzen() {
  if (confirm('Den Fortschritt auf diesem Gerät löschen?')) {
    speichern({});
    var ziel = document.getElementById('uebersicht');
    if (ziel) home(ziel);
  }
}

/* ------------------------------------------------------------ Hinweis aufs Arbeitsblatt
 * Überall dasselbe Zeichen „✎ AB“ über dem, was auf das Theorieblatt
 * übertragen wird – der Abschnitt dort trägt die Nummer der Kursseite.
 *   <section class="merke" data-ab="1.1">          – Hinweis über dem Kasten
 *   <p class="ab-hinweis" data-ab="4.1">Text</p>   – eigener Text, Zeichen davor
 * Ein verdeckter Kasten verdeckt seinen Hinweis mit; Kurs.geschafft() zeigt beide.
 */
var AB = 'AB';   /* ohne Nummer – passt zu jeder AB-Nummerierung */
var STIFT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/></svg>';

function abHinweise(wurzel) {
  var marke = '<span class="ab-marke">' + STIFT + AB + '</span>';
  Array.prototype.forEach.call(wurzel.querySelectorAll('.merke[data-ab]'), function (m) {
    if (m.previousElementSibling && m.previousElementSibling.classList.contains('ab-hinweis')) return;
    var p = document.createElement('p');
    p.className = 'ab-hinweis' + (m.classList.contains('verdeckt') ? ' verdeckt' : '');
    p.innerHTML = marke + '<span>Ergänzen Sie auf Ihrem Arbeitsblatt den Abschnitt ' + m.getAttribute('data-ab') + '.</span>';
    m.parentNode.insertBefore(p, m);
  });
  Array.prototype.forEach.call(wurzel.querySelectorAll('p.ab-hinweis[data-ab]'), function (p) {
    if (p.querySelector('.ab-marke')) return;
    p.innerHTML = marke + '<span>' + p.innerHTML + '</span>';
  });
}

/* ------------------------------------------------------------ Bausteine
 * Zeichen zum Antippen, die sich schlecht tippen lassen:
 *   <div class="bausteine" data-zeichen="ℝ ℝ⁺ ∞ [ ] ;"></div>
 * Ein Baustein landet an der Cursorstelle des zuletzt gewählten Feldes im
 * selben Abschnitt (.aufgabe). Kurs.normal() macht daraus prüfbaren Text.
 */
function bausteine(wurzel) {
  Array.prototype.forEach.call(wurzel.querySelectorAll('.bausteine[data-zeichen]'), function (leiste) {
    var bereich = leiste.closest('.aufgabe') || document.body;
    var zuletzt = null;
    bereich.addEventListener('focusin', function (e) {
      if (e.target.matches('input[type=text]')) zuletzt = e.target;
    });
    leiste.getAttribute('data-zeichen').split(' ').forEach(function (z) {
      if (!z) return;
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = z;
      /* mousedown abfangen: sonst verliert das Feld den Fokus und am Tablet
         klappt die Tastatur zu */
      b.addEventListener('mousedown', function (e) { e.preventDefault(); });
      b.addEventListener('click', function () {
        var f = zuletzt || bereich.querySelector('input[type=text]');
        if (!f) return;
        var a = f.selectionStart != null ? f.selectionStart : f.value.length;
        var e = f.selectionEnd != null ? f.selectionEnd : f.value.length;
        f.value = f.value.slice(0, a) + z + f.value.slice(e);
        f.focus();
        f.setSelectionRange(a + z.length, a + z.length);
      });
      leiste.appendChild(b);
    });
  });
}

/* ------------------------------------------------------------ Übungsseite
 * Kurs.uebung(ziel, aufgaben) baut die Aufgabenliste einer Seite „Üben“.
 * Je Aufgabe:
 *   { titel: 'Aufgabe 1', stufe: '●○○', stelle: 'Buch S. 45, Nr. 3 a–c',
 *     art: 'auslage' }                     – Lösung liegt aus, selbst abhaken
 *   { …, art: 'ergebnis', felder: [         – Endergebnis eingeben, wird geprüft
 *       { frage: 'a)\\( x \\approx \\)', wert: 1.39, toleranz: 0.005 } ] }
 *   Ein Feld mit 'optionen: ["0", "+∞", "−∞"], richtig: "0"' wird eine Auswahl;
 *   Felder mit gleicher 'gruppe: "c)"' stehen zusammen in einer Zeile.
 *   { …, art: 'loesung', loesung: '…' }    – Lösung zum Aufdecken, dann abhaken
 *   vertiefen: true                        – unter „Zum Vertiefen“, zählt nicht
 * Sind alle Pflichtaufgaben erledigt bzw. richtig: Kurs.geschafft().
 */
function uebung(ziel, aufgaben) {
  var pflicht = aufgaben.filter(function (a) { return !a.vertiefen; });
  var html = '';
  function karte(a, i) {
    var h = '<section class="aufgabe uebung" data-nr="' + i + '"><h2>' + a.titel +
      (a.stufe ? ' <span class="stufe">' + a.stufe + '</span>' : '') + '</h2>' +
      '<p class="stelle">' + a.stelle + '</p>' + (a.text ? '<p>' + a.text + '</p>' : '');
    if (a.art === 'ergebnis') {
      h += '<p class="hinweis-klein">' + (a.hinweis || 'Geben Sie die Endergebnisse ein.') + '</p><div class="ergebnisse">';
      var gruppe = null;
      a.felder.forEach(function (f, j) {
        /* 'gruppe: "c)"' – Felder einer Teilaufgabe stehen in einer Zeile */
        if (f.gruppe !== undefined && f.gruppe !== gruppe) {
          h += (gruppe !== null ? '</div>' : '') + '<div class="ergebnis-zeile"><b>' + f.gruppe + '</b>';
          gruppe = f.gruppe;
        }
        h += '<label class="ergebnis">' + f.frage + ' ';
        if (f.optionen) {
          h += '<select data-feld="' + j + '"><option value="">…</option>' +
               f.optionen.map(function (o) { return '<option>' + o + '</option>'; }).join('') + '</select>';
        } else {
          h += '<input type="text" inputmode="decimal" autocomplete="off" data-feld="' + j + '">';
        }
        h += '</label>';
      });
      if (gruppe !== null) h += '</div>';
      h += '</div><button type="button" class="pruefen">Prüfen</button><div class="rueckmeldung"></div>';
    } else if (a.art === 'loesung') {
      h += '<button type="button" class="zweit loesung-knopf">Lösung anzeigen</button>' +
           '<div class="loesung">' + a.loesung + '</div>' +
           '<label class="haekchen erledigt-haken"><input type="checkbox"> ' +
           'Erledigt und mit der Lösung verglichen</label>';
    } else {
      h += '<label class="haekchen erledigt-haken"><input type="checkbox"> ' +
           'Erledigt und mit der ausgelegten Lösung verglichen</label>';
    }
    return h + '</section>';
  }
  aufgaben.forEach(function (a, i) {
    if (a.vertiefen && !aufgaben.slice(0, i).some(function (b) { return b.vertiefen; }))
      html += '<div class="vertiefen-balken"><h2 class="vertiefen-titel">Zum Vertiefen</h2>';
    html += karte(a, i);
  });
  if (aufgaben.some(function (a) { return a.vertiefen; })) html += '</div>';
  ziel.innerHTML = html;

  var erledigt = {};
  function pruefeAlles() {
    if (pflicht.every(function (a) { return erledigt[aufgaben.indexOf(a)]; })) geschafft();
  }
  Array.prototype.forEach.call(ziel.querySelectorAll('section.uebung'), function (sec) {
    var i = +sec.getAttribute('data-nr'), a = aufgaben[i];
    if (a.art === 'ergebnis') {
      sec.querySelector('.pruefen').addEventListener('click', function () {
        var alle = true;
        Array.prototype.forEach.call(sec.querySelectorAll('[data-feld]'), function (inp) {
          var f = a.felder[+inp.getAttribute('data-feld')], ok;
          if (f.optionen) ok = inp.value === f.richtig;
          else { var z = zahl(inp.value); ok = !isNaN(z) && Math.abs(z - f.wert) <= (f.toleranz || 1e-9); }
          inp.className = ok ? 'richtig' : 'falsch';
          if (!ok) alle = false;
        });
        var rm = sec.querySelector('.rueckmeldung');
        rm.className = 'rueckmeldung ' + (alle ? 'gut' : 'nochmal');
        rm.textContent = alle ? 'Richtig!' : 'Noch nicht alles richtig. Prüfen Sie Ihre Rechnung.';
        erledigt[i] = alle;
        pruefeAlles();
      });
    } else {
      var lk = sec.querySelector('.loesung-knopf');
      if (lk) lk.addEventListener('click', function () {
        var l = sec.querySelector('.loesung');
        l.classList.toggle('zeigen');
        lk.textContent = l.classList.contains('zeigen') ? 'Lösung verbergen' : 'Lösung anzeigen';
      });
      sec.querySelector('input[type=checkbox]').addEventListener('change', function (e) {
        erledigt[i] = e.target.checked;
        sec.classList.toggle('abgehakt', e.target.checked);
        pruefeAlles();
      });
    }
  });
  formeln(ziel);
}

/* Eingabe vergleichbar machen: klein, ohne Leerzeichen, Sonderzeichen als Text */
function normal(text) {
  return String(text).toLowerCase().replace(/\s+/g, '')
    .replace(/∞|unendlich|infty/g, 'inf').replace(/ℝ/g, 'r')
    .replace(/⁺/g, '+').replace(/⁻/g, '-').replace(/−/g, '-');
}

/* ------------------------------------------------------------ Start */

/* Zahl aus einer Eingabe – Komma oder Punkt, Leerzeichen egal; NaN, wenn keine */
function zahl(text) {
  var t = String(text).replace(/\s+/g, '').replace(',', '.').replace('−', '-');
  return /^[-+]?(\d+\.?\d*|\.\d+)$/.test(t) ? parseFloat(t) : NaN;
}
/* Zahl für die Anzeige – deutsches Komma */
function komma(x, stellen) { return x.toFixed(stellen).replace('.', '{,}'); }   /* für TeX */

window.Kurs = { formeln: formeln, formel: formel, graph: graph, geschafft: geschafft, abHinweise: abHinweise,
                normal: normal, uebung: uebung,
                zahl: zahl, komma: komma,
                home: home, zuruecksetzen: zuruecksetzen, seiten: SEITEN };

function start() {
  abHinweise(document.body);
  bausteine(document.body);
  rahmen();
  var ziel = document.getElementById('uebersicht');
  if (ziel) home(ziel);
  else if (fortschritt()[dateiname()]) komplett();
  formeln(document.body);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
})();

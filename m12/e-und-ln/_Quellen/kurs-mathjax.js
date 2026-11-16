/* Einstellungen für MathJax (mathjax/tex-svg.js, lokal – nichts von fremden
 * Servern). Wird in jeder Seite VOR mathjax/tex-svg.js eingebunden.
 * Gesetzt werden \( … \), \[ … \] und $$ … $$. Das Setzen der ganzen Seite
 * übernimmt kurs.js (Kurs.formeln), nachdem Kopf und Kästen stehen. */
window.MathJax = {
  tex: {
    inlineMath: [['\\(', '\\)']],
    displayMath: [['\\[', '\\]'], ['$$', '$$']]
  },
  svg: { fontCache: 'global' },
  options: { enableMenu: false },
  startup: { typeset: false }
};

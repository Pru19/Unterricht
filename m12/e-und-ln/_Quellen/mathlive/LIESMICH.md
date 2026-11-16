# MathLive 0.105.3

Unverändert aus dem npm-Paket `mathlive@0.105.3` (`mathlive.min.js` und die
Schriften in `fonts/`), Lizenz MIT (`LICENSE.txt`). Liegt hier, damit der
Lernkurs nichts von fremden Servern lädt.

MathLive ist ein Formeleditor zum Eintippen von Termen: Eine Wurzel erscheint
mit einem Kästchen darunter, eine Hochzahl mit einem Kästchen oben, wie in
Word oder GeoGebra. Am Tablet klappt eine eigene Mathe-Tastatur auf.

Eingebunden wird es nur auf Seiten, die Terme abfragen (bisher `4_4_Ueben.html`),
vor `kurs.js`. `kurs.js` baut dann für ein Termfeld (`terme:` in `Kurs.uebung`)
ein `<math-field>` statt eines Textfelds und vergleicht dessen LaTeX mit den
erlaubten Lösungen. Fehlt MathLive, bleibt es beim Textfeld mit Vorschau.
Die Klänge des Pakets sind weggelassen.

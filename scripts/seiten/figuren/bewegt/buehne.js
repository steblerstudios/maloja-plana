/* Maloja Plana · Bühne für die bewegten Strichfiguren (eigene Arbeit, AGPL wie das Repo).
 *
 * Die Figur ruft hairline({ name, means, range, mount, … }). Hier bekommt sie,
 * was die Hairline-Bühne sonst stellt: die Fläche, das SVG und die Anzeige.
 * Gegenüber der Vorlage ruhiger: kein Abspielknopf, keine Tour, kein
 * Theme-Schalter (die Seite folgt dem System), deutsche Beschriftung.
 *
 * Barrierefreiheit (a11y-Prüfung 04.11.2026):
 *   • Die Fläche ist per Tastatur erreichbar (role="slider"): Pfeiltasten wählen
 *     das nächste Element, Pos1/Ende das erste und letzte. Die Figur stellt
 *     dafür anzahl und waehle(i) bereit.
 *   • Die Anzeige ist eine Live-Region, die nur bei einer Auswahl spricht; der
 *     Ruhe-Hinweis steht daneben und wird nicht vorgelesen.
 *   • Der Regler nennt seinen Wert als Text (aria-valuetext).
 */
(() => {
  const $ = (id) => document.getElementById(id);
  let gebaut = false;

  window.hairline = (figur) => {
    if (gebaut) throw new Error('hairline: eine Figur je Seite.');
    gebaut = true;
    const stage = $('stage'), regler = $('regler'), anzeige = $('anzeige');

    // Regler 0…1 auf die eigene Zahl der Figur: zwei Geraden, die sich bei 0.5 treffen.
    const [lo, mitte, hi] = figur.range;
    const auf = (i) => Math.round((i <= 0.5 ? lo + (i / 0.5) * (mitte - lo) : mitte + ((i - 0.5) / 0.5) * (hi - mitte)) * 1000) / 1000;

    HL.inject(document);
    stage.setAttribute('data-hairline', figur.name);
    const svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, stage);

    let text = '';
    const read = {
      get textContent() { return text; },
      set textContent(v) {
        text = v == null ? '' : String(v);
        anzeige.textContent = text;
        if (text) stage.setAttribute('aria-valuetext', text);
      },
    };

    const griff = figur.mount({ stage, svg, read }, auf(Number(regler.value)));

    // Tastatur: ein Element nach dem anderen.
    const anzahl = griff.anzahl || 0;
    let wahl = -1;
    if (anzahl > 0) {
      stage.tabIndex = 0;
      stage.setAttribute('role', 'slider');
      stage.setAttribute('aria-valuemin', '1');
      stage.setAttribute('aria-valuemax', String(anzahl));
      // Ein Slider braucht von Anfang an einen Wert (WCAG 4.1.2, a11y-Prüfung Predeploy 05.11.2026).
      // Gewählt ist noch nichts: Der Text sagt das, die Zahl steht auf dem ersten Element.
      stage.setAttribute('aria-valuenow', '1');
      if (!stage.hasAttribute('aria-valuetext')) stage.setAttribute('aria-valuetext', 'Noch nichts gewählt. Mit den Pfeiltasten wählen.');
      stage.addEventListener('keydown', (e) => {
        const ziel = { ArrowRight: wahl + 1, ArrowUp: wahl + 1, ArrowLeft: wahl - 1, ArrowDown: wahl - 1, Home: 0, End: anzahl - 1 }[e.key];
        if (ziel === undefined) return;
        e.preventDefault();
        wahl = Math.min(anzahl - 1, Math.max(0, ziel));
        stage.setAttribute('aria-valuenow', String(wahl + 1));
        griff.waehle(wahl);
      });
    }

    const wertText = (v) => (griff.wertText ? griff.wertText(v) : 'Höhen mal ' + v.toFixed(2).replace('.', ','));
    const regle = () => {
      const v = auf(Number(regler.value));
      regler.setAttribute('aria-valuetext', wertText(v));
      return v;
    };
    regle();
    regler.addEventListener('input', () => griff.set(regle()));
  };
})();

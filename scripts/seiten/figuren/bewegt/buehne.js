/* Maloja Plana · Bühne für die bewegten Strichfiguren (eigene Arbeit, AGPL wie das Repo).
 *
 * Die Figur ruft hairline({ name, means, range, mount, … }). Hier bekommt sie,
 * was die Hairline-Bühne sonst stellt: die Fläche, das SVG und die Anzeige.
 * Gegenüber der Vorlage ruhiger: kein Abspielknopf, kein Theme-Schalter (die
 * Seite folgt dem System), deutsche Beschriftung, die Anzeige wird vorgelesen.
 */
(() => {
  const $ = (id) => document.getElementById(id);
  let gebaut = false;

  window.hairline = (figur) => {
    if (gebaut) throw new Error('hairline: eine Figur je Seite.');
    gebaut = true;
    const stage = $('stage'), regler = $('regler'), anzeige = $('anzeige'), wert = $('wert');

    // Regler 0…1 auf die eigene Zahl der Figur: zwei Geraden, die sich bei 0.5 treffen.
    const [lo, mitte, hi] = figur.range;
    const auf = (i) => Math.round((i <= 0.5 ? lo + (i / 0.5) * (mitte - lo) : mitte + ((i - 0.5) / 0.5) * (hi - mitte)) * 1000) / 1000;

    HL.inject(document);
    stage.setAttribute('data-hairline', figur.name);
    stage.setAttribute('role', 'img');
    stage.setAttribute('aria-label', figur.means);
    const svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, stage);

    const ruhe = anzeige.textContent;
    let text = '';
    const read = {
      get textContent() { return text; },
      set textContent(v) { text = v == null ? '' : String(v); anzeige.textContent = text || ruhe; },
    };

    const zeigeWert = () => {
      if (!wert) return;
      const v = auf(Number(regler.value));
      wert.textContent = regler.dataset.einheit === 'franken'
        ? String(Math.round(v)).replace(/\B(?=(\d{3})+$)/g, "'") + ' Fr.'
        : '× ' + v.toFixed(2);
    };
    zeigeWert();

    const griff = figur.mount({ stage, svg, read }, auf(Number(regler.value)));
    regler.addEventListener('input', () => { zeigeWert(); griff.set(auf(Number(regler.value))); });
  };
})();

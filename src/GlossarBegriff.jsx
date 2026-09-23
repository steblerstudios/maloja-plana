import React, { useState, useContext } from 'react';
import { text, weight, radius, shadow } from './config/tokens.js';
import { I18nContext } from './i18n/index.js';

// ─── Glossar-Begriff — antippbare Erklärung für Abkürzungen/Fachwörter ───────
//
// Testperson A stolperte über „IPV", „SKOS", „Mietbeiträge" — sie wusste nicht, was
// gemeint ist. Ein Begriff bekommt eine dezente gepunktete Unterstreichung;
// Antippen öffnet eine ruhige kleine Erklärung. Kein Lärm, nur Orientierung.

// Erkennbare Begriffe → i18n-Schlüssel der Erklärung. Case-sensitiv beim Matchen.
export const GLOSSAR = {
  IPV: 'glossar.ipv',
  SKOS: 'glossar.skos',
  EL: 'glossar.el',
  Mietbeiträge: 'glossar.mietbeitraege',
  AHV: 'glossar.ahv',
  IV: 'glossar.iv',
  KVG: 'glossar.kvg',
  BVG: 'glossar.bvg',
  UVG: 'glossar.uvg',
  Franchise: 'glossar.franchise',
  Selbstbehalt: 'glossar.selbstbehalt',
  Beistandschaft: 'glossar.beistandschaft',
  // 20.09.2026 · aus den Hinweis-Sätzen gehoben: diese vier kamen dort am
  // häufigsten vor und wurden bisher nirgends erklärt.
  Nettolohn: 'glossar.nettolohn',
  Taxpunktwert: 'glossar.taxpunktwert',
  Bundessteuer: 'glossar.bundessteuer',
  Veranlagung: 'glossar.veranlagung',
};

// ─── Wortformen je Sprache ──────────────────────────────────────────────────
//
// Bis 24.09.2026 kannte das Glossar nur die deutschen Schlüssel oben — ein
// französischer Satz sagt aber «AVS», «LAMal», «franchise», ein italienischer
// «franchigia». Über 40 Hinweis-Sätze hinweg wurde darum fast nur Deutsch
// markiert (de 19 · en 6 · rm 2 · fr 0 · it 0).
//
// Die Wortform steht schon da: jede Erklärung beginnt mit ihrem Begriff in der
// eigenen Sprache — «AVS — assurance-vieillesse …», «Franchigia — la parte …».
// Dieses KOPFWORT (vor « — ») ist die Form, die erkannt wird. Keine zweite
// Liste, die neben den Übersetzungen gepflegt werden müsste: wer die Erklärung
// übersetzt, legt damit fest, welches Wort sie erklärt.
//   • «IPV/RIP — …»            → beide Formen
//   • «Curatelle (Beistandschaft) — …» → «Curatelle» (die Klammer ist Hinweis)
//   • «Franchise» erkennt auch «franchise» mitten im Satz (nur der erste
//     Buchstabe; Abkürzungen wie «AVS» bleiben genau)
// Der deutsche Schlüssel gilt in jeder Sprache weiter (en/rm nutzen oft «AHV»).
export const kopfwoerter = (erklaerung) => (
  typeof erklaerung === 'string' && erklaerung.includes(' — ')
    ? erklaerung.split(' — ')[0].replace(/\s*\([^)]*\)\s*$/, '').split('/').map((x) => x.trim()).filter(Boolean)
    : []
);

const ESC = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Grossbuchstabe + Kleinbuchstabe am Anfang → auch klein erkennen.
const muster = (form) => (/^\p{Lu}\p{Ll}/u.test(form)
  ? '[' + form[0] + form[0].toLowerCase() + ']' + ESC(form.slice(1))
  : ESC(form));

// Je Übersetzer einmal gebaut: Form → Schlüssel, und das Suchmuster dazu.
const cache = new WeakMap();
export function glossarFormen(tt) {
  if (cache.has(tt)) return cache.get(tt);
  const formen = new Map();
  for (const [term, key] of Object.entries(GLOSSAR)) {
    formen.set(term, key);
    for (const f of kopfwoerter(tt(key))) if (!formen.has(f)) formen.set(f, key);
  }
  const sortiert = [...formen.keys()].sort((a, b) => b.length - a.length);
  // Grenzen über Unicode-Buchstaben statt \b: \b hält «é» oder «ä» für eine
  // Wortgrenze. Die Grenze DAVOR prüft `zerlege` von Hand — ein Lookbehind
  // `(?<!…)` kann Safari erst ab 16.4, gebaut wird für Safari 16.
  const re = new RegExp('(' + sortiert.map(muster).join('|') + ')(?![\\p{L}\\p{N}])', 'gu');
  const schluessel = (wort) => formen.get(wort)
    || formen.get(wort[0].toUpperCase() + wort.slice(1));
  const ergebnis = { re, schluessel };
  cache.set(tt, ergebnis);
  return ergebnis;
}

const BUCHSTABE = /[\p{L}\p{N}]/u;
// Satz → [Text, {wort, key}, Text, …]. Kein Treffer mitten im Wort und keiner
// nach «Wort-»: «tax-deductible» ist keine Franchise. Ein Bindestrich DANACH
// bleibt erlaubt — «AHV-Rente» meint die AHV.
export function zerlege(satz, tt) {
  const { re, schluessel } = glossarFormen(tt);
  const teile = [];
  let bis = 0;
  for (const m of satz.matchAll(re)) {
    const vor = satz[m.index - 1] || '';
    const vorvor = satz[m.index - 2] || '';
    if (BUCHSTABE.test(vor) || (vor === '-' && BUCHSTABE.test(vorvor))) continue;
    const key = schluessel(m[0]);
    if (!key) continue;
    // «tassazione individuale», «taxaziun individuala» meinen die Individual-
    // besteuerung (ein Steuermodell), nicht die Veranlagung (den Entscheid) —
    // Deutsch markiert «Individualbesteuerung» auch nicht. «taxation commune»
    // dagegen IST die gemeinsame Veranlagung und bleibt markiert.
    if (key === 'glossar.veranlagung' && /^\s+individu/i.test(satz.slice(m.index + m[0].length))) continue;
    teile.push(satz.slice(bis, m.index), { wort: m[0], key });
    bis = m.index + m[0].length;
  }
  teile.push(satz.slice(bis));
  return teile;
}

export function GlossarBegriff({ term, defKey: vorgegeben, t, palette }) {
  const [open, setOpen] = useState(false);
  const defKey = vorgegeben || GLOSSAR[term];
  if (!defKey) return term;
  return React.createElement('span', { style: { position: 'relative', display: 'inline-block' } },
    React.createElement('button', {
      type: 'button',
      // stopPropagation: eine Erklärung soll nie eine umgebende Aktion auslösen.
      onClick: (e) => { e.stopPropagation(); setOpen((o) => !o); },
      'aria-expanded': open,
      title: t(defKey),
      style: {
        background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit', color: 'inherit',
        borderBottom: open ? '1px solid var(--mp-accent)' : '1px dotted ' + palette.mid,
        lineHeight: 'inherit', whiteSpace: 'nowrap',
      },
    },
      term,
      // Kleiner, ruhiger Marker: signalisiert „hier steckt eine Erklärung".
      React.createElement('sup', {
        'aria-hidden': 'true',
        style: {
          fontSize: '0.7em', marginLeft: '2px', fontWeight: weight.semi,
          color: open ? 'var(--mp-accent)' : palette.mid,
        },
      }, 'ⓘ'),
    ),
    open ? React.createElement(React.Fragment, null,
      // Klick daneben schliesst.
      React.createElement('span', {
        'aria-hidden': 'true',
        onClick: () => setOpen(false),
        style: { position: 'fixed', inset: 0, zIndex: 30 },
      }),
      React.createElement('span', {
        role: 'tooltip',
        style: {
          position: 'absolute', left: 0, top: '100%', marginTop: '6px', zIndex: 31,
          width: 'max-content', maxWidth: '260px', textAlign: 'left',
          background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.sm,
          boxShadow: shadow.md, padding: '10px 12px',
          fontSize: text.sm, fontWeight: weight.normal, color: palette.text, lineHeight: 1.5,
          whiteSpace: 'normal',
        },
      }, t(defKey)),
    ) : null
  );
}

// Zerlegt einen Satz und macht bekannte Begriffe antippbar. Reihenfolge egal.
export function GlossarText({ children, t, palette }) {
  // t kann als Prop kommen oder aus dem i18n-Kontext — so genügt an vielen
  // Stellen ein einzelnes { palette } ohne t durchzureichen.
  //
  // Den Kontext direkt lesen statt über `useT()`: das wirft, wenn kein Provider
  // darüber steht, und zwar AUCH dann, wenn `t` als Eigenschaft mitkam. Solange
  // die Komponente nur an sechs Stellen hing, fiel das nie auf — beim Anschluss
  // der Hinweis-Sätze (20.09.2026) riss es auf einen Schlag 41 Tests, die ihre
  // Ansicht bewusst ohne Provider rendern und `t` als Eigenschaft übergeben.
  // Ohne Übersetzer wird der Text unmarkiert durchgereicht: eine fehlende
  // Erklärung ist ein Schönheitsfehler, eine geworfene Ausnahme nimmt die Seite.
  const ctx = useContext(I18nContext);
  const tt = t || (ctx && ctx.t);
  if (typeof children !== 'string' || !tt) return children;
  return React.createElement(React.Fragment, null,
    ...zerlege(children, tt).map((teil, i) =>
      typeof teil === 'string'
        ? teil
        : React.createElement(GlossarBegriff, { key: i, term: teil.wort, defKey: teil.key, t: tt, palette })
    )
  );
}

export default GlossarBegriff;

import React, { useState, useEffect } from 'react';
import { text, weight, space, leading, radius } from '../../config/tokens.js';
import { bereichFillColor } from '../../data/lebensbereiche.js';
import { PROGRAMM_KANTONE } from '../../data/mietzinsbeitraege.js';
import { WOHNEN_INTERNATIONAL } from '../../data/wohnenInternational.js';
import { renderSource } from '../../utils/renderSource.js';
import { zahl, betrag } from '../../utils/geld.js';
import { LegendenMarke } from '../../components/LegendenMarke.jsx';
import { Belege, zerlegeBelege } from '../../components/Belege.jsx';
import { knopfStil, linkStil, auswahlStil } from '../../components/PrimaryButton.jsx';
import { Kalenderblatt } from '../../components/Kalenderblatt.jsx';
import { Icon } from '../../IconSystem.jsx';
import { CHAPTER_KEYS } from '../../config/constants.js';
import { calcDuration, addressLine } from '../../MirrorCards.jsx';
import { wohnkostenRechnung, anteilText, wohnkostenSatzKey, drittelSatzKey, mieteLage, mietVorbehalte, mietzinsHilfe, beitragAnteil, lageWert } from './rechnung.js';
import { DrittelHaus, Vergleichshaus, MoeglichKnopf, Kachelkarte, HaeuserRang } from './bilder.jsx';
import { getCantonName } from '../../config/kantonPLZ.js';

// Lebensbereich Wohnen · die Orte (Bauplan Lebensbereich, Stebler Studios 18.11.2026).
//   WohnenZuhause   Kapitel Wohnen, gross 256
//   WohnenWerkzeug  Werkzeug «Mietzins», mittel 128
//   WohnenStrasse   die eine Szene für beide: Drittel-Haus · Vergleichshaus (Tür = Fass) · Wegweiser «möglich ›».
// Unter jedem Haus seine Hauptzahl (Regel «Zahl», Matrix §10): Anteil unter dem Drittel-Haus, Lage unter dem
// Vergleichshaus. Jedes Bild steht nur einmal auf der Seite; Zusätze (Regler, Kantonskarte, Ausland) unter «Mehr dazu».

export const REGLER_MIN = 800;
export const REGLER_MAX = 3500;
export const REGLER_SCHRITT = 50;
// Eine erfasste Miete über 3'500 bleibt auf dem Regler erreichbar (kein Sprung beim ersten Schieben).
export const reglerMax = (heute) => Math.max(REGLER_MAX, Math.ceil(heute / REGLER_SCHRITT) * REGLER_SCHRITT);
const aufRegler = (v, max) => Math.min(max, Math.max(REGLER_MIN, Math.round(v / REGLER_SCHRITT) * REGLER_SCHRITT));

const zahlStil = { fontSize: text['2xl'], fontWeight: weight.semi, lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' };
const BILDHOEHE = { gross: 190, mittel: 128 };

// Die Szene. `r` = wohnkostenRechnung, `ml` = mieteLage, `hilfe` = mietzinsHilfe. Der Wegweiser führt im Kapitel
// ins Werkzeug (`onNavigate`), im Werkzeug zur kantonalen Stelle (`url`).
// `kapitel`: die Kosten stehen schon gross im Kopf, darum sagt die Zeile unter dem Drittel-Haus, worauf sich die
// Prozente beziehen (Stebler Studios 20.11.2026, «wie die Finanzen»).
// Ein Betrag bricht nicht in sich um («CHF» und Zahl bleiben zusammen; Nachzug Fachprüfung).
const fest = (b) => String(b).replace(/ /g, '\u00a0');
// Wessen Einkommen gemeint ist — dieselben fünf Fälle wie wohnkostenSatzKey (Fachprüfung), nur kurz.
export const bezugKey = (r) => 'wohnenKopf.bezug.' + (r.brutto ? (r.ganzBrutto ? 'brutto' : 'gemischt') : r.haushalt ? 'haushalt' : r.mitPartner ? 'eigen' : 'netto');
// `unterDrittel` / `unterVergleich`: was im Kapitel unter dem jeweiligen Haus steht (Erklärung zum Aufklappen).
export const WohnenStrasse = ({ palette, t, r, ml, hilfe, groesse = 'gross', isDarkMode, onNavigate, ausprobiert = false, kapitel = false, unterDrittel = null, unterVergleich = null }) => {
  const h = React.createElement;
  const fuell = bereichFillColor('wohnen', isDarkMode) || palette.sage;
  const behoerden = bereichFillColor('behoerden', isDarkMode) || palette.mid;
  const mitAnteil = r && r.anteil != null;
  const bildH = BILDHOEHE[groesse] || BILDHOEHE.gross;
  const boden = { height: bildH + 'px', display: 'flex', alignItems: 'flex-end', borderBottom: '1px solid ' + palette.mid, paddingBottom: 0 };
  const spalte = (breite) => ({ flex: '0 1 ' + breite + 'px', minWidth: 0, display: 'flex', flexDirection: 'column' });
  const tuer = hilfe ? { programm: hilfe.programm, fass: hilfe.fass, farbe: behoerden } : null;
  const schild = hilfe && hilfe.moeglich ? h(MoeglichKnopf, { palette, t, onNavigate, url: onNavigate ? undefined : hilfe.url, kurz: true }) : null;
  return h('div', { 'data-teil': 'wohnen-strasse', 'data-groesse': groesse, style: { display: 'flex', alignItems: 'flex-start', gap: '0 ' + space.md + 'px', flexWrap: 'wrap', margin: '0 0 ' + space.sm + 'px' } },
    // Frage A · Ihr Haus
    mitAnteil && h('div', { 'data-teil': 'strasse-drittel', style: spalte(bildH) },
      h('div', { style: boden }, h('div', { style: { width: '100%' } },
        h(DrittelHaus, { palette, t, anteil: r.anteil, ueberDrittel: r.ueberDrittel, mitPartner: r.mitPartner, brutto: r.brutto, fahnen: kapitel,
          teile: groesse === 'gross' && r.haushalt ? { sie: r.einkommen - r.partnerEinkommen, partner: r.partnerEinkommen } : null,
          beitrag: r.beitrag ? { ...r.beitrag, farbe: behoerden } : null, fuell, groesse }))),
      h('div', { 'data-instrument-zahl': 'wohnkosten', 'aria-live': 'polite', style: { ...zahlStil, color: palette.text, marginTop: space.xs + 'px' } }, anteilText(r)),
      // Im Kapitel (Stebler Studios 21.11.2026, «wohnen-aufraeumen.html» Teil 1): unter der Zahl, was sie heisst, darunter
      // die zwei Beträge, aus denen sie kommt — gleich gebaut wie unter dem Vergleichshaus.
      kapitel && !ausprobiert && h('div', { 'data-teil': 'wohnkosten-bezug', style: { fontSize: text.sm, color: palette.text, marginTop: '2px', lineHeight: leading.tight } },
        t(bezugKey(r))),
      h('div', { 'data-teil': 'wohnkosten-franken', style: { fontSize: text.xs, color: palette.mid, marginTop: '2px' } },
        kapitel && !ausprobiert ? t('wohnenKopf.vonBetrag', { teil: fest(betrag(r.kosten)), ganz: fest(betrag(r.einkommen)) })
          : t(ausprobiert ? 'wohnenInstrument.titelAusprobiert' : 'wohnenInstrument.titel') + ': ' + betrag(r.kosten)),
      unterDrittel),
    // Frage B · das Vergleichshaus, Tür = Fass (Frage C)
    ml && h('div', { 'data-teil': 'strasse-vergleich', style: spalte(bildH) },
      h('div', { style: boden }, h('div', { style: { width: '100%' } },
        h(Vergleichshaus, { palette, lage: ml, fuell, tuer, groesse, kanton: ml.kanton }))),
      ml.lage && h('div', { 'data-instrument-zahl': 'miete', style: { ...zahlStil, color: palette.text, marginTop: space.xs + 'px' } }, lageWert(ml.lage)),
      kapitel && !ausprobiert && ml.lage && h('div', { 'data-teil': 'lage-bezug', style: { fontSize: text.sm, marginTop: '2px', lineHeight: leading.tight,
        color: ml.lage.richtung === 'Above' ? palette.goldDeep : ml.lage.richtung === 'Below' ? palette.sageDeep : palette.mid } },
        t('wohnenKopf.lage.' + ml.lage.richtung, { kanton: getCantonName(ml.kanton, t) })),
      h('div', { 'data-teil': 'strasse-betrag', style: { fontSize: text.xs, color: palette.mid, marginTop: '2px' } },
        kapitel && !ausprobiert && ml.vergleich?.regional
          ? t('wohnenKopf.stattSchnitt', { ihre: fest(betrag(ml.netto)), schnitt: fest(betrag(ml.vergleich.regional)) })
          : (ausprobiert ? t('strasse.ausprobiert') : t('strasse.eigen')) + ': ' + betrag(ml.netto)),
      unterVergleich),
    // Frage C · der Wegweiser steht auf dem Boden der Strasse, rechts vom Vergleichshaus
    schild && h('div', { 'data-teil': 'wegweiser-in-strasse', style: { ...spalte(140), flex: '0 0 auto' } },
      h('div', { style: { ...boden, borderBottom: '1px solid ' + palette.mid } }, schild)),
  );
};

// Die Sätze zur Lage (ehemals im Barometer): eigener Wert gegen den Kanton, Kanton gegen die Schweiz, Vorbehalte, Quelle.
export const MieteSaetze = ({ palette, t, ml, imKapitel, ohneQuelle = false, ohneEigenen = false }) => {
  if (!ml) return null;
  const h = React.createElement;
  const ns = 'po.regionalCompare.';
  const k = ns + 'rent.';
  const { diffPct } = ml.vergleich;
  const rund = Math.round(diffPct);
  const dir = rund > 0 ? 'Above' : rund < 0 ? 'Below' : 'Equal';
  const textFarbe = ml.lage?.richtung === 'Above' ? palette.goldDeep : ml.lage?.richtung === 'Below' ? palette.sageDeep : palette.mid;
  const klein = { fontSize: text.xs, color: palette.mid, marginTop: space.xs + 'px', lineHeight: leading.normal };
  return h('div', { 'data-teil': 'miete-saetze' },
    ml.lage && !ohneEigenen && h('div', { 'data-teil': 'barometer-eigener-wert', style: { fontSize: text.sm, color: textFarbe, fontWeight: weight.medium, marginTop: space.sm + 'px', lineHeight: leading.normal } },
      t(k + 'user' + ml.lage.richtung, { pct: Math.abs(ml.lage.pct) })),
    h('div', { 'data-teil': 'barometer-region', style: klein }, t(ns + 'region' + dir, { pct: Math.abs(rund) })),
    h('div', { 'data-teil': 'miete-vergleich-groesse', style: klein }, mietVorbehalte(t, ml.vergleich, { imKapitel }).join(' ')),
    !ohneQuelle && h(MieteQuelle, { palette, t, ml }),
  );
};

// Die Quelle der Vergleichsmieten (BFS). Im Kapitel sichtbar direkt unter der Strasse, weil die Zahlen im
// Vergleichshaus daraus kommen.
export const MieteQuelle = ({ palette, t, ml }) => React.createElement('div', {
  'data-teil': 'miete-quelle', style: { fontSize: text.xs, color: palette.soft, fontStyle: 'italic', marginTop: space.xs + 'px', lineHeight: leading.normal },
}, renderSource(t('po.regionalCompare.rent.source', { year: ml.vergleich.year }), null, t));

// Der Satz und die Quelle zum EU-Stock: abgeleitet, keine gemessenen Preise in Franken.
export const InternationalHinweis = ({ palette, t, ohneQuelle = false }) => React.createElement('div', { 'data-teil': 'international-hinweis', style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, margin: space.xs + 'px 0 ' + space.sm + 'px' } },
  React.createElement('p', { style: { margin: 0 } }, t('wohnenInternational.satz', Object.fromEntries(['DE', 'AT', 'FR', 'IT'].map((c) => {
    const p = Math.round((WOHNEN_INTERNATIONAL.index[c] / WOHNEN_INTERNATIONAL.index.CH - 1) * 100);
    return [c, (p >= 0 ? '+' : '−') + Math.abs(p)];
  })))),
  !ohneQuelle && React.createElement(Belege, { palette, t, zeile: t('wohnenInternational.quelle'), style: { fontSize: text.xs } }));

const BeitragLegende = ({ palette, t, hoechst, farbe }) => React.createElement('p', {
  'data-teil': 'beitrag-legende', style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, margin: space.xs + 'px 0 0', display: 'flex', gap: '4px' },
},
  React.createElement('svg', { width: 14, height: 10, viewBox: '0 0 14 10', 'aria-hidden': 'true', style: { flexShrink: 0, marginTop: '4px' } },
    React.createElement('rect', { x: 0.75, y: 0.75, width: 12.5, height: 8.5, fill: 'none', stroke: farbe, strokeWidth: 1.5, strokeDasharray: '3 2' })),
  t('mietzinsSzene.beitragLegende', { betrag: zahl(hoechst) }));

// ── Dreier-Set «Mietbeiträge und Wohnungsmarkt» ─────────────────────────────────────────────────────────────────────
// Stebler Studios 20.11.2026 (Vorschau docs/design/wohnen-karten-set.html, «Ja, so bauen»): drei Kacheln mit kleinem Bild
// und der Zahl Ihres Kantons; die angetippte öffnet darunter das grosse Bild. Mietbeiträge als Kachelkarte (wie bisher),
// Miete 3 Zimmer nur als Karte in den Stufen des Kantonsatlas, Leerwohnungen in Wohnen-Grün nur als Rangfolge.
// Ersetzt die offene Kantonskarte der Mietbeiträge und die Links «Auf der Karte» am Kapitelende.
// Werte: src/data/kantonskarten.js (aus dem Kantonsatlas erzeugt). Die Quelle der Leerwohnungsziffer steht dort nicht
// mit; sie ist dieselbe wie im Atlas (scripts/seiten/kantone-im-vergleich.mjs, Schlüssel bfsLeer).
const LEER_QUELLE = { text: 'BFS, Leerwohnungszählung 2026, Stichtag 1.6.2026', url: 'https://dam-api.bfs.admin.ch/hub/api/dam/assets/36836216/master' };
// Quellen im Hausstil (Belege, Stebler Studios 21.11.2026 «alle Quellen bitte sauber aufräumen»): eine Zeile je Bildgruppe,
// aufgeklappt nummeriert. Das Prüfdatum steht in derselben Form wie bei den übrigen Quellen (aus wohnenInternational.quelle).
const QUELLE_MIETE = { text: 'BFS, Mietpreis nach Kanton und Zimmerzahl 2024 (T 09.03.03.01)', url: 'https://dam-api.bfs.admin.ch/hub/api/dam/assets/36398431/master' };
const QUELLE_BUDGET = { text: 'Budgetberatung Schweiz, Wohnen', url: 'https://budgetberatung.ch/wohnen' };
export const quellenZeile = (t, liste) => {
  const datum = zerlegeBelege(t('wohnenInternational.quelle'))?.datum;
  return t('wohnenKarten.quellenWort') + ': ' + liste.map((q) => '[[' + q.text + '|' + q.url + ']]').join(', ') + (datum ? ' (' + datum + ')' : '') + '.';
};
const eurostat = (t) => { const b = zerlegeBelege(t('wohnenInternational.quelle')); return b && b.links[0] ? { text: b.links[0].label, url: b.links[0].href } : null; };
const atlasZahl = (s) => Number(String(s ?? '').replace(/[’'\s%]/g, '').replace(',', '.'));
const schweizer = (s) => String(s).replace(/'/g, '’');
// Die Kantonsdaten kommen nachgeladen wie die Karten im Werkzeug (Wächter verstehenImWerkzeug.test.js): bis sie da sind,
// steht nur die Kachel der Mietbeiträge, die ohne sie auskommt.
export const marktWerte = (KARTEN) => {
  const m = KARTEN.miete;
  const leer = Object.fromEntries(Object.entries(m.vergleich?.werte || {}).map(([k, v]) => [k, atlasZahl(v)]));
  return { miete: m, leer, leerText: m.vergleich?.werte || {}, leerCh: atlasZahl(m.vergleich?.ch), leerChText: m.vergleich?.ch };
};
const MarktSet = ({ palette, t, kanton, hilfe, hilfeText = null, isDarkMode }) => {
  const h = React.createElement;
  const [aktiv, setAktiv] = useState(hilfe ? 'beitrag' : 'miete');
  const [daten, setDaten] = useState(null);
  useEffect(() => {
    let lebt = true;
    import('../../data/kantonskarten.js').then((m) => { if (lebt) setDaten(m); }).catch(() => {});
    return () => { lebt = false; };
  }, []);
  const w = daten ? marktWerte(daten.KARTEN) : null;
  const stufen = daten ? daten.STUFEN_FARBEN.birne[isDarkMode ? 'dunkel' : 'hell'] : {};
  const klein = { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal };
  const name = kanton ? getCantonName(kanton, t) : '';
  const miete = w?.miete, leer = w?.leer || {}, leerText = w?.leerText || {}, leerCh = w?.leerCh, leerChText = w?.leerChText;
  const mieteFarbe = (k) => { const x = miete?.werte[k]; return x ? { fill: stufen[x.s], hellSchrift: x.s >= 3 } : null; };
  const rang = kanton && leer[kanton] != null ? Object.values(leer).filter((n) => n > leer[kanton]).length + 1 : null;
  const mieteIhr = kanton && miete?.werte[kanton] ? atlasZahl(miete.werte[kanton].text) : null;
  const legendeMiete = miete && h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '2px ' + space.sm + 'px', marginTop: space.xs + 'px' } },
    miete.spannen.map((sp) => h('span', { key: sp.s, style: { ...klein, display: 'inline-flex', alignItems: 'center', gap: '4px' } },
      h('span', { 'aria-hidden': 'true', style: { width: '12px', height: '10px', borderRadius: radius.hair + 'px', background: stufen[sp.s], display: 'inline-block' } }), schweizer(sp.text))));

  const set = [
    hilfe && {
      key: 'beitrag', titel: t('mietzinsSzene.titel'),
      mini: h(Kachelkarte, { palette, kanton, gefuellt: PROGRAMM_KANTONE, isDarkMode, mini: true, teil: 'markt-mini' }),
      zahl: t(hilfe.programm ? 'wohnenKarten.programm' : 'wohnenKarten.unklar'),
      satz: t(hilfe.programm ? 'wohnenKarten.programmKurz' : 'wohnenKarten.unklarKurz'),
      gross: h(React.Fragment, null,
        // Der Satz zu den Mietbeiträgen steht seit 21.11.2026 hier, in der aufgeklappten Kachel (Wortlaut unverändert).
        hilfeText && h('p', { 'data-teil': 'hilfe-satz', style: { margin: '0 0 ' + space.sm + 'px', fontSize: text.sm, color: palette.text, lineHeight: leading.normal } }, hilfeText),
        h(Kachelkarte, { palette, t, kanton, gefuellt: PROGRAMM_KANTONE, isDarkMode }),
        h('p', { style: { ...klein, margin: space.xs + 'px 0 0' } }, t('mietzinsSzene.karteLegende'))),
    },
    miete && {
      key: 'miete', titel: t('wohnenKarten.miete'),
      mini: h(Kachelkarte, { palette, kanton, isDarkMode, farbe: mieteFarbe, mini: true, teil: 'markt-mini' }),
      zahl: betrag(mieteIhr ?? atlasZahl(miete.ch)),
      satz: mieteIhr != null ? t('wohnenKarten.mieteSatz', { ch: schweizer(miete.ch) }) : t('wohnenKarten.schweiz'),
      gross: h(React.Fragment, null,
        h(Kachelkarte, { palette, t, kanton, isDarkMode, farbe: mieteFarbe, teil: 'markt-miete', aria: t('wohnenKarten.mieteAria', { kanton: name || '–' }) }),
        legendeMiete),
    },
    w && {
      key: 'leer', titel: t('wohnenKarten.leer'),
      mini: h(HaeuserRang, { palette, werte: leer, kanton, isDarkMode, mini: true }),
      zahl: kanton && leerText[kanton] ? leerText[kanton] : leerChText,
      satz: rang ? t('wohnenKarten.rangSatz', { rang, von: Object.keys(leer).length }) : t('wohnenKarten.schweiz'),
      gross: h(React.Fragment, null,
        h(HaeuserRang, { palette, werte: leer, kanton, ch: leerCh, isDarkMode, schreib: () => leerText[kanton] || '', chText: 'CH ' + leerChText }),
        h('p', { style: { ...klein, margin: space.xs + 'px 0 0' } }, t('wohnenKarten.leerSatz', { ch: leerChText, rang: rang || '–', von: Object.keys(leer).length }) + ' ' + t('wohnenKarten.leerLegende'))),
    },
  ].filter(Boolean);
  // Ohne Kanton und bevor die Daten da sind, gibt es keine Kachel: dann bleibt das Set weg.
  if (set.length === 0) return null;
  const offen = set.find((x) => x.key === aktiv) || set[0];
  // Raster (Stebler Studios 21.11.2026): die Kacheln teilen sich Zeilen für Titel, Bild, Zahl und Satz (subgrid), damit alles
  // auf derselben Höhe steht. Die angetippte Kachel ist umrandet; ihr Bild steht darunter in einem Rahmen, ohne Spitze.
  const quellen = [miete && QUELLE_MIETE, w && LEER_QUELLE].filter(Boolean);
  return h('div', { 'data-teil': 'markt-set' },
    h('p', { 'data-teil': 'markt-einstieg', style: { margin: '0 0 ' + space.sm + 'px', fontSize: text.sm, color: palette.mid, lineHeight: leading.normal } },
      name ? t('wohnenKarten.einstieg', { kanton: name }) : t('wohnenKarten.einstiegOhne')),
    h('div', { role: 'group', 'aria-label': t('wohnenKarten.titel'), style: { display: 'grid', gridTemplateColumns: 'repeat(' + set.length + ', minmax(0, 1fr))', gridTemplateRows: 'auto 60px auto auto', gap: '0 ' + space.sm + 'px' } },
      set.map((x) => {
        const an = x.key === offen.key;
        return h('button', {
          key: x.key, type: 'button', 'data-kachel': x.key, 'aria-pressed': an ? 'true' : 'false', onClick: () => setAktiv(x.key),
          style: { display: 'grid', gridTemplateRows: 'subgrid', gridRow: 'span 4', rowGap: space.xs + 'px', minWidth: 0, textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
            color: palette.text, background: an ? (palette.card || palette.surface) : 'transparent',
            border: (an ? 2 : 1) + 'px solid ' + (an ? palette.text : palette.border), borderRadius: radius.lg + 'px', padding: (an ? space.sm - 1 : space.sm) + 'px' },
        },
          h('span', { style: { fontSize: text.xs, fontWeight: weight.semi, color: palette.mid, lineHeight: leading.tight } }, x.titel),
          h('span', { 'aria-hidden': 'true', style: { display: 'flex', alignItems: 'flex-end', justifyContent: 'center', minHeight: 0 } }, x.mini),
          h('span', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text, fontVariantNumeric: 'tabular-nums', lineHeight: leading.tight } }, x.zahl),
          h('span', { style: { ...klein, lineHeight: leading.tight } }, x.satz || ''));
      })),
    h('div', { 'data-teil': 'markt-offen', 'data-offen': offen.key, style: { marginTop: space.sm + 'px', border: '1px solid ' + palette.border, borderRadius: radius.lg + 'px', padding: space.md + 'px' } }, offen.gross),
    quellen.length > 0 && h(Belege, { palette, t, zeile: quellenZeile(t, quellen), style: { marginTop: space.xs + 'px' } }));
};

// Satz zu Frage C: die Einschätzung des Kantons, nie «Anspruch».
const hilfeSatz = (t, hilfe) => {
  const e = hilfe.einschaetzung;
  return e.hasProgram && e.assessment ? t('mietzinsView.result_' + e.assessment.key, e.assessment.params || {}) : t('mietzins.' + e.info.state);
};

// Alles, was der Ort braucht, aus den drei Rechnungen.
const szene = (data, wohnen, probe, kanton) => {
  const r = wohnkostenRechnung(wohnen, data, probe);
  const profil = { ...(data || {}), wohnen: { ...(data?.wohnen || {}), ...(wohnen || {}) } };
  const ml = r.netto > 0 ? mieteLage(profil, { kanton, miete: r.netto }) : null;
  const hilfe = mietzinsHilfe(profil, kanton || profil?.basis?.canton || '');
  const b = beitragAnteil(profil, r, kanton || profil?.basis?.canton || '');
  return { r: { ...r, beitrag: b }, ml, hilfe };
};

// ── Kapitel Wohnen (Zuhause, gross) ─────────────────────────────────────────────────────────────────────────────────
// Aufbau wie Finanzen (Stebler Studios 20.11.2026, Varianten docs/design/wohnen-varianten.html: 1 A+C, 2 weg, 3 A+B+C,
// 4 A+B+C): oben die Wohnkosten gross, Monat oder Jahr · die Strasse (die Häuser tragen Anteil und Lage, darum keine
// Zeilen mit Balken) · Mietbeiträge mit der Kantonskarte offen (die Tür im Vergleichshaus ist das Fass dazu) ·
// Regler offen · am Rand Wohndauer, Hausrat & Haftpflicht (Schild), Vermieterschaft · «Mehr dazu» nur noch die Sätze.
const halb = (v) => Math.round(Number(v) || 0);
// `angaben` (aus ChapterView, nur im Kapitel mit Szene): { offen(k), umschalten(k), formular(k) } — die Abschnitte
// Adresse, Kosten, Vermieterschaft und Eigentum öffnen ihr Formular hier am Bild (Stebler Studios 20.11.2026, «A, am Bild»).
export const WohnenZuhause = ({ palette, t, wohnen, allData, isDarkMode, onNavigate, angaben = null }) => {
  const h = React.createElement;
  const [probe, setProbe] = useState(null);
  const [jahr, setJahr] = useState(false);
  const { r, ml, hilfe } = szene(allData, wohnen, probe);
  // Ohne erfasste Wohnkosten bleibt das Instrument weg — das Formular darunter ist der Ort zum Eintragen.
  if (r.kosten <= 0) return null;
  const max = reglerMax(r.heute);
  const ausprobiert = probe != null && probe !== r.heute;
  const fuell = bereichFillColor('wohnen', isDarkMode) || palette.sage;
  const behoerden = bereichFillColor('behoerden', isDarkMode) || palette.mid;
  const klein = { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal };
  const satz = { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal };
  const zeile = { display: 'flex', justifyContent: 'space-between', gap: space.md + 'px', padding: '8px 0', fontSize: text.sm, color: palette.text };
  const kapH = { margin: space.lg + 'px 0 ' + space.xs + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text };
  const trenner = { borderTop: '1px solid ' + palette.border + '88', paddingTop: space.sm + 'px', marginTop: space.md + 'px' };
  const w = wohnen || {};
  const v = allData?.versicherungen || {};
  const f = jahr ? 12 : 1;
  const geld = (x) => betrag(halb(x * f));
  // «ändern ›» / «ergänzen ›» am Bild und das Formular an seiner Stelle.
  const aendernStil = { ...linkStil(palette), minHeight: '44px', fontSize: text.sm, padding: 0, fontWeight: weight.semi, color: palette.sandDeep || palette.goldDeep, textDecoration: 'none' };
  const aendern = (k, wort = 'aendern') => angaben && !angaben.offen(k) && h('button', {
    type: 'button', className: 'mp-link', 'data-aendern': k, onClick: () => angaben.umschalten(k), style: aendernStil,
  }, t('wohnenKopf.' + wort) + ' ›');
  const formular = (k) => angaben && angaben.offen(k) && h('div', { key: 'f-' + k, 'data-szene-formular': k, style: { margin: space.sm + 'px 0' } }, angaben.formular(k));
  const wohnform = (() => { const fd = t('chapters.wohnen.fields.residenceType'); return fd && typeof fd === 'object' && fd.options ? fd.options[w.residenceType] || null : null; })();
  const zimmer = String(w.rooms || '').trim();

  // Kopf: Wohnkosten gross, darunter woraus sie bestehen und wo.
  const hypothek = w.mortgageStatus === 'no' ? 0 : Number(w.mortgagePayment) || 0;
  // Bestandteile der Wohnkosten (Stebler Studios 21.11.2026, Kombination der Varianten A, B und C aus
  // docs/design/wohnen-kopf-und-fahnen.html): ein dünner Balken zeigt die Anteile, darunter je Teil der Name und der
  // Betrag, mit «+» dazwischen wie auf einer Abrechnung; die Zimmer daneben. Die Adresse steht beim Kalenderblatt.
  const teile = [
    r.netto > 0 && { key: 'miete', wert: r.netto },
    hypothek > 0 && { key: 'hypothek', wert: hypothek },
    r.nk > 0 && { key: 'nebenkosten', wert: r.nk },
    Number(w.buildingsInsurance) > 0 && { key: 'gebaeude', wert: Number(w.buildingsInsurance) / 12 },
  ].filter(Boolean);
  const summeTeile = teile.reduce((a, x) => a + x.wert, 0) || 1;
  const DECK = [1, 0.5, 0.3, 0.18];
  const kleineZahl = (label, wert, teil) => h('div', { key: teil, 'data-kopf-teil': teil, style: { minWidth: 0 } },
    h('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.tight } }, label),
    h('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' } }, wert));
  const bestandteile = teile.length > 0 && h('div', { 'data-teil': 'wohnkosten-teile', style: { marginTop: space.sm + 'px' } },
    teile.length > 1 && h('div', { 'aria-hidden': 'true', style: { display: 'flex', height: '8px', borderRadius: radius.full + 'px', overflow: 'hidden', gap: '2px', marginBottom: space.xs + 'px' } },
      teile.map((x, i) => h('div', { key: x.key, style: { width: (x.wert / summeTeile * 100) + '%', background: fuell, opacity: DECK[i] } }))),
    h('div', { style: { display: 'flex', alignItems: 'flex-end', gap: space.xs + 'px ' + space.md + 'px', flexWrap: 'wrap' } },
      ...teile.flatMap((x, i) => [
        i > 0 && h('span', { key: 'plus-' + i, 'aria-hidden': 'true', style: { fontSize: text.lg, color: palette.mid, paddingBottom: '1px' } }, '+'),
        kleineZahl(t('wohnenKopf.teil.' + x.key), geld(x.wert), x.key),
      ]).filter(Boolean),
      zimmer && h('div', { style: { marginLeft: 'auto' } }, kleineZahl(t('wohnenKopf.teil.zimmer'), zimmer, 'zimmer'))));
  const adresse = addressLine(w);
  // Derselbe Umschalter wie beim Monatsring (auswahlStil): Kontrast hell und dunkel geprüft.
  const pille = (an, label, onClick) => h('button', {
    type: 'button', 'aria-pressed': an ? 'true' : 'false', onClick,
    style: { ...auswahlStil(palette, an), minHeight: '44px', padding: '0 ' + space.ms + 'px', fontSize: text.xs, fontWeight: weight.normal },
  }, label);
  const kopf = h('div', { 'data-teil': 'wohnen-kopf', style: { marginBottom: space.md + 'px' } },
    h('div', { role: 'group', 'aria-label': t('wohnenKopf.zeitraum'), style: { display: 'flex', gap: space.xs + 'px', marginBottom: space.sm + 'px' } },
      pille(!jahr, t('wohnenKopf.monat'), () => setJahr(false)), pille(jahr, t('wohnenKopf.jahr'), () => setJahr(true))),
    h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: space.sm + 'px', flexWrap: 'wrap' } },
      h('div', { 'data-instrument-zahl': 'wohnkosten-kopf', 'aria-live': 'polite', style: { fontSize: text['2xl'], fontWeight: weight.semi, lineHeight: 1.1, color: palette.text, fontVariantNumeric: 'tabular-nums' } },
        geld(r.kosten), h('span', { style: { fontSize: text.sm, fontWeight: weight.normal, color: palette.mid } }, ' ' + (jahr ? t('wohnenKopf.imJahr') : t('common.perMonth')))),
      aendern('rentAmount')),
    bestandteile,
    formular('rentAmount'),
    // Eigentum: als Zeile im Kopf; mit Hypothek steht sie schon in den Kosten oben.
    angaben && h('div', { 'data-teil': 'eigentum-zeile', style: { ...satz, display: 'flex', alignItems: 'center', gap: space.sm + 'px', flexWrap: 'wrap' } },
      h('span', null, t('wohnenKopf.eigentum') + (w.mortgageStatus ? '' : ': ' + t('wohnenKopf.nochLeer'))),
      aendern('mortgageStatus', w.mortgageStatus ? 'aendern' : 'ergaenzen')),
    formular('mortgageStatus'));

  // Am Rand: was kein Haus ist, mit eigenem Bild (wie Kalenderblatt und Thermometer bei Finanzen).
  const weg = (label, ziel) => onNavigate && h('button', {
    type: 'button', className: 'mp-link', onClick: ziel,
    style: { ...linkStil(palette), minHeight: '44px', fontSize: text.sm, padding: 0, textAlign: 'left' },
  }, label + ' ›');
  const randStueck = (teil, bild, ...inhalt) => h('div', { 'data-rand': teil, style: { display: 'flex', gap: space.sm + 'px', alignItems: 'center', flex: '1 1 220px', minWidth: 0 } },
    h('div', { 'aria-hidden': 'true', style: { flex: '0 0 auto', display: 'flex' } }, bild), h('div', { style: { minWidth: 0 } }, ...inhalt));
  const randZahl = (s) => h('div', { style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text } }, s);
  const dauer = calcDuration(w.moveInDate, t);
  const hausrat = v.householdInsurance === 'yes' || v.householdInsurance === 'no';
  const haftpflicht = v.liabilityInsurance === 'yes' || v.liabilityInsurance === 'no';
  const status = (wert) => wert === 'yes' ? '' : ': ' + t('wohnenKopf.keine');
  const praemien = [v.householdInsurance === 'yes' && Number(v.householdInsuranceAmount) > 0 && betrag(Number(v.householdInsuranceAmount)),
    v.liabilityInsurance === 'yes' && Number(v.liabilityPremium) > 0 && betrag(Number(v.liabilityPremium))].filter(Boolean);
  const telefon = String(w.landlordPhone || '').trim();
  const rand = [
    (dauer || angaben) && randStueck('wohndauer', dauer ? h(Kalenderblatt, { iso: String(w.moveInDate).slice(0, 10), palette, klein: true }) : h(Icon, { name: 'wohnen', size: 40, color: fuell }),
      // Die Dauer allein (Nominativ wie «Wohndauer 5 Jahre, 3 Monate»); «seit» stünde im Dativ.
      randZahl(dauer || adresse || t('wohnenKopf.adresse')),
      // Die Adresse steht hier, wo sie hingehört (seit 21.11.2026 nicht mehr im Kopf).
      dauer && adresse && h('div', { 'data-teil': 'rand-adresse', style: { ...satz, color: palette.text } }, adresse),
      h('div', { style: satz }, [wohnform, dauer && t('wohnenKopf.seitDatum', { datum: String(w.moveInDate).slice(0, 10).split('-').reverse().join('.') })].filter(Boolean).join(' · ')
        || (adresse ? '' : t('wohnenKopf.nochLeer'))),
      h('div', { style: { display: 'flex', gap: space.md + 'px', flexWrap: 'wrap' } },
        weg(t('wohnenKopf.umzug'), () => onNavigate('umzug')), aendern('address', adresse ? 'adresseAendern' : 'ergaenzen'))),
    (hausrat || haftpflicht) && randStueck('zuhause-versichert', h(Icon, { name: 'versicherungen', size: 44, color: bereichFillColor('versicherungen', isDarkMode) || palette.text }),
      randZahl([hausrat && t('wohnenKopf.hausrat') + status(v.householdInsurance), haftpflicht && t('wohnenKopf.haftpflicht') + status(v.liabilityInsurance)].filter(Boolean).join(' · ')),
      (v.householdInsurance === 'yes' || v.liabilityInsurance === 'yes') && h('div', { style: satz },
        [t('wohnenKopf.versichert'), praemien.length > 0 && praemien.join(' + ') + ' ' + t('wohnenKopf.imJahr')].filter(Boolean).join(' · ')),
      weg(t('chapters.versicherungen.title'), () => onNavigate('chapter', CHAPTER_KEYS.indexOf('versicherungen')))),
    (w.landlord || angaben) && randStueck('vermieterschaft', h(Icon, { name: 'phone', size: 36, color: palette.text }),
      randZahl(w.landlord || t('wohnenKopf.vermieterschaft')),
      (telefon || !w.landlord) && h('div', { style: satz }, telefon || t('wohnenKopf.nochLeer')),
      h('div', { style: { display: 'flex', gap: space.md + 'px', flexWrap: 'wrap' } },
        telefon && h('a', { href: 'tel:' + telefon.replace(/[^+\d]/g, ''), className: 'mp-link',
          style: { ...linkStil(palette), display: 'inline-flex', alignItems: 'center', minHeight: '44px', fontSize: text.sm } }, t('wohnenKopf.anrufen') + ' ›'),
        aendern('landlord', w.landlord ? 'aendern' : 'ergaenzen'))),
  ].filter(Boolean);

  // Erklärungen zum Aufklappen, je unter ihrem Haus (Stebler Studios 21.11.2026, statt «Mehr dazu»): Wortlaut unverändert.
  const erklaerung = (teil, titel, ...inhalt) => h('details', { 'data-teil': teil, style: { marginTop: space.xs + 'px' } },
    h('summary', { style: { cursor: 'pointer', minHeight: '44px', display: 'flex', alignItems: 'center', fontSize: text.sm, fontWeight: weight.semi, color: palette.goldDeep, listStyle: 'none' } }, titel + ' ›'),
    h('div', { style: { paddingBottom: space.xs + 'px' } }, ...inhalt));
  const mitViertel = r.anteil != null && !r.mitPartner && !r.brutto;
  const erklDrittel = r.anteil != null && erklaerung('warum-drittel', t('wohnenKopf.warumDrittel'),
    h('p', { 'data-teil': 'drittel-satz', style: { ...klein, margin: 0, color: r.ueberDrittel ? palette.text : palette.mid } }, t(drittelSatzKey(r))),
    mitViertel && h('p', { 'data-teil': 'viertel-legende', style: { ...klein, margin: space.xs + 'px 0 0' } },
      h(LegendenMarke, { form: 'punktlinie', color: palette.mid, palette }), t('wohnenInstrument.viertel')));
  const erklLage = ml && erklaerung('wie-verglichen', t('wohnenKopf.wieVerglichen'),
    h(MieteSaetze, { palette, t, ml, imKapitel: true, ohneQuelle: true, ohneEigenen: true }),
    ml.ausland && h(InternationalHinweis, { palette, t, ohneQuelle: true }));
  // Alle Quellen der Strasse in einer Zeile im Hausstil.
  const eu = ml && ml.ausland ? eurostat(t) : null;
  const strassenQuellen = [ml && QUELLE_MIETE, mitViertel && QUELLE_BUDGET, eu].filter(Boolean);

  return h('section', { 'data-teil': 'wohnkosten', style: { marginBottom: space.lg + 'px' } },
    kopf,
    h(WohnenStrasse, { palette, t, r, ml, hilfe, groesse: 'gross', isDarkMode, onNavigate, ausprobiert, kapitel: true, unterDrittel: erklDrittel, unterVergleich: erklLage }),

    // Drittel und Viertel stehen seit 21.11.2026 als Fahnen im Drittel-Haus; die Sätze dazu unter dem Haus.
    r.beitrag && h(BeitragLegende, { palette, t, hoechst: r.beitrag.hoechst, farbe: behoerden }),
    r.anteil == null && h('p', { style: { ...klein, margin: space.xs + 'px 0 0' } }, t('wohnenInstrument.ohneEinkommen')),
    strassenQuellen.length > 0 && h('div', { 'data-teil': 'strasse-quellen' }, h(Belege, { palette, t, zeile: quellenZeile(t, strassenQuellen) })),

    // Mietbeiträge und Wohnungsmarkt: der Satz der Mietbeiträge, darunter das Dreier-Set. Die Tür im Vergleichshaus
    // bleibt das Fass der Mietbeiträge.
    h('div', { 'data-teil': 'mietzins-szene', style: { marginTop: space.md + 'px' } },
      h('h3', { style: kapH }, t('wohnenKarten.titel')),
      h(MarktSet, { palette, t, kanton: hilfe?.kanton || allData?.basis?.canton || '', hilfe, hilfeText: hilfe ? hilfeSatz(t, hilfe) : null, isDarkMode })),

    // Regler «andere Miete», offen. Nichts wird gespeichert.
    !r.eigentum && h('div', { 'data-teil': 'miete-ausprobieren', style: trenner },
      h('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t('wohnenInstrument.ausprobieren')),
      h('label', { htmlFor: 'wohnen-regler', style: { ...zeile, paddingBottom: 0 } },
        h('span', null, t('wohnenInstrument.reglerLabel')),
        h('span', { style: { fontWeight: weight.semi, color: palette.text, whiteSpace: 'nowrap' } }, betrag(r.netto))),
      h('input', {
        id: 'wohnen-regler', type: 'range', min: REGLER_MIN, max, step: REGLER_SCHRITT,
        value: aufRegler(probe ?? (r.heute || REGLER_MIN), max),
        onChange: (e) => setProbe(Number(e.target.value)),
        'aria-valuetext': betrag(r.netto),
        style: { width: '100%', minHeight: '44px', accentColor: fuell, margin: 0 },
      }),
      h('div', { style: zeile },
        h('span', null, t('wohnenInstrument.nebenkostenWieHeute')),
        h('span', { style: { color: palette.text, whiteSpace: 'nowrap' } }, betrag(r.nk))),
      r.brutto && r.einkommen > 0
        ? h('div', { role: 'status', style: { ...zeile, display: 'block', borderTop: '1px solid ' + palette.border + '88' } }, t('budgetSync.availableNeedsNetto'))
        : r.frei != null && h('div', { role: 'status', 'data-teil': 'frei-danach', style: { ...zeile, fontWeight: weight.semi, borderTop: '1px solid ' + palette.border + '88' } },
          h('span', null, t(r.frei < 0 ? 'wohnenInstrument.fehltDanach' : 'wohnenInstrument.freiDanach')),
          h('span', { style: { color: palette.text, whiteSpace: 'nowrap' } }, betrag(Math.abs(r.frei)))),
      h('p', { style: { ...klein, margin: space.xs + 'px 0 ' + space.sm + 'px' } }, t('wohnenInstrument.durchspielen')),
      probe != null && h('button', { type: 'button', onClick: () => setProbe(null), style: knopfStil(palette, 'neben') }, t('wohnenInstrument.zurueck'))),

    // Am Rand
    rand.length > 0 && h('div', { 'data-teil': 'wohnen-rand', style: { display: 'flex', flexWrap: 'wrap', gap: space.md + 'px ' + space.xl + 'px', ...trenner } }, ...rand),
    // Formulare der Rand-Stücke unter der Zeile, in voller Breite.
    formular('address'), formular('landlord'),

  );
};

// ── Werkzeug «Mietzins» (mittel) ────────────────────────────────────────────────────────────────────────────────────
// Dieselbe Strasse in mittel, der Wegweiser führt zur kantonalen Stelle. Die Kantonskarte steht hier immer offen.
export const WohnenWerkzeug = ({ palette, t, data, isDarkMode, kanton }) => {
  const h = React.createElement;
  const { r, ml, hilfe } = szene(data, data?.wohnen, null, kanton);
  const behoerden = bereichFillColor('behoerden', isDarkMode) || palette.mid;
  if (r.kosten <= 0 && !hilfe) return null;
  const klein = { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal };
  return h('div', { 'data-teil': 'wohnen-werkzeug', style: { margin: space.md + 'px 0' } },
    r.kosten > 0 && h(WohnenStrasse, { palette, t, r, ml, hilfe, groesse: 'mittel', isDarkMode }),
    r.anteil != null && h('p', { 'data-teil': 'wohnkosten-satz', style: { ...klein, margin: space.xs + 'px 0 0', color: palette.text } },
      t(wohnkostenSatzKey(r)) + ' (' + betrag(r.einkommen) + ')'),
    r.anteil != null && h('p', { style: { ...klein, margin: '2px 0 0' } }, t(r.mitPartner ? 'wohnenInstrument.mitPartner' : 'mietzinsView.rentShareGuide')),
    r.beitrag && h(BeitragLegende, { palette, t, hoechst: r.beitrag.hoechst, farbe: behoerden }),
    ml && h(MieteSaetze, { palette, t, ml }),
    hilfe && h('div', { style: { marginTop: space.md + 'px' } },
      h(Kachelkarte, { palette, t, kanton: hilfe.kanton, gefuellt: PROGRAMM_KANTONE, isDarkMode }),
      h('p', { style: { ...klein, margin: space.xs + 'px 0 0' } }, t('mietzinsSzene.karteLegende'))),
  );
};


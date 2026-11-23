import React, { useState } from 'react';
import { text, weight, space, radius, leading } from '../../config/tokens.js';
import { knopfStil } from '../../components/PrimaryButton.jsx';
import { Kalenderblatt } from '../../components/Kalenderblatt.jsx';
import { PageTitle } from '../../components/Heading.jsx';
import { Belege } from '../../components/Belege.jsx';
import { RueckgaengigMeldung } from '../../components/RueckgaengigMeldung.jsx';
import { useRueckgaengig, wiederEinsetzen, nochEntfernt } from '../../hooks/useRueckgaengig.js';
import { Icon } from '../../IconSystem.jsx';
import { betrag } from '../../utils/geld.js';
import { SELBSTBEHALT_MAX } from '../../data/kvgLeistungen.js';
import { IMPF_ARTEN, IMPF_ZAHLER, IMPF_RICHTPREISE, impfungenListe, naechsteImpfung, impfungOhneAlter, impfcheck,
  impfKosten, impfKostenJahr, impfZahlerVorschlag } from './rechnung.js';
import { monatJahr } from './zuhause.jsx';
import { gesundheitFarbe } from './bilder.jsx';

// Fach Impfausweis im Arztkoffer. Drei Fragen, je Rechnung → Zahl → Satz (rechnung.js 4–6):
//   1 Welche Impfung ist fällig?   Kalenderblatt (einmal je Seite) → Monat und Jahr      (Stebler Studios 19.11.2026, «A»)
//   2 Bin ich nach Plan geimpft?   Liste mit Abständen → «3 von 4»                      (Stebler Studios 19.11.2026, «Impfcheck»)
//   3 Was kosten mich die Impfungen? → Eigenanteil im Jahr; wer zahlt, Preise           (Stebler Studios 19.11.2026, «alle drei»)
// Abwählbar: jede Zeile im Impfcheck («trifft für mich nicht zu») und die Kosten als Ganzes. Kein Foto.
// Daten lokal in data.notfall: impfungen · impfcheckAus · impfKostenAus.

const datumText = (iso) => String(iso).slice(0, 10).split('-').reverse().join('.');
const neueId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const FRANKEN = /^\d{0,5}([.,]\d{0,2})?$/;
const franken = (s) => { const n = Number(String(s).replace(',', '.')); return Number.isFinite(n) && n > 0 ? n : 0; };

export const Impfausweis = ({ palette, t, data, onUpdateData, heute = new Date() }) => {
  const h = React.createElement;
  const lokal = (() => { const l = t('calendar.locale'); return typeof l === 'string' ? l : 'de-CH'; })();
  const nf = data?.notfall || {};
  const roh = Array.isArray(nf.impfungen) ? nf.impfungen : [];
  const aus = Array.isArray(nf.impfcheckAus) ? nf.impfcheckAus : [];
  const kostenZeigen = !nf.impfKostenAus;
  const liste = [...impfungenListe(data)].sort((a, b) => (a.datum < b.datum ? 1 : a.datum > b.datum ? -1 : 0));
  const faellig = naechsteImpfung(data, heute);
  const check = impfcheck(data, heute);
  const jahr = heute.getFullYear();
  const kostenJahr = impfKostenJahr(data, jahr);
  const [art, setArt] = useState('dt');
  const [name, setName] = useState('');
  const [datum, setDatum] = useState('');
  const [zahler, setZahler] = useState('');
  const [preis, setPreis] = useState('');
  const [gebuehr, setGebuehr] = useState('');
  const { entfernt, merke, rueckgaengig } = useRueckgaengig();
  const titel = (e) => (e.art === 'andere' && e.name ? e.name : t('impfausweis.arten.' + e.art));
  const datumOk = /^\d{4}-\d{2}-\d{2}$/.test(datum);
  const bereit = !!onUpdateData && datumOk && (art !== 'andere' || name.trim());
  const vorschlag = datumOk ? impfZahlerVorschlag(data, art, datum) : null;
  const zahlerWahl = zahler || vorschlag || '';
  const schreibe = (k, v) => onUpdateData && onUpdateData('notfall', k, v);

  const eintragen = () => {
    if (!bereit) return;
    const kosten = kostenZeigen ? { ...(zahlerWahl ? { zahler: zahlerWahl } : {}), ...(franken(preis) ? { preis: franken(preis) } : {}), ...(franken(gebuehr) ? { gebuehr: franken(gebuehr) } : {}) } : {};
    schreibe('impfungen', [...roh, { id: neueId(), art, datum, ...(art === 'andere' ? { name: name.trim() } : {}), ...kosten }]);
    setDatum(''); setName(''); setPreis(''); setGebuehr(''); setZahler('');
  };
  const entferne = (id) => {
    const index = roh.findIndex((e) => e.id === id);
    if (index < 0 || !onUpdateData) return;
    merke({ item: roh[index], index, text: titel(roh[index]) + ', ' + datumText(roh[index].datum) });
    schreibe('impfungen', roh.filter((e) => e.id !== id));
  };
  const zurueck = () => rueckgaengig(({ item, index }) => schreibe('impfungen', wiederEinsetzen(roh, item, index)));
  const abwaehlen = (key, weg) => schreibe('impfcheckAus', weg ? [...aus.filter((k) => k !== key), key] : aus.filter((k) => k !== key));

  const karte = { padding: space.md + 'px', background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.lg, marginBottom: space.md + 'px' };
  const frageZeile = (key) => h('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: '2px' } }, t(key));
  const hauptzahl = (teil, inhalt) => h('div', { 'data-instrument-zahl': teil, style: { fontSize: text['2xl'], fontWeight: weight.semi, lineHeight: 1.1, color: palette.text, fontVariantNumeric: 'tabular-nums' } }, inhalt);
  const satz = (inhalt, teil) => h('div', { 'data-teil': teil, style: { fontSize: text.sm, color: palette.mid, marginTop: '2px', lineHeight: leading.normal } }, inhalt);
  const leise = (inhalt, teil) => h('p', { 'data-teil': teil, style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, margin: space.sm + 'px 0 0' } }, inhalt);
  const kleinKnopf = (label, onClick, extra = {}) => onUpdateData && h('button', { type: 'button', onClick, ...extra,
    style: { ...knopfStil(palette, 'leise'), color: palette.mid, minHeight: '44px', fontSize: text.xs, padding: '0 4px', whiteSpace: 'nowrap' } }, label);
  const feld = { width: '100%', padding: space.sm + 'px', borderRadius: radius.md, border: '1px solid ' + palette.feldrand, background: palette.surface,
    color: palette.text, fontSize: text.sm, fontFamily: 'inherit', boxSizing: 'border-box', minHeight: '44px' };
  const beschriftung = (id, key) => h('label', { htmlFor: id, style: { display: 'block', fontSize: text.xs, color: palette.mid, margin: space.sm + 'px 0 2px' } }, t(key));
  const chf = (n) => betrag(n, { hoechstens: 2 });

  // ── 1 · Welche Impfung ist fällig? ──
  const frage1 = h('section', { 'data-teil': 'impf-faellig', style: { ...karte, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: space.md + 'px' } },
    faellig && h('div', { style: { flex: '0 0 auto', width: '80px', display: 'flex', justifyContent: 'center' } },
      h(Kalenderblatt, { iso: faellig.iso, palette, vorbei: faellig.vorbei, locale: lokal })),
    h('div', { style: { minWidth: 0, flex: '1 1 200px' } },
      frageZeile('impfausweis.frage'),
      faellig
        ? h(React.Fragment, null,
            hauptzahl('impfung', monatJahr(faellig.iso, lokal)),
            satz(t('impfausweis.arten.' + faellig.key) + ' · ' + (faellig.mit25 ? t('impfausweis.faelligSatz25') : t('impfausweis.faelligSatz', { jahre: faellig.abstand })), 'impf-satz'),
            faellig.vorbei && satz(t('impfausweis.vorbei'), 'impf-vorbei'))
        : satz(t(liste.length ? 'impfausweis.keineRegel' : 'impfausweis.leer'), 'impf-leer'),
      impfungOhneAlter(data) && satz(t('impfausweis.ohneGeburtsdatum'), 'impf-ohne-alter')));

  // ── 2 · Impfcheck: Bin ich nach Plan geimpft? ──
  const zeilenText = (z) => {
    if (z.status === 'spaeter') return t('impfausweis.check.ab', { alter: z.ab });
    if (z.status === 'vorbei') return t('impfausweis.check.bis', { alter: z.bis });
    if (z.status === 'jaehrlich') return t('impfausweis.check.jaehrlich') + (z.letzte ? ' · ' + t('impfausweis.check.zuletzt', { datum: datumText(z.letzte) }) : '');
    if (z.status === 'ok' && z.iso) return t('impfausweis.check.okBis', { datum: monatJahr(z.iso, lokal) });
    if (z.status === 'faellig') return t('impfausweis.check.faelligSeit', { datum: monatJahr(z.iso, lokal) });
    if (z.status === 'ok') return t('impfausweis.check.vollstaendig', { n: z.anzahl });
    if (z.status === 'teilweise') return t('impfausweis.check.teilweise', { n: z.anzahl, total: z.noetig });
    return t('impfausweis.check.offen');
  };
  const regel = (z) => t('impfausweis.check.regel.' + z.key);
  // Gezeichnete Zeichen (Icon-System), keine Schriftzeichen (glyphenImText.test.js). Der Zustand steht auch als Text.
  const zeichen = { ok: 'check', faellig: 'kalenderUeberfaellig', teilweise: 'plus', offen: 'kaestchen', jaehrlich: 'recurring' };
  const zeile = (z) => {
    const still = !zeichen[z.status];
    return h('li', { key: z.key, 'data-check': z.key, 'data-status': z.status,
      style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', padding: '4px 0', borderTop: '1px solid ' + palette.border } },
      h('span', { 'aria-hidden': 'true', style: { width: '20px', flexShrink: 0, display: 'inline-flex', justifyContent: 'center', color: z.status === 'faellig' ? palette.roseDeep || palette.text : gesundheitFarbe(palette) } },
        zeichen[z.status] ? h(Icon, { name: zeichen[z.status], size: 16 }) : null),
      h('span', { style: { flex: '1 1 auto', minWidth: 0 } },
        h('span', { style: { display: 'block', fontSize: text.sm, color: still ? palette.mid : palette.text, fontWeight: still ? weight.normal : weight.medium } }, t('impfausweis.arten.' + z.key)),
        h('span', { style: { display: 'block', fontSize: text.xs, color: palette.mid } }, (still ? '' : regel(z) + ' · ') + zeilenText(z))),
      z.status === 'aus'
        ? kleinKnopf(t('impfausweis.check.wiederZeigen'), () => abwaehlen(z.key, false), { 'aria-label': t('impfausweis.check.wiederZeigen') + ': ' + t('impfausweis.arten.' + z.key) })
        : !still && z.status !== 'ok' && kleinKnopf(t('impfausweis.check.trifftNicht'), () => abwaehlen(z.key, true), { 'aria-label': t('impfausweis.check.trifftNicht') + ': ' + t('impfausweis.arten.' + z.key) }));
  };
  const aktiv = check.zeilen.filter((z) => z.status !== 'spaeter' && z.status !== 'vorbei' && z.status !== 'aus');
  const ruhig = check.zeilen.filter((z) => z.status === 'spaeter' || z.status === 'vorbei' || z.status === 'aus');
  const frage2 = h('section', { 'data-teil': 'impf-check', 'aria-labelledby': 'mp-impf-check', style: karte },
    h('h3', { id: 'mp-impf-check', style: { margin: 0, fontSize: text.xs, fontWeight: weight.normal, color: palette.mid } }, t('impfausweis.check.frage')),
    check.alter == null
      ? satz(t('impfausweis.check.ohneAlter'), 'check-ohne-alter')
      : check.kind
        ? satz(t('impfausweis.check.kind'), 'check-kind')
        : h(React.Fragment, null,
            hauptzahl('impfcheck', t('notfallKapitel.vonN', { n: check.erledigt, total: check.gesamt })),
            satz(t('impfausweis.check.satz', { alter: check.alter }), 'check-satz'),
            h('ul', { style: { listStyle: 'none', margin: space.sm + 'px 0 0', padding: 0 } }, aktiv.map(zeile), ruhig.map(zeile)),
            check.tessin && leise(t('impfausweis.check.tessin'), 'check-tessin')),
    leise(t('impfausweis.check.nichtDabei') + ' ' + t('impfausweis.check.hinweis'), 'check-nicht-dabei'));

  // ── 3 · Was kosten mich die Impfungen? ──
  const frage3 = kostenZeigen
    ? h('section', { 'data-teil': 'impf-kosten', 'aria-labelledby': 'mp-impf-kosten', style: karte },
        h('h3', { id: 'mp-impf-kosten', style: { margin: 0, fontSize: text.xs, fontWeight: weight.normal, color: palette.mid } }, t('impfausweis.kosten.frage', { jahr })),
        kostenJahr.mitPreis
          ? h(React.Fragment, null,
              hauptzahl('impfkosten', chf(kostenJahr.eigen)),
              satz(t('impfausweis.kosten.satz', { gesamt: chf(kostenJahr.gesamt) }) + (kostenJahr.offen ? ' ' + t('impfausweis.kosten.zusatzOffen') : ''), 'kosten-satz'))
          : satz(t('impfausweis.kosten.leer'), 'kosten-leer'),
        leise(t('impfausweis.kosten.wer') + ' ' + t('impfausweis.kosten.max', { max: chf(SELBSTBEHALT_MAX) }) + ' ' + t('impfausweis.kosten.schaetzung'), 'kosten-wer'),
        h('div', { style: { display: 'flex', justifyContent: 'flex-end' } }, kleinKnopf(t('impfausweis.kosten.ausblenden'), () => schreibe('impfKostenAus', true))))
    : h('div', { 'data-teil': 'impf-kosten-aus', style: { margin: '0 0 ' + space.md + 'px' } }, kleinKnopf(t('impfausweis.kosten.zeigen'), () => schreibe('impfKostenAus', false)));

  const quellen = h('div', { 'data-teil': 'impf-quelle', style: { margin: '0 0 ' + space.md + 'px' } },
    h(Belege, { palette, t, zeile: t('impfausweis.quelle') }));

  // ── Eingetragene Impfungen ──
  const kostenText = (e) => {
    const k = impfKosten(e);
    if (!k) return null;
    const wer = k.zahler ? t('impfausweis.zahler.' + k.zahler) : t('impfausweis.kosten.offenZahler');
    if (k.grund === 'vor2026') return wer + ' · ' + t('impfausweis.kosten.vor2026', { betrag: chf(k.gesamt) });
    if (k.grund === 'hpv') return wer + ' · ' + t('impfausweis.kosten.hpv');
    if (k.eigen == null) return wer + ' · ' + chf(k.gesamt);
    return wer + ' · ' + t(k.hoechstens ? 'impfausweis.kosten.eigen' : 'impfausweis.kosten.selbstGanz', { betrag: chf(k.eigen) });
  };
  const eintraege = h('section', { 'data-teil': 'impf-liste', 'aria-labelledby': 'mp-impf-liste', style: karte },
    h('h3', { id: 'mp-impf-liste', style: { margin: 0, fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t('impfausweis.eingetragen')),
    liste.length
      ? h('ul', { style: { listStyle: 'none', margin: space.sm + 'px 0 0', padding: 0 } },
          liste.map((e) => h('li', { key: e.id || e.art + e.datum, 'data-impfung': e.art,
            style: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', padding: '6px 0', borderTop: '1px solid ' + palette.border } },
            h('span', { style: { flex: '1 1 auto', minWidth: 0 } },
              h('span', { style: { display: 'block', fontSize: text.sm, color: palette.text, overflowWrap: 'anywhere' } }, titel(e)),
              kostenZeigen && kostenText(e) && h('span', { 'data-teil': 'eintrag-kosten', style: { display: 'block', fontSize: text.xs, color: palette.mid } }, kostenText(e))),
            h('span', { style: { fontSize: text.sm, color: palette.mid, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' } }, datumText(e.datum)),
            e.id && kleinKnopf(t('impfausweis.entfernen'), () => entferne(e.id), { 'aria-label': t('impfausweis.entfernen') + ': ' + titel(e) + ', ' + datumText(e.datum) }))))
      : satz(t('impfausweis.listeLeer'), 'impf-liste-leer'),
    h(RueckgaengigMeldung, { palette, t, entfernt: nochEntfernt(entfernt, roh), onRueckgaengig: zurueck }));

  // ── Formular ──
  const richtpreis = IMPF_RICHTPREISE[art];
  const betragFeld = (id, key, wert, setze, hinweis) => h(React.Fragment, null,
    beschriftung(id, key),
    h('input', { id, type: 'text', inputMode: 'decimal', value: wert, autoComplete: 'off', 'aria-describedby': hinweis ? id + '-hinweis' : undefined,
      onChange: (e) => { if (FRANKEN.test(e.target.value)) setze(e.target.value); }, style: feld }),
    hinweis && h('div', { id: id + '-hinweis', 'data-teil': id + '-hinweis', style: { fontSize: text.xs, color: palette.mid, marginTop: '2px' } }, hinweis));
  const formular = onUpdateData && h('section', { 'data-teil': 'impf-eintragen', 'aria-labelledby': 'mp-impf-neu', style: karte },
    h('h3', { id: 'mp-impf-neu', style: { margin: 0, fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t('impfausweis.neu')),
    beschriftung('mp-impf-art', 'impfausweis.welche'),
    h('select', { id: 'mp-impf-art', value: art, onChange: (e) => setArt(e.target.value), style: feld },
      IMPF_ARTEN.map((a) => h('option', { key: a, value: a }, t('impfausweis.arten.' + a)))),
    art === 'andere' && beschriftung('mp-impf-name', 'impfausweis.name'),
    art === 'andere' && h('input', { id: 'mp-impf-name', type: 'text', value: name, maxLength: 80, onChange: (e) => setName(e.target.value), style: feld }),
    beschriftung('mp-impf-datum', 'impfausweis.datum'),
    h('input', { id: 'mp-impf-datum', type: 'date', value: datum, max: '9999-12-31', onChange: (e) => setDatum(e.target.value), style: feld }),
    kostenZeigen && h(React.Fragment, null,
      beschriftung('mp-impf-zahler', 'impfausweis.kosten.werZahlt'),
      h('select', { id: 'mp-impf-zahler', value: zahlerWahl, onChange: (e) => setZahler(e.target.value), style: feld },
        !zahlerWahl && h('option', { value: '' }, t('impfausweis.zahler.waehlen')),
        IMPF_ZAHLER.map((z) => h('option', { key: z, value: z }, t('impfausweis.zahler.' + z)))),
      betragFeld('mp-impf-preis', 'impfausweis.kosten.impfstoff', preis, setPreis,
        richtpreis ? t('impfausweis.kosten.richtpreis', { betrag: chf(richtpreis.chf), praeparat: richtpreis.praeparat }) : t('impfausweis.kosten.richtpreisFehlt')),
      betragFeld('mp-impf-gebuehr', 'impfausweis.kosten.gebuehr', gebuehr, setGebuehr, t('impfausweis.kosten.gebuehrHinweis'))),
    h('button', { type: 'button', onClick: eintragen, disabled: !bereit, 'data-teil': 'impf-speichern',
      style: { ...knopfStil(palette, 'haupt', { disabled: !bereit }), marginTop: space.md + 'px' } }, t('impfausweis.speichern')));

  return h('div', { 'data-teil': 'impfausweis', style: { maxWidth: '640px', margin: '0 auto' } },
    h(PageTitle, { palette, icon: h('span', { 'aria-hidden': 'true', style: { display: 'inline-flex', color: gesundheitFarbe(palette) } }, h(Icon, { name: 'health', size: 22 })), style: { marginBottom: space.md } },
      t('arztkoffer.faecher.impfausweis.title')),
    frage1, frage2, frage3, quellen, eintraege, formular);
};

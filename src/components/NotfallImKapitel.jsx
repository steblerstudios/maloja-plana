import React, { useEffect, useState } from 'react';
import { Icon, hinweisZeichen } from '../IconSystem.jsx';
import { text, weight, leading, space, radius } from '../config/tokens.js';
import { feldErledigt, NA_FELD, naUmschalten, trifftNichtZu } from '../utils/vollstaendigkeit.js';
import { CHAPTER_KEYS } from '../config/constants.js';

// Kapitel Notfall · «ein Ort» (Fassung 6, Runde 9, Entwurf AE, Entscheid Sophie 24.10.2026; gebaut Abnahme
// 25.10.2026). Das Kapitel ist der eine Notfall-Ort; der frühere Einstieg (#/notfalleinstieg) leitet hierher.
// Oben, nach der Zusammenfassung, vier Teile:
//   1. Im Ernstfall — Knopf zur Notfallkarte (bleibt beim Scrollen oben stehen, ausser während man tippt),
//      darunter «… anrufen» (Telefon-Link der Notfall-Kontaktperson, nur mit erfasster Nummer).
//   2. Bereit für den Ernstfall — «19 von 20»: die verschiedenen Angaben der drei Szenarien, darunter nur das
//      Fehlende, gleich hier ausfüllbar. Angaben aus anderen Kapiteln führen in jenes Kapitel. Die drei Szenarien
//      zugeklappt zum Nachsehen (früher «Was brauchen Sie im Notfall?», offen unten).
//   3. Ihre Notfall-Unterlagen — vier Kacheln: Notfallkarte, Notfallpass, Notfall-Dossier, Portemonnaie-Karte.
//   4. Vorsorge — vier Felder ✓/○ mit «x von 4 geregelt»; offene führen selbst zum Werkzeug.
// Sprungmarke NOTFALL_ANKER (UMLEITUNGEN.notfalleinstieg).

export const NOTFALL_ANKER = 'mp-notfall-ernstfall';

export const SCENARIOS = [
  {
    key: 'unfall',
    fields: [
      { chapter: 'notfall', k: 'emergencyContact' },
      { chapter: 'notfall', k: 'emergencyPhone' },
      { chapter: 'notfall', k: 'bloodType' },
      { chapter: 'notfall', k: 'allergies' },
      { chapter: 'notfall', k: 'medications' },
      { chapter: 'notfall', k: 'doctor' },
      { chapter: 'notfall', k: 'doctorPhone' },
      { chapter: 'versicherungen', k: 'kkInsurer' },
      { chapter: 'versicherungen', k: 'kkCardNumber' },
    ],
  },
  {
    key: 'spital',
    fields: [
      { chapter: 'basis', k: 'firstName' },
      { chapter: 'basis', k: 'lastName' },
      { chapter: 'basis', k: 'dateOfBirth' },
      { chapter: 'basis', k: 'ahv' },
      { chapter: 'versicherungen', k: 'kkInsurer' },
      { chapter: 'versicherungen', k: 'kkCardNumber' },
      { chapter: 'versicherungen', k: 'franchise' },
      { chapter: 'notfall', k: 'emergencyContact' },
      { chapter: 'notfall', k: 'emergencyPhone' },
      { chapter: 'notfall', k: 'patientenverfuegung' },
    ],
  },
  {
    key: 'behoerde',
    fields: [
      { chapter: 'basis', k: 'firstName' },
      { chapter: 'basis', k: 'lastName' },
      { chapter: 'basis', k: 'dateOfBirth' },
      { chapter: 'basis', k: 'canton' },
      { chapter: 'wohnen', k: 'address' },
      { chapter: 'wohnen', k: 'postalCode' },
      { chapter: 'wohnen', k: 'city' },
      { chapter: 'basis', k: 'ahv' },
      { chapter: 'behoerden', k: 'cantoneOfTaxation' },
    ],
  },
];

// Die verschiedenen Angaben der drei Szenarien, ohne Doppelte (20), in der Reihenfolge des ersten Auftretens.
export const NOTFALL_ANGABEN = SCENARIOS.flatMap((s) => s.fields)
  .filter((f, i, alle) => alle.findIndex((x) => x.chapter === f.chapter && x.k === f.k) === i);

// Wie bereit: erledigt (Wert oder «trifft nicht zu»), gesamt, und das Fehlende mit den Szenarien, für die es fehlt.
export const bereitschaft = (data) => {
  const d = data || {};
  const fehlend = NOTFALL_ANGABEN
    .filter((f) => !feldErledigt(d[f.chapter], f.k))
    .map((f) => ({ ...f, lagen: SCENARIOS.filter((s) => s.fields.some((x) => x.chapter === f.chapter && x.k === f.k)).map((s) => s.key) }));
  return { erledigt: NOTFALL_ANGABEN.length - fehlend.length, gesamt: NOTFALL_ANGABEN.length, fehlend };
};

// Vorsorge: geregelt ist, was entschieden ist. Organspende: jede Wahl ausser «Noch nicht entschieden»;
// die drei anderen: «Ja».
export const VORSORGE = [
  { k: 'organDonor', weg: null },
  { k: 'patientenverfuegung', weg: 'patientenverfuegung', wegKey: 'notfallKapitel.erstellen' },
  { k: 'vorsorgeauftrag', weg: 'vorsorgeauftrag', wegKey: 'notfallKapitel.erstellen' },
  { k: 'bestattungswuensche', weg: 'bestattung', wegKey: 'notfallKapitel.festhalten' },
];
export const vorsorgeGeregelt = (nf, k) => {
  const v = (nf || {})[k];
  if (!v) return false;
  return k === 'organDonor' ? v !== 'undecided' : v === 'yes';
};

// Felder, die oben direkt ausgefüllt werden (Text, Telefon). Auswahlfelder führen zum Feld im Formular.
const EINGABE = { emergencyContact: 'text', emergencyPhone: 'tel', allergies: 'text', medications: 'text', doctor: 'text', doctorPhone: 'tel' };

// Während getippt wird, steht der Ernstfall-Knopf nicht mehr oben fest: er soll kein Feld verdecken, über
// dem die Tastatur aufgeht (Prüfauftrag aus dem Entscheid).
const useTippt = () => {
  const [tippt, setTippt] = useState(false);
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const istFeld = (el) => !!el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
    const rein = (e) => setTippt(istFeld(e.target));
    const raus = () => setTippt(false);
    document.addEventListener('focusin', rein);
    document.addEventListener('focusout', raus);
    return () => { document.removeEventListener('focusin', rein); document.removeEventListener('focusout', raus); };
  }, []);
  return tippt;
};

export const NotfallImKapitel = ({ palette, t, data, chapters, onNavigate, onUpdate, demoMode, zumFeld, onKarteDrucken, karteMoeglich, karteVorschau }) => {
  const tippt = useTippt();
  const [eingaben, setEingaben] = useState({});
  if (!onNavigate) return null;
  const h = React.createElement;
  const alle = data || {};
  const nf = alle.notfall || {};
  const kapitelListe = chapters || [];
  const feldName = (kap, k) => {
    const ch = kapitelListe.find((c) => c.key === kap);
    const f = ch && ch.fields.find((x) => x.k === k);
    return f ? f.label : k;
  };
  const kapitelTitel = (kap) => (kapitelListe.find((c) => c.key === kap) || {}).title || kap;
  const kapH = { margin: space.lg + 'px 0 ' + space.xs + 'px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text };
  const klein = { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal };
  const ruhigKnopf = { minHeight: '44px', padding: '0 ' + space.md + 'px', borderRadius: radius.sm, border: '1px solid ' + palette.border, background: palette.surface, color: palette.text, fontFamily: 'inherit', fontSize: text.sm, cursor: 'pointer' };
  const notfallRot = palette.roseDeep || palette.rose;

  // 1. Im Ernstfall
  const telefon = String(nf.emergencyPhone || '').trim();
  const telHref = telefon ? 'tel:' + telefon.replace(/[^\d+]/g, '') : '';
  const ernstfall = h('div', { id: NOTFALL_ANKER, 'data-teil': 'notfall-ernstfall', style: { marginBottom: space.md + 'px', scrollMarginTop: 'var(--mp-sprungabstand)' } },
    h('div', { 'data-stehend': tippt ? '0' : '1', style: { position: tippt ? 'static' : 'sticky', top: 'calc(var(--mp-sprungabstand, 64px) + 4px)', zIndex: 3 } },
      h('button', {
        type: 'button', onClick: () => onNavigate('notfallkarte'),
        style: {
          display: 'flex', alignItems: 'center', gap: space.sm + 'px', width: '100%', minHeight: '64px', textAlign: 'left',
          padding: space.sm + 'px ' + space.md + 'px', background: notfallRot, color: '#fff', border: 'none',
          borderRadius: radius.md, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 18px rgba(0,0,0,.22)',
        },
      },
        h('span', { 'aria-hidden': 'true', style: { display: 'inline-flex', flexShrink: 0, color: '#fff' } }, h(Icon, { name: 'phone', size: 22 })),
        h('span', { style: { flex: 1, minWidth: 0 } },
          h('span', { style: { display: 'block', fontSize: text.body, fontWeight: weight.semi, color: '#fff' } }, t('notfallKapitel.ernstfallTitel')),
          h('small', { style: { display: 'block', fontSize: text.xs, color: '#fff', lineHeight: leading.normal } }, t('notfallKapitel.ernstfallSub'))),
        h('span', { 'aria-hidden': 'true', style: { color: '#fff', fontSize: text.lg } }, '›'))
    ),
    nf.emergencyContact && telHref && h('a', {
      href: telHref, 'data-teil': 'notfall-anrufen',
      style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.sm + 'px', minHeight: '48px', marginTop: space.sm + 'px', padding: space.xs + 'px ' + space.md + 'px', border: '1px solid ' + palette.border, borderRadius: radius.md, textDecoration: 'none', color: palette.text },
    },
      h('span', { style: { minWidth: 0 } },
        h('span', { style: { display: 'block', fontSize: text.sm, fontWeight: weight.medium, color: palette.text } }, t('notfallKapitel.anrufen', { name: nf.emergencyContact })),
        h('small', { style: { display: 'block', ...klein } }, t('chapters.notfall.fields.emergencyContact') + ' · ' + telefon)),
      h('span', { 'aria-hidden': 'true', style: { display: 'inline-flex', color: palette.sandDeep || palette.mid } }, h(Icon, { name: 'phone', size: 18 })))
  );

  // 2. Bereit für den Ernstfall
  const stand = bereitschaft(alle);
  const pct = Math.round((stand.erledigt / stand.gesamt) * 100);
  const lagenName = (keys) => keys.map((k) => '«' + t('notfallEinstieg.' + k + '.title') + '»').join(', ');
  const speichern = (f) => {
    const wert = String(eingaben[f.k] || '').trim();
    if (!wert || demoMode || !onUpdate) return;
    // Medikamente stehen im Kapitel als Liste (MedicationManager); hier ein erster Eintrag mit Name und Dosis.
    if (f.k === 'medications') onUpdate('medicationsList', [{ name: wert, dose: '', unit: '' }]);
    else onUpdate(f.k, wert);
    setEingaben((e) => ({ ...e, [f.k]: '' }));
  };
  const keineMedikamente = () => {
    if (demoMode || !onUpdate) return;
    if (!trifftNichtZu(nf, 'medications')) onUpdate(NA_FELD, naUmschalten(nf, 'medications'));
  };
  const fehlZeile = (f) => {
    const id = 'mp-notfall-ein-' + f.k;
    // Offen: das Kästchen-Zeichen wie in den Szenarien (Form, nicht nur Farbe); keine geklebten Glyphen.
    const titel = h('span', { style: { fontSize: text.sm, color: palette.text } }, hinweisZeichen('kaestchen', 12), feldName(f.chapter, f.k), ' ',
      h('small', { style: { fontSize: text.xs, color: palette.mid } }, '· ' + t('notfallKapitel.fehltFuer', { lagen: lagenName(f.lagen) })));
    const rahmen = { border: '1px dashed ' + notfallRot, borderRadius: radius.md, padding: space.sm + 'px ' + space.md + 'px', marginBottom: space.sm + 'px' };
    // Aus einem anderen Kapitel: der Weg dorthin.
    if (f.chapter !== 'notfall') {
      return h('div', { key: f.chapter + '.' + f.k, 'data-fehlt': f.k, style: { ...rahmen, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.sm + 'px', flexWrap: 'wrap' } },
        titel,
        h('button', { type: 'button', className: 'mp-link', onClick: () => onNavigate('chapter', CHAPTER_KEYS.indexOf(f.chapter)), style: { ...ruhigKnopf, background: 'none' } }, kapitelTitel(f.chapter) + ' ›'));
    }
    // Auswahl (Blutgruppe, Patientenverfügung): zum Feld im Formular unten.
    if (!EINGABE[f.k]) {
      return h('div', { key: f.k, 'data-fehlt': f.k, style: { ...rahmen, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.sm + 'px', flexWrap: 'wrap' } },
        titel,
        h('button', { type: 'button', className: 'mp-link', onClick: () => zumFeld && zumFeld(f.k), style: { ...ruhigKnopf, background: 'none' } }, t('notfallKapitel.ergaenzenUnten')));
    }
    return h('div', { key: f.k, 'data-fehlt': f.k, style: rahmen },
      h('label', { htmlFor: id, style: { display: 'block' } }, titel),
      h('input', {
        id, type: EINGABE[f.k], value: eingaben[f.k] || '', disabled: !!demoMode,
        placeholder: f.k === 'medications' ? t('notfallKapitel.medikamentPlatzhalter') : '',
        autoComplete: 'off',
        onChange: (e) => setEingaben((x) => ({ ...x, [f.k]: e.target.value })),
        onKeyDown: (e) => { if (e.key === 'Enter') speichern(f); },
        style: { width: '100%', boxSizing: 'border-box', margin: space.xs + 'px 0', padding: '10px 12px', minHeight: '44px', borderRadius: radius.sm, border: '1px solid ' + palette.border, background: palette.up, color: palette.text, fontFamily: 'inherit', fontSize: text.body },
      }),
      demoMode
        ? h('p', { style: { ...klein, margin: 0 } }, t('demo.readOnlyHint'))
        : h('div', { style: { display: 'flex', gap: space.sm + 'px', flexWrap: 'wrap' } },
            h('button', { type: 'button', onClick: () => speichern(f), style: ruhigKnopf }, t('notfallKapitel.speichern')),
            f.k === 'medications' && h('button', { type: 'button', onClick: keineMedikamente, style: { ...ruhigKnopf, background: 'none' } }, t('notfallKapitel.keineMedikamente'))));
  };
  const szenarienZeile = SCENARIOS.flatMap((s, i) => {
    const n = s.fields.filter((f) => feldErledigt(alle[f.chapter], f.k)).length;
    const name = t('notfallEinstieg.' + s.key + '.title');
    return [i > 0 ? ' · ' : '', n === s.fields.length
      ? h('span', { key: s.key }, name, ' ', hinweisZeichen('check', 11))
      : h('span', { key: s.key }, name + ' ' + t('notfallKapitel.vonN', { n, total: s.fields.length }))];
  });
  const bereit = h('section', { 'data-teil': 'notfall-bereit', 'aria-labelledby': 'mp-notfall-bereit' },
    h('h4', { id: 'mp-notfall-bereit', style: kapH }, t('notfallKapitel.bereitTitel')),
    h('div', { style: { display: 'flex', alignItems: 'baseline', gap: space.sm + 'px', flexWrap: 'wrap' } },
      h('span', { style: { fontSize: '28px', fontWeight: weight.semi, color: palette.text, whiteSpace: 'nowrap' } }, t('notfallKapitel.vonN', { n: stand.erledigt, total: stand.gesamt })),
      h('span', { style: klein }, t('notfallKapitel.bereitSatz'))),
    h('div', { 'aria-hidden': 'true', style: { height: '6px', background: palette.up, borderRadius: radius.hair, overflow: 'hidden', margin: space.xs + 'px 0 ' + space.sm + 'px' } },
      h('div', { style: { width: pct + '%', height: '100%', background: notfallRot } })),
    stand.fehlend.length === 0
      ? h('p', { style: { fontSize: text.sm, color: palette.sageDeep || palette.text, margin: '0 0 ' + space.sm + 'px' } }, t('notfallEinstieg.allDone'))
      : stand.fehlend.map(fehlZeile),
    h('details', { 'data-teil': 'notfall-szenarien', style: { borderTop: '1px solid ' + palette.border + '88', borderBottom: '1px solid ' + palette.border + '88' } },
      h('summary', { style: { cursor: 'pointer', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: space.sm + 'px', color: palette.text } },
        h('span', { style: { minWidth: 0 } },
          h('span', { style: { display: 'block', fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t('notfallKapitel.szenarien')),
          h('small', { style: { display: 'block', ...klein } }, szenarienZeile)),
        h('span', { style: { fontSize: text.xs, color: palette.sandDeep || palette.mid, whiteSpace: 'nowrap' } }, t('notfallKapitel.ansehen'))),
      SCENARIOS.map((s) => h('p', { key: s.key, style: { ...klein, margin: space.xs + 'px 0' } },
        h('b', { style: { color: palette.text } }, t('notfallEinstieg.' + s.key + '.title')), ' — ',
        s.fields.flatMap((f, i) => [i > 0 ? ', ' : '', feldErledigt(alle[f.chapter], f.k)
          ? feldName(f.chapter, f.k)
          : h('span', { key: f.chapter + f.k }, hinweisZeichen('kaestchen', 10), feldName(f.chapter, f.k))]), '.'))
    )
  );

  // 3. Ihre Notfall-Unterlagen
  const kachel = (key, titel, sub, ikon, onClick, aus) => h('button', {
    key, type: 'button', onClick, disabled: !!aus, 'data-kachel': key,
    style: { display: 'block', textAlign: 'left', minHeight: '88px', padding: space.sm + 'px ' + space.md + 'px', border: '1px solid ' + palette.border, borderRadius: radius.md, background: palette.surface, color: palette.text, fontFamily: 'inherit', cursor: aus ? 'default' : 'pointer', minWidth: 0 },
  },
    h('span', { 'aria-hidden': 'true', style: { display: 'inline-flex', color: notfallRot } }, h(Icon, { name: ikon, size: 20 })),
    h('span', { style: { display: 'block', marginTop: '6px', fontSize: text.sm, fontWeight: weight.semi, color: palette.text, overflowWrap: 'break-word', hyphens: 'auto', WebkitHyphens: 'auto' } }, titel),
    h('small', { style: { display: 'block', ...klein } }, sub));
  const unterlagen = h('section', { 'data-teil': 'notfall-unterlagen', 'aria-labelledby': 'mp-notfall-unterlagen' },
    h('h4', { id: 'mp-notfall-unterlagen', style: kapH }, t('notfallKapitel.unterlagenTitel')),
    h('p', { style: { ...klein, margin: '0 0 ' + space.sm + 'px' } }, t('notfallKapitel.unterlagenSatz')),
    h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: space.sm + 'px' } },
      kachel('notfallkarte', t('notfallkarte.title'), t('notfallKapitel.karteSub'), 'phone', () => onNavigate('notfallkarte')),
      kachel('notfallpass', t('notfallpass.title'), t('notfallKapitel.passSub'), 'lock', () => onNavigate('notfallpass')),
      kachel('notfalldossier', t('notfallDossier.title'), t('notfallKapitel.dossierSub'), 'mappe', () => onNavigate('notfalldossier')),
      kachel('portemonnaie', t('notfallKapitel.portemonnaie'), karteMoeglich ? t('notfallKapitel.portemonnaieSub') : t('notfallKapitel.portemonnaieLeer'), 'document', onKarteDrucken, !karteMoeglich)),
    karteVorschau || null
  );

  // 4. Vorsorge
  const geregelt = VORSORGE.filter((v) => vorsorgeGeregelt(nf, v.k)).length;
  const vorsorgeWert = (k) => {
    const v = nf[k];
    if (!v) return t('notfallKapitel.nichtErfasst');
    return t('chapters.notfall.fields.' + k + '.options.' + v) || v;
  };
  const vorsorge = h('section', { 'data-teil': 'notfall-vorsorge', 'aria-labelledby': 'mp-notfall-vorsorge' },
    h('h4', { id: 'mp-notfall-vorsorge', style: kapH }, t('notfallKapitel.vorsorgeTitel')),
    h('p', { style: { ...klein, margin: '0 0 ' + space.sm + 'px' } }, t('notfallKapitel.vorsorgeSatz'), ' ',
      h('span', { style: { color: palette.text } }, t('notfallKapitel.geregelt', { n: geregelt, total: VORSORGE.length }))),
    h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: space.sm + 'px' } },
      VORSORGE.map((v) => {
        const ok = vorsorgeGeregelt(nf, v.k);
        const innen = [
          h('span', { key: 'n', style: { display: 'block', fontSize: text.sm, fontWeight: weight.semi, color: palette.text, hyphens: 'auto', WebkitHyphens: 'auto', overflowWrap: 'break-word' } }, t('notfallKapitel.vorsorge.' + v.k)),
          // Zeichen UND Wort — nicht nur Farbe (Haken / Kästchen).
          h('span', { key: 'w', style: { display: 'block', fontSize: text.xs, color: ok ? palette.text : palette.mid, overflowWrap: 'break-word' } }, hinweisZeichen(ok ? 'check' : 'kaestchen', 12), (v.k === 'organDonor' && ok && nf.organDonor !== 'declined' && nf.organDonor !== 'delegated' ? t('notfallKapitel.zustimmung') : vorsorgeWert(v.k))),
        ];
        const stil = { display: 'block', textAlign: 'left', minHeight: '64px', padding: space.sm + 'px', borderRadius: radius.sm, border: '1px solid ' + (ok ? (palette.sage || palette.border) : palette.border), background: 'none', fontFamily: 'inherit', minWidth: 0 };
        if (ok || !v.weg) {
          // Offen ohne eigenes Werkzeug (Organspende): zum Feld im Formular.
          if (!ok && zumFeld) {
            return h('button', { key: v.k, type: 'button', onClick: () => zumFeld(v.k), style: { ...stil, cursor: 'pointer', color: palette.text } }, ...innen,
              h('span', { key: 'g', style: { display: 'block', fontSize: text.xs, color: palette.sandDeep || palette.mid, marginTop: '2px' } }, t('notfallKapitel.ergaenzen')));
          }
          return h('div', { key: v.k, 'data-vorsorge': v.k, style: stil }, ...innen);
        }
        return h('button', { key: v.k, type: 'button', 'data-vorsorge': v.k, onClick: () => onNavigate(v.weg), style: { ...stil, cursor: 'pointer', color: palette.text } }, ...innen,
          h('span', { key: 'g', style: { display: 'block', fontSize: text.xs, color: palette.sandDeep || palette.mid, marginTop: '2px' } }, t(v.wegKey)));
      }))
  );

  return h('div', { 'data-teil': 'notfall-ort', style: { marginBottom: space.lg + 'px' } }, ernstfall, bereit, unterlagen, vorsorge);
};

export default NotfallImKapitel;

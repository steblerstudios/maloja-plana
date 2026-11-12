import { lohnVergleichSperre } from './data/lohnEinordnung.js';
import React, { useState, useMemo } from 'react';
import { berechneTaggeld, alvErgebnis, ALV_PARAMS, ALV_DATA_SOURCE } from './data/alvRechner.js';
import { RechnerForm, ErgebnisZahl, ErgebnisZeile, Einzelwahl } from './components/RechnerForm.jsx';
import { OfficialLinkBox } from './OfficialLinkBox.jsx';
import { ErklaerseiteLink, VerstehenImWerkzeug } from './components/ErklaerseiteLink.jsx';
import { text, weight, space, radius, leading } from './config/tokens.js';
import { zahl, betrag } from './utils/geld.js';
import { lohnBasis, lohnBasisOffen } from './utils/jahreslohnAusProfil.js';
import { nettoZuBruttoRichtwert } from './data/lohnAbzuege.js';
import { alterUndRentenalter } from './utils/nettoAusProfil.js';
import { kindAlter } from './utils/sozialhilfeVorbefuellung.js';
import { linkStil } from './components/PrimaryButton.jsx';
import { ansichtName } from './config/ansichtenRegister.js';

function currentAge(dateStr) {
  if (!dateStr) return null;
  const birth = new Date(dateStr);
  if (isNaN(birth.getTime())) return null;
  const now = new Date();
  return now.getFullYear() - birth.getFullYear() - (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
}

// Rechner-Form X (F7-A2, 27.10.2026): Ergebnis zuerst, dann «Ihre Angaben», RAV, offizielle Stelle, Quelle.
export const AlvRechner = ({ palette, t, data, onNavigate }) => {
  // Kapitel 5, L1 (10.11.2026): das Alter bestimmt die Höchstzahl der Taggelder (AVIG Art. 27 Abs. 2, 5bis).
  // Vorbefüllt aus dem Geburtsdatum im Profil; ein eingetipptes Alter geht vor. Leer → keine feste Zahl.
  const profilAlter = currentAge(data.basis?.dateOfBirth);
  const [alterEingabe, setAlterEingabe] = useState(profilAlter != null ? String(profilAlter) : '');
  const alterZahl = String(alterEingabe).trim() === '' ? NaN : Number(String(alterEingabe).replace(',', '.'));
  const alter = Number.isFinite(alterZahl) && alterZahl >= 15 && alterZahl <= 70 ? Math.floor(alterZahl) : null;
  // 70 % statt 80 % gilt u. a. nur ohne Unterhaltspflicht gegenüber Kindern unter 25 Jahren
  // (AVIG Art. 22 Abs. 2 Bst. a). Kapitel 5, L4 (10.11.2026): vorbefüllt werden nur Kinder unter 18 — ab 18
  // besteht die Unterhaltspflicht nur, solange das Kind in Ausbildung ist (ZGB Art. 277 Abs. 2). Ein arbeitendes
  // 22-jähriges Kind hob vorher 70 % auf 80 %. Wer ein volljähriges Kind in Ausbildung hat, wählt «Ja». Fassung 6 las nur `age`; ein Kind mit Geburtsdatum und leerem Alter zählte
  // weiter, auch mit 30 (Befund X, `AlvRechner.jsx:22,30`, F7 27.10.2026). Jetzt dieselbe Altersregel wie die
  // Sozialhilfe-Vorbefüllung (`kindAlter`: Geburtsdatum vor Alter). Ohne beides zählt das Kind — überschreibbar.
  const householdChildren = (data.basis?.household?.children || [])
    .filter((c) => { const a = kindAlter(c); return a == null || a < 18; }).length;

  // ALV-Taggeld basiert auf dem BRUTTO-Lohn. Als Brutto hinterlegt → vorbefüllt. Als Netto hinterlegt →
  // geschätztes Brutto, sichtbar «geschätzt» (F7-R4, 27.10.2026; Schätzung wie EinkommenFeld:
  // `nettoZuBruttoRichtwert`, AHV/ALV + PK nach Alter). Ein eingetipptes Brutto hat Vorrang (auch leer).
  // Art offen → leer mit Hinweis, wie bisher (einkommensartOffen.test.js).
  const basis = lohnBasis(data.finanzen);
  const basisOffen = lohnBasisOffen(data.finanzen);
  const profilLohn = Number(data.finanzen?.monthlyIncome) || 0;
  const { bvgAlter, rentenalter, beitragsfrei } = alterUndRentenalter(data.basis);
  // Rente, Geschäftsgewinn oder mögliche Quellensteuer: kein verlässliches Brutto, das Feld bleibt leer (Predeploy 02.11.2026).
  const sperre = lohnVergleichSperre(data, rentenalter);
  const bruttoSchaetzung = basis === 'netto' && profilLohn > 0 && sperre !== 'keinLohn' && sperre !== 'quellensteuer'
    ? nettoZuBruttoRichtwert(profilLohn, bvgAlter, rentenalter, undefined, beitragsfrei) : 0;
  const [eingetippt, setEingetippt] = useState(basis === 'brutto' && profilLohn > 0 && sperre !== 'keinLohn' ? String(data.finanzen.monthlyIncome) : null);
  const geschaetzt = eingetippt == null && bruttoSchaetzung > 0;
  const bruttolohn = eingetippt != null ? eingetippt : (geschaetzt ? String(bruttoSchaetzung) : '');
  const [hatKinder, setHatKinder] = useState(householdChildren > 0);
  const [beitragsmonate, setBeitragsmonate] = useState('');
  const [ivGrad40, setIvGrad40] = useState(false);

  const parsedLohn = Number(String(bruttolohn).replace(',', '.')) || 0;
  const parsedMonate = Number(beitragsmonate) || 0;
  // Kapitel 5, L2: unter 12 Beitragsmonaten kein Betrag. Wer befreit ist, bekommt einen Pauschalansatz, nicht
  // den bisherigen Lohn (AVIG Art. 13, 14, Art. 23 Abs. 2) — ein Betrag aus dem Lohn wäre falsch.
  const unter12 = beitragsmonate !== '' && parsedMonate < 12;
  // O3: die Art des Ergebnisses als festes Feld — Schätzung, dazu die Zahl der fehlenden Angaben.
  // Eingetragene Beitragsmonate gelten als Angabe, auch 0 (dann zeigt L2 den Weg zur Befreiung).
  const art = alvErgebnis({ bruttolohn: parsedLohn, beitragsmonate: beitragsmonate !== '' ? Math.max(parsedMonate, 1) : 0, alter });

  const result = useMemo(() => {
    if (parsedLohn <= 0) return null;
    return berechneTaggeld({
      versicherterVerdienst: parsedLohn,
      hatKinder,
      ivGrad40,
      beitragsmonate: parsedMonate,
      alter,
    });
  }, [parsedLohn, hatKinder, ivGrad40, parsedMonate, alter]);

  const fmt = (v) => v != null ? zahl(v) : '–';
  const canton = data.basis?.canton;

  const label = { display: 'block', fontSize: text.sm, fontWeight: weight.medium, color: palette.text, marginBottom: '2px' };
  const hinweis = { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, margin: '2px 0 0', maxWidth: '420px' };
  const eingabe = { width: '180px', minHeight: '44px', boxSizing: 'border-box', padding: '8px 12px', fontSize: text.body, border: '1px solid ' + palette.feldrand, borderRadius: radius.md + 'px', background: palette.surface, color: palette.text, fontFamily: 'inherit' };
  const fussText = { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal, margin: space.sm + 'px 0 0' };

  const lohnHinweis = geschaetzt
    ? t('alv.bruttoGeschaetzt', { netto: zahl(profilLohn) })
    : sperre === 'keinLohn' ? t('alv.keinLohnHint')
    : basis === 'netto' ? t('alv.bruttoNettoHint') : basisOffen ? t('einkommensart.offenBrutto') : t('alv.bruttolohnHint');

  const zahlFeld = (id, labelText, value, onChange, hint, opts = {}) => React.createElement('div', { style: { marginBottom: space.md + 'px' } },
    React.createElement('label', { htmlFor: id, style: label }, labelText,
      opts.marke && React.createElement('span', { 'data-geschaetzt': '', style: { marginLeft: space.xs + 'px', padding: '1px 8px', borderRadius: radius.full + 'px', fontSize: text.xs, fontWeight: weight.medium, background: palette.sky + '18', color: palette.skyDeep || palette.text } }, opts.marke)),
    React.createElement('input', {
      id, type: 'number', inputMode: 'decimal', value, onChange: (e) => onChange(e.target.value),
      placeholder: opts.placeholder, min: opts.min, max: opts.max, 'aria-describedby': id + '-hinweis',
      style: { ...eingabe, marginTop: '4px', ...(opts.marke ? { borderStyle: 'dashed' } : null) },
    }),
    React.createElement('p', { id: id + '-hinweis', style: hinweis }, hint)
  );
  const jaNein = [{ wert: true, label: t('common.yes') }, { wert: false, label: t('common.no') }];

  const ergebnis = result && (result.anspruch
    ? React.createElement(React.Fragment, null,
        React.createElement(ErgebnisZahl, { palette, label: t('alv.monatlichLabel'), wert: 'CHF ' + fmt(result.monatlich) }),
        React.createElement('div', { style: { marginTop: space.xs + 'px' } },
          React.createElement(ErgebnisZeile, { palette, label: t('alv.taggeldLabel'), wert: betrag(result.taggeld, { stellen: 2 }) }),
          React.createElement(ErgebnisZeile, { palette, label: t('alv.satzLabel'), wert: t('alv.satzValue', { p: Math.round(result.satz * 100) }) }),
          React.createElement(ErgebnisZeile, { palette, label: t('alv.wartetageLabel'), wert: t('alv.wartetageValue', { n: result.wartetage }) }),
          result.anspruchstage != null && React.createElement(ErgebnisZeile, { palette, label: t('alv.anspruchLabel'), wert: t('alv.anspruchValue', { n: result.anspruchstage, m: Math.round(result.anspruchstage / ALV_PARAMS.taggelderProMonat) }) }),
          // L1: Beitragszeit reicht, das Alter fehlt → die Spanne, keine erfundene Zahl.
          result.anspruchstageOffen && React.createElement(ErgebnisZeile, { palette, label: t('alv.anspruchLabel'), wert: t('alv.anspruchOffenAlter', result.anspruchSpanne) })
        ))
    : React.createElement('p', { style: { fontSize: text.body, color: palette.text, lineHeight: leading.normal, margin: 0 } }, t('alv.noAnspruch')));

  // B (Kapitel 5): die Ausnahmen zur Beitragszeit aufklappbar statt als langer Absatz vor dem Formular.
  const befreiung = React.createElement('details', { 'data-teil': 'befreiung', style: { margin: space.xs + 'px 0 0', maxWidth: '420px' } },
    React.createElement('summary', { style: { cursor: 'pointer', display: 'list-item', minHeight: '44px', boxSizing: 'border-box', padding: '12px 0', fontSize: text.sm, fontWeight: weight.medium, color: palette.text } }, t('alv.befreiungTitel')),
    React.createElement('p', { style: { ...hinweis, fontSize: text.sm, margin: '0 0 ' + space.xs + 'px' } }, t('alv.befreiungText')));

  const unter12Ergebnis = unter12 && React.createElement(React.Fragment, null,
    React.createElement('p', { style: { fontSize: text.body, color: palette.text, lineHeight: leading.normal, margin: 0 } }, t('alv.unter12')),
    befreiung);

  const vorbehalt = !unter12 && result && result.anspruch && React.createElement(React.Fragment, null,
    result.anspruchstage == null && !result.anspruchstageOffen && React.createElement('p', { style: fussText }, t('alv.anspruchLabel') + ': ' + t('alv.anspruchUnklar')),
    // AVIV Art. 41b: in den letzten vier Jahren vor dem Referenzalter 120 Taggelder mehr — nicht gerechnet, gesagt.
    alter != null && alter >= 60 && React.createElement('p', { style: fussText }, t('alv.vorRentenalter')),
    result.gedeckelt && React.createElement('p', { style: fussText }, t('alv.gedeckeltHint', { max: fmt(ALV_PARAMS.versicherterVerdienstMax) })),
    // Werte 2027 (26.10.2026): Grenzbetrag 80 % fürs laufende Jahr nicht belegt → sagen, nicht still rechnen.
    !ALV_PARAMS.satz80Belegt && React.createElement('p', { style: fussText }, t('alv.satz80NichtBelegt', { jahr: ALV_PARAMS.satz80Jahr, laufend: new Date().getFullYear(), betrag: ALV_PARAMS.satz80Schwelle })),
    React.createElement('p', { style: fussText }, t('alv.disclaimer'))
  );

  return React.createElement(RechnerForm, {
    palette, t, view: 'alv', onNavigate,
    titel: t('alv.title'), satz: t('alv.intro'),
    etikett: !unter12 && result && result.anspruch ? t('alv.resultTitle') : null,
    ergebnis: unter12 ? unter12Ergebnis : ergebnis, ohneErgebnis: t('alv.enterBrutto'), art, vorbehalt,
    angaben: {
      erfasst: (parsedLohn > 0 ? 1 : 0) + (beitragsmonate !== '' ? 1 : 0) + (alter != null ? 1 : 0) + 2,
      gesamt: 5,
      inhalt: React.createElement('div', { style: { paddingTop: space.xs + 'px' } },
        // A (Kapitel 5): keine Zahlen als Platzhalter — eine graue «12» sah aus wie eine Eingabe.
        zahlFeld('alv-brutto', t('alv.bruttolohn'), bruttolohn, setEingetippt, lohnHinweis, { marke: geschaetzt ? t('rechnerForm.geschaetzt') : null }),
        zahlFeld('alv-monate', t('alv.beitragsmonate'), beitragsmonate, setBeitragsmonate, t('alv.beitragsmonateHint'), { min: 0, max: 24 }),
        !unter12 && befreiung,
        zahlFeld('alv-alter', t('alv.alter'), alterEingabe, setAlterEingabe, t('alv.alterHint'), { min: 15, max: 70 }),
        React.createElement(Einzelwahl, { palette, id: 'alv-kinder', label: t('alv.kinder'), hinweis: t('alv.kinderHint') + ' ' + t('alv.kinderVolljaehrig'), optionen: jaNein, wert: hatKinder, onWahl: setHatKinder }),
        React.createElement(Einzelwahl, { palette, id: 'alv-iv', label: t('alv.ivGrad'), optionen: jaNein, wert: ivGrad40, onWahl: setIvGrad40 })
      ),
    },
    tun: {
      titel: t('alv.ravTitle'),
      inhalt: React.createElement(React.Fragment, null,
        React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, margin: 0 } }, t('alv.ravBody')),
        // Kapitel 5, K (10.11.2026): Zwischenverdienst (AVIG Art. 24).
        React.createElement('h4', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, margin: space.md + 'px 0 ' + space.xs + 'px' } }, t('alv.zwischenverdienstTitel')),
        React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, margin: 0 } }, t('alv.zwischenverdienst')),
        canton && onNavigate && React.createElement('button', {
          type: 'button', className: 'mp-link', onClick: () => onNavigate('direktlinks'),
          style: { ...linkStil(palette), display: 'flex', alignItems: 'center', width: '100%', minHeight: '44px', marginTop: space.xs + 'px', textAlign: 'left', fontSize: text.sm, fontWeight: weight.medium },
        }, t('alv.cantonLink', { canton })),
        // Fassung 9 (F9-D3): zurück zum Ablauf «Stelle verloren», Name aus dem Register.
        onNavigate && React.createElement('button', {
          type: 'button', className: 'mp-link', onClick: () => onNavigate('stelleverloren'),
          style: { ...linkStil(palette), display: 'flex', alignItems: 'center', width: '100%', minHeight: '44px', marginTop: space.xs + 'px', textAlign: 'left', fontSize: text.sm, fontWeight: weight.medium },
        }, t(ansichtName('stelleverloren')))
      ),
    },
    stelle: React.createElement(OfficialLinkBox, { palette, t, data, ids: ['arbeitslosigkeit', 'ueberbrueckungsleistungen'], alsZeilen: true }),
    // F7-R6: die Quelle, die der Rechner schon führt (data/alvRechner.js, ALV_QUELLE_JE_JAHR) — mit Stand.
    quelle: t('rechnerForm.quelle', { q: ALV_DATA_SOURCE }),
  },
    // Ergänzung A (07.11.2026): zur Karte Arbeitslosenquote im Kantonsatlas.
    React.createElement(VerstehenImWerkzeug, { palette, t, view: 'alv', kanton: canton }),
    React.createElement(ErklaerseiteLink, { palette, t, view: 'alv' }));
};

export default AlvRechner;

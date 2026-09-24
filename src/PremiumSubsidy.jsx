import React, { useState } from 'react';
import { PageTitle } from './components/Heading.jsx';
import { calculateIPV, CANTONAL_IPV, CANTON_CODES, getCantonName } from './config/cantonalData.js';
import { getKVGApplicationLink, buildIpvDokument } from './premiumCalc.js';
import { ExportVorschau } from './components/ExportVorschau.jsx';
import { Icon, hinweisZeichen, erledigtZeichen } from './IconSystem.jsx';
import { ExternerLink, ZielHinweis } from './components/ExternerLink.jsx';
import { useVorlesenContext } from './hooks/vorlesenContext.js';
import { VorlesenButton } from './components/VorlesenButton.jsx';
import { getFullName } from './config/constants.js';
import { OfficialLinkBox } from './OfficialLinkBox.jsx';
import { getCantonalLinks } from './data/direktLinks.js';
import { addTodo } from './utils/merkliste.js';
import { addReminder } from './utils/reminders.js';
import { readIpvStatus, nextIpvStatus, IPV_STATUS } from './data/ipvStatus.js';
import { verfuegungZuordnung, VERFUEGUNG_ZUORDNUNG } from './data/ipvAbzug.js';
import { abweichungen, mitUebergabe } from './data/schnellcheckUebergabe.js';
import { text, weight, radius , space } from './config/tokens.js';
import { GlossarText } from './GlossarBegriff.jsx';

// Schweizer Format mit Tausender-Apostroph, konsistent zu Pegel/Beleg.
const fmtCHF = (n) => 'CHF ' + Number(n || 0).toLocaleString('de-CH', { maximumFractionDigits: 0 });

// schnellcheckZahlen (B-1/E22): { monthlyIncome, rentAmount, kkPremium } aus dem
// Schnellcheck, übergeben von main.jsx. Der Rechner rechnet damit und sagt es; das
// Profil ändert sich erst auf «Ins Profil übernehmen».
export const PremiumSubsidy = ({ palette, t, data: profil, onNavigate, onUpdateData, schnellcheckZahlen }) => {
  const vorlesen = useVorlesenContext();
  const [uebernommen, setUebernommen] = useState(false);
  const offeneZahlen = abweichungen(profil, schnellcheckZahlen);
  const data = mitUebergabe(profil, offeneZahlen);
  const [showCalculation, setShowCalculation] = useState(true);
  // IPV-Lebenslinie (Phase 2): der Beleg als Gesicht seines Ablaufs. Verfügungs-
  // Betrag lokal gepuffert (Init aus dem persistierten Status), Erinnerungs-Flag
  // fürs idempotente Kalender-Angebot. Siehe docs/design/ipv-lebenslinie.md.
  const [verfBetrag, setVerfBetrag] = useState(() => {
    const s = readIpvStatus(data);
    return s.betrag ? String(s.betrag) : '';
  });
  const [renewAdded, setRenewAdded] = useState(false);
  // Für welches Jahr die Verfügung gilt (Deploy-Gate Runde 4): wählbar beim Eintragen, laufendes
  // oder folgendes Jahr — eine Verfügung fürs nächste Jahr kommt oft schon im Herbst.
  const laufendesJahr = new Date().getFullYear();
  const [verfJahr, setVerfJahr] = useState(String(laufendesJahr));
  // Export-Vorschau (K20): erst zeigen, was im IPV-Dokument steht, dann herunterladen.
  const [ipvVorschau, setIpvVorschau] = useState(false);
  // Unterlagen für den IPV-Antrag als offenen Punkt in die Merkliste legen (Muster wie Umzug),
  // nimmt der „Welche Papiere brauche ich?"-Unsicherheit die Spitze. Idempotent, Link → Lebensordner.
  const [permitAdded, setPermitAdded] = useState(false);
  const permitTodoButton = () => React.createElement('button', {
    onClick: () => { addTodo({ text: t('premium.permitTodoText'), link: 'tresor' }); setPermitAdded(true); },
    disabled: permitAdded,
    'aria-pressed': permitAdded,
    style: {
      marginTop: '8px', cursor: permitAdded ? 'default' : 'pointer', fontFamily: 'inherit',
      background: 'none', border: '1px solid ' + (permitAdded ? palette.sage : palette.border),
      borderRadius: radius.sm, padding: '3px 10px', fontSize: text.xs,
      color: permitAdded ? (palette.sageDeep || palette.sage) : palette.mid,
    },
  }, erledigtZeichen(permitAdded, permitAdded ? t('premium.permitTodoAdded') : t('premium.permitTodoAdd')));

  const canton = data.basis?.canton || '';
  const ipvResult = calculateIPV(data);
  const residenceType = data.wohnen?.residenceType || 'hauptwohnsitz';
  const residenceKey = residenceType === 'wochenaufenthalt' ? 'wochenaufenthalt' : residenceType === 'nebenwohnsitz' ? 'nebenwohnsitz' : 'hauptwohnsitz';
  const kvgLink = getKVGApplicationLink(canton);
  // E9: Solange der Kanton nicht amtlich belegt ist, zeigt der Rechner keinen Betrag,
  // kein «Berechtigt» und keine Grenze — nur eine Orientierung mit dem Weg zum Kanton.
  const ohneBetrag = ipvResult.belegt === false;
  const anspruchMoeglich = !!ipvResult.anspruchMoeglich;
  const stelleUrl = (getCantonalLinks(canton) || {}).ipv || null;

  // K64: gesperrte Knöpfe wie in ZipExport (K53) — Text mid auf der ruhigen Fläche up
  // (hell 5.25:1, dunkel 4.81:1, auch farbenblind ≥ 4.5:1), gestrichelter Rand und
  // Sperr-Cursor tragen das «geht nicht» mit. Vorher: Fläche mid mit opacity 0.6.
  const gesperrtStil = {
    background: palette.up, color: palette.mid,
    border: '1px dashed ' + palette.mid, cursor: 'not-allowed',
  };

  const handleApplyOnline = () => {
    // noopener,noreferrer: window.open vererbt sonst window.opener an die Zielseite (Reverse
    // Tabnabbing) — anders als <a target="_blank">, das modern von selbst schützt.
    window.open(kvgLink, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadDocument = () => {
    const doc = buildIpvDokument(data, t, ipvResult);
    const text = JSON.stringify(doc, null, 2);
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'KVG_IPV_' + (getFullName(data.basis) || 'application').replace(/\s/g, '_') + '.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasIncome = !!(data.finanzen && data.finanzen.monthlyIncome);
  // Nur Kantone mit einem Einzelwert: ZH, BE und AG (K31) rechnen nach ihrem eigenen Modell
  // und haben keinen einzelnen Vergleichswert (AG publiziert nicht einmal eine Einkommensgrenze).
  const belegteKantone = Object.entries(CANTONAL_IPV).filter(([, v]) => !!(v.beleg && v.beleg.quelle) && v.subsidySingle != null);

  // --- IPV-Lebenslinie (Phase 2) -------------------------------------------
  // Statefull Beleg — Übergänge schreiben additiv nach data.anspruch.ipv
  // (fehlt ⇒ 'geschaetzt'). Ehrliche Verzweigung: Automatik-Kantone haben KEINEN
  // Antrag — darum führt 'geschaetzt' sowohl zu 'beantragt' (Antrags-Weg) als
  // auch direkt zu 'bestaetigt' (Verfügung kam automatisch). Kein Rot, kein Zwang.
  const ipvStatus = readIpvStatus(data);
  // Dieselbe Frage wie Budget, KK-Last-Karte, Beleg und Finanzübersicht (data/ipvAbzug.js):
  // gilt die eingetragene Verfügung jetzt? Die Seite sagt es dazu, statt nur «bestätigt».
  const zuordnung = verfuegungZuordnung(data, ipvStatus);
  const kantonName = (code) => (code ? getCantonName(code, t) : '');
  const setIpvStatus = (status, extra) => onUpdateData && onUpdateData('anspruch', 'ipv', nextIpvStatus(status, extra));
  const lineBtn = (label, onClick, opts = {}) => React.createElement('button', {
    onClick,
    'aria-pressed': opts.pressed || undefined,
    style: {
      cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, fontWeight: weight.semi,
      padding: '8px 14px', borderRadius: radius.sm, minHeight: '44px',
      background: opts.primary ? palette.sand : 'none',
      color: opts.primary ? palette.onSand : palette.sandDeep,
      border: opts.primary ? 'none' : '1px solid ' + palette.border,
    },
  }, label);

  // Jahr wählen beim Eintragen der Verfügung — klein, zwei Möglichkeiten.
  const jahrWahl = () => React.createElement('label', {
    style: { display: 'flex', alignItems: 'center', gap: space.xs, fontSize: text.sm, color: palette.mid, marginBottom: space.sm, flexWrap: 'wrap' },
  },
    t('ipvStatus.jahrLabel'),
    React.createElement('select', {
      value: verfJahr,
      onChange: (e) => setVerfJahr(e.target.value),
      style: { padding: '8px 10px', minHeight: '44px', fontSize: text.sm, border: '1px solid ' + palette.border, borderRadius: radius.sm, background: palette.surface, color: palette.text, fontFamily: 'inherit' },
    },
      React.createElement('option', { value: String(laufendesJahr) }, String(laufendesJahr)),
      React.createElement('option', { value: String(laufendesJahr + 1) }, String(laufendesJahr + 1))
    )
  );
  const verfuegungEintragen = () => setIpvStatus(IPV_STATUS.BESTAETIGT, { betrag: verfBetrag, kanton: canton, jahr: Number(verfJahr) });

  const renderLebenslinie = () => {
    if (!onUpdateData || !hasIncome) return null;
    // Ein bereits beantragter/bestätigter Status bleibt sichtbar, auch wenn die
    // aktuelle Live-Schätzung knapp unter die Grenze fällt — sonst verschwänden
    // real eingetragene Verfügungsdaten. Nur im reinen Schätz-Zustand blenden wir
    // die Lebenslinie aus, wenn (noch) kein Anspruch geschätzt wird.
    if (!anspruchMoeglich && ipvStatus.status === IPV_STATUS.GESCHAETZT) return null;
    const h = React.createElement;
    const card = (children, opts = {}) => h('div', {
      style: {
        padding: '14px', borderRadius: radius.sm, marginBottom: space.md,
        background: palette.surface, border: '1px solid ' + palette.border,
        borderLeft: '3px solid ' + (opts.accent || palette.sand),
      },
    }, ...(Array.isArray(children) ? children : [children]));
    const head = (label, badge) => h('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: space.sm, marginBottom: space.xs } },
      h('div', { style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text } }, t('ipvStatus.title')),
      badge
    );
    const lead = (s) => h('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: '1.55', marginBottom: space.sm } }, s);

    if (ipvStatus.status === IPV_STATUS.BESTAETIGT) {
      const stamp = h('span', { style: { border: '2px solid ' + palette.sageDeep, color: palette.sageDeep, fontSize: text.xs, fontWeight: weight.semi, letterSpacing: '0.5px', padding: '2px 8px', borderRadius: '4px', transform: 'rotate(-6deg)', display: 'inline-block' } }, t('ipvStatus.stamp'));
      // Frist an das Verfügungs-Datum koppeln (nicht an „heute"): so bleibt die
      // dueDate über Tage stabil und die addReminder-Dedup (Titel + Datum) greift —
      // sonst entstünde bei jedem erneuten Antippen an einem anderen Tag ein Duplikat.
      const dueNext = (() => { const base = ipvStatus.datum ? new Date(ipvStatus.datum) : new Date(); base.setFullYear(base.getFullYear() + 1); return base.toISOString().split('T')[0]; })();
      // Gilt die Verfügung nicht (anderes Jahr/anderer Kanton) oder fehlt ihr die Zuordnung
      // (Altbestand vor 0.1.40-beta), sagt die Seite das — Kanton und Jahr ergänzt erst ein
      // sichtbares «Ja», nie automatisch.
      const zuordnen = zuordnung === VERFUEGUNG_ZUORDNUNG.UNZUGEORDNET && canton
        ? h('div', { style: { display: 'flex', gap: space.sm, alignItems: 'center', flexWrap: 'wrap', marginBottom: space.sm } },
            h('span', { style: { fontSize: text.sm, color: palette.text } }, t('ipvStatus.zuordnenFrage', { kanton: kantonName(canton), jahr: laufendesJahr })),
            lineBtn(t('ipvStatus.zuordnenJa', { kanton: kantonName(canton), jahr: laufendesJahr }),
              () => setIpvStatus(IPV_STATUS.BESTAETIGT, { betrag: ipvStatus.betrag, datum: ipvStatus.datum, kanton: canton, jahr: laufendesJahr }))
          )
        : null;
      const hinweis = zuordnung === VERFUEGUNG_ZUORDNUNG.UNZUGEORDNET
        ? lead(t('ipvStatus.ohneJahrLead'))
        : zuordnung === VERFUEGUNG_ZUORDNUNG.GILT_NICHT
        ? lead(t('ipvStatus.giltNicht', {
            kanton: kantonName(ipvStatus.kanton), jahr: ipvStatus.jahr != null ? ipvStatus.jahr : '',
            aktKanton: kantonName(canton), aktJahr: laufendesJahr,
          }).replace(/\s{2,}/g, ' '))
        : lead(t('ipvStatus.confirmedLead'));
      return card([
        head(null, stamp),
        hinweis,
        zuordnen,
        ipvStatus.betrag > 0
          ? h('div', { style: { fontSize: text.lg, fontWeight: weight.bold, color: palette.sageDeep, marginBottom: space.sm } }, fmtCHF(ipvStatus.betrag) + ' / ' + t('schnellcheck.monat'))
          : h('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.sm } }, t('ipvStatus.betragPrompt')),
        h('label', { style: { display: 'block', fontSize: text.xs, color: palette.mid, marginBottom: space.xs } }, t('ipvStatus.betragLabel')),
        h('div', { style: { display: 'flex', gap: space.sm, alignItems: 'center', marginBottom: space.md, flexWrap: 'wrap' } },
          h('input', {
            type: 'number', inputMode: 'numeric', min: '0', value: verfBetrag,
            onChange: (e) => setVerfBetrag(e.target.value),
            onBlur: () => setIpvStatus(IPV_STATUS.BESTAETIGT, { betrag: verfBetrag, datum: ipvStatus.datum, kanton: ipvStatus.kanton, jahr: ipvStatus.jahr }),
            'aria-label': t('ipvStatus.betragLabel'),
            style: { width: '120px', padding: '9px 10px', minHeight: '44px', fontSize: text.sm, border: '1px solid ' + palette.border, borderRadius: radius.sm, background: palette.surface, color: palette.text, fontFamily: 'inherit' },
          })
        ),
        lead(t('ipvStatus.renewLead')),
        h('div', { style: { display: 'flex', gap: space.sm, flexWrap: 'wrap' } },
          lineBtn(erledigtZeichen(renewAdded, renewAdded ? t('ipvStatus.renewAdded') : t('ipvStatus.renewAdd')), () => {
            if (renewAdded) return;
            const ok = addReminder({ title: t('ipvStatus.reminderTitle'), dueDate: dueNext, category: 'insurance', recurrence: 'yearly' });
            if (ok) setRenewAdded(true);
          }, { primary: !renewAdded, pressed: renewAdded }),
          lineBtn(t('ipvStatus.reset'), () => { setVerfBetrag(''); setRenewAdded(false); setIpvStatus(IPV_STATUS.GESCHAETZT); })
        ),
      ], { accent: palette.sage });
    }

    if (ipvStatus.status === IPV_STATUS.BEANTRAGT) {
      const badge = h('span', { style: { fontSize: text.xs, fontWeight: weight.semi, color: palette.sandDeep } }, t('ipvStatus.appliedLabel'));
      return card([
        head(null, badge),
        lead(t('ipvStatus.appliedLead')),
        jahrWahl(),
        h('div', { style: { display: 'flex', gap: space.sm, flexWrap: 'wrap' } },
          lineBtn(t('ipvStatus.markConfirmed'), verfuegungEintragen, { primary: true }),
          lineBtn(t('ipvStatus.reset'), () => setIpvStatus(IPV_STATUS.GESCHAETZT))
        ),
      ]);
    }

    // geschaetzt — ehrliche Verzweigung: zwei Wege neutral, beide Übergänge offen.
    return card([
      head(),
      lead(t(ohneBetrag ? 'ipvStatus.orientierungLead' : 'ipvStatus.geschaetztLead')),
      h('ul', { style: { margin: '0 0 ' + space.sm + 'px', paddingLeft: '18px', fontSize: text.sm, color: palette.mid, lineHeight: '1.55' } },
        h('li', { style: { marginBottom: space.xs } }, t('ipvStatus.wayAuto')),
        h('li', null, t('ipvStatus.wayApply'))
      ),
      jahrWahl(),
      h('div', { style: { display: 'flex', gap: space.sm, flexWrap: 'wrap' } },
        lineBtn(t('ipvStatus.markApplied'), () => setIpvStatus(IPV_STATUS.BEANTRAGT)),
        lineBtn(t('ipvStatus.markConfirmed'), verfuegungEintragen, { primary: true })
      ),
    ]);
  };

  // Only block when the canton is genuinely missing. If the canton is set but the
  // income isn't yet, we still show the canton-specific info and prompt for income.
  if (!canton) {
    return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
      React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'insurance', size: 22 }), style: { marginBottom: space.sm } }, t('premium.title')),
      React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.md, lineHeight: '1.5' } }, t('premium.subtitle'), vorlesen?.enabled && React.createElement(VorlesenButton, { text: t('premium.subtitle'), speak: vorlesen.speak, color: palette.mid, label: t('vorlesen.label') })),
      // Anspruch & Bewilligung — gerade für Neuzuzüger:innen ohne gesetzten Kanton relevant.
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, marginBottom: space.md, fontSize: text.sm, lineHeight: '1.5' } },
        React.createElement('div', { style: { fontWeight: weight.semi, marginBottom: '4px' } }, hinweisZeichen(), t('premium.permitTitle')),
        React.createElement('div', { style: { color: palette.mid } }, t('premium.permitText')),
        permitTodoButton()
      ),
      // Codex-Audit 24.09.: die Kachel verspricht «Kanton und Einkommen hier eingeben»,
      // die Seite schickte vorher in zwei andere Kapitel. Jetzt die Wahl direkt hier — sie
      // schreibt basis.canton, dasselbe Feld wie Einführung und «Persönliche Basis».
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, fontSize: text.sm, color: palette.mid } },
        onUpdateData
          ? React.createElement(React.Fragment, null,
              React.createElement('label', { htmlFor: 'ipv-kanton', style: { display: 'block', color: palette.text, fontWeight: weight.semi, marginBottom: '6px' } }, t('premium.cantonChoose')),
              React.createElement('select', {
                id: 'ipv-kanton',
                value: '',
                onChange: (e) => { if (e.target.value) onUpdateData('basis', 'canton', e.target.value); },
                'aria-describedby': 'ipv-kanton-hinweis',
                style: { padding: '8px 10px', fontSize: text.sm, border: '1px solid ' + palette.border, borderRadius: radius.sm, background: palette.surface, color: palette.text, fontFamily: 'inherit', appearance: 'auto', minWidth: '220px' },
              },
                React.createElement('option', { value: '' }, t('common.select')),
                CANTON_CODES.map((c) => React.createElement('option', { key: c, value: c }, getCantonName(c, t)))
              ),
              React.createElement('p', { id: 'ipv-kanton-hinweis', style: { margin: space.xs + 'px 0 0', fontSize: text.xs, color: palette.mid, lineHeight: '1.5' } }, t('premium.cantonSavedHint'))
            )
          : React.createElement(React.Fragment, null, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('premium.enterCanton')))
      )
    );
  }

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'insurance', size: 22 }), style: { marginBottom: space.sm } }, t('premium.title')),
    React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.md, lineHeight: '1.5' } }, t('premium.subtitle'), vorlesen?.enabled && React.createElement(VorlesenButton, { text: t('premium.subtitle'), speak: vorlesen.speak, color: palette.mid, label: t('vorlesen.label') })),

    // Anspruch & Aufenthaltsbewilligung — ruhige Orientierung für Neuzuzüger:innen, kein Verdikt
    // (Quellen: SVA Zürich „Wer hat Anspruch", Kanton Basel-Stadt Prämienverbilligung).
    React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, marginBottom: space.md, fontSize: text.sm, lineHeight: '1.5' } },
      React.createElement('div', { style: { fontWeight: weight.semi, marginBottom: '4px' } }, hinweisZeichen(), t('premium.permitTitle')),
      React.createElement('div', { style: { color: palette.mid } }, t('premium.permitText')),
      permitTodoButton()
    ),

    // Canton info
    React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, marginBottom: space.md, fontSize: text.sm } },
      React.createElement('div', { style: { fontWeight: weight.semi, marginBottom: '6px' } }, hinweisZeichen(), t('premium.canton', { name: getCantonName(canton, t) || t('premium.cantonUnknown') })),
      ipvResult.cantonData && React.createElement('div', { style: { color: palette.mid } },
        React.createElement('div', null, t('premium.model', { value: t(ipvResult.cantonData.modelKey) })),
        // Nicht jeder Kanton publiziert eine Einkommensgrenze als Zahl: der Aargau definiert
        // sie in § 5 Abs. 5 KVGG, veröffentlicht sie aber nicht. Eine abgeleitete Zahl wäre
        // unsere eigene Rechnung — dann lieber keine Zeile (K31, 20.09.2026).
        ipvResult.cantonData.maxIncome != null && React.createElement('div', null, t('premium.maxIncome', { value: ipvResult.cantonData.maxIncome.toLocaleString() })),
        React.createElement('div', null, t('premium.note', { value: t(ipvResult.cantonData.noteKey, ipvResult.cantonData.noteParams) }))
      ),
      // E9: unbelegt weder Modell noch Grenze noch Verfahrens-Hinweis (für GL nachweislich
      // falsch) — der Weg zum Kanton steht als Link im Orientierungs-Kasten darunter.
      !canton && React.createElement('div', { style: { color: palette.roseDeep } }, t('premium.enterCanton'))
    ),

    // B-1/E22: sichtbar sagen, dass mit den Schnellcheck-Zahlen gerechnet wird.
    // Ins Profil geht nichts ohne den Klick auf den Knopf.
    offeneZahlen.length > 0 ? React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border, borderLeft: '3px solid ' + palette.sky, marginBottom: space.md, fontSize: text.sm, lineHeight: '1.5' } },
      React.createElement('div', { style: { fontWeight: weight.semi, color: palette.text, marginBottom: space.xs } }, t('premium.schnellcheckGerechnet')),
      React.createElement('ul', { style: { margin: '0 0 ' + space.xs + 'px', paddingLeft: '18px', color: palette.text } },
        offeneZahlen.map(([, feld, wert]) => React.createElement('li', { key: feld },
          t(feld === 'monthlyIncome' ? 'schnellcheck.income' : feld === 'rentAmount' ? 'schnellcheck.rent' : 'schnellcheck.kk') + ': ' + fmtCHF(wert)))
      ),
      React.createElement('div', { style: { color: palette.mid, marginBottom: onUpdateData ? space.sm : 0 } }, t('premium.schnellcheckProfilBleibt')),
      onUpdateData && React.createElement('button', {
        type: 'button',
        onClick: () => { offeneZahlen.forEach(([kapitel, feld, wert]) => onUpdateData(kapitel, feld, wert)); setUebernommen(true); },
        style: { cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, fontWeight: weight.semi, padding: '8px 14px', minHeight: '44px', borderRadius: radius.sm, background: 'none', color: palette.sandDeep, border: '1px solid ' + palette.border },
      }, t('premium.schnellcheckUebernehmen'))
    ) : uebernommen && React.createElement('div', { role: 'status', style: { fontSize: text.sm, color: palette.sageDeep, marginBottom: space.md } }, hinweisZeichen('check'), t('premium.schnellcheckUebernommen')),

    // Residence type warning
    residenceKey === 'wochenaufenthalt' && React.createElement('div', { style: { padding: '10px', background: palette.gold + '22', borderRadius: radius.sm, border: '1px solid ' + palette.gold, marginBottom: space.md, fontSize: text.sm } },
      React.createElement('div', { style: { fontWeight: weight.semi, color: palette.goldDeep, marginBottom: space.xs } }, hinweisZeichen(), t('premium.weeklyResidence')),
      React.createElement('div', null, t('premium.weeklyIpvNote')),
      React.createElement('div', null, t('premium.weeklyKkNote'))
    ),

    // Eligibility Status — only once income is present; otherwise prompt for income
    !hasIncome ? React.createElement('div', { style: { padding: '12px', background: palette.sky + '15', borderRadius: radius.sm, border: '1px solid ' + palette.sky + '40', marginBottom: space.md } },
      React.createElement('div', { style: { fontSize: text.sm, color: palette.text, lineHeight: '1.5', marginBottom: onUpdateData ? space.sm : 0 } }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('premium.enterIncome'))),
      // Inline income field — entering it here triggers the calculation immediately
      // (writes to data.finanzen.monthlyIncome, the same field used everywhere else).
      onUpdateData && React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: space.sm } },
        React.createElement('input', {
          type: 'number',
          inputMode: 'numeric',
          min: '0',
          value: data.finanzen?.monthlyIncome ?? '',
          onChange: (e) => onUpdateData('finanzen', 'monthlyIncome', e.target.value),
          'aria-label': t('premium.enterIncome'),
          placeholder: '0',
          style: { width: '140px', padding: '8px 10px', fontSize: text.sm, border: '1px solid ' + palette.border, borderRadius: radius.sm, background: palette.surface, color: palette.text, fontFamily: 'inherit' }
        }),
        React.createElement('span', { style: { fontSize: text.sm, color: palette.mid } }, 'CHF ' + t('common.perMonth'))
      )
    ) : ohneBetrag ? React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border, marginBottom: space.md } },
      // Orientierung ohne Betrag (E9): ruhig, kein Verdikt in beide Richtungen.
      React.createElement('div', { style: { fontSize: text.sm, color: palette.text, lineHeight: '1.5' } }, hinweisZeichen(), t(ipvResult.noteKey, ipvResult.noteParams)),
      // Warum hier keine Zahl steht (K31, Fachprüfung 20.09.2026). Ohne diesen Satz liest sich
      // «kein Betrag» wie «der Kanton ist ungeprüft» — es heisst aber oft nur, dass eine Angabe fehlt.
      ipvResult.offen && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: '1.5', marginTop: space.xs } }, t('ipv.offenGrund.' + ipvResult.offen)),
      stelleUrl && React.createElement(ExternerLink, { t, href: stelleUrl, style: { display: 'inline-block', marginTop: space.sm, fontSize: text.sm, fontWeight: weight.semi, color: palette.sageDeep, textDecoration: 'underline', textUnderlineOffset: '2px' } }, t('ipv.zurStelle')),
      ipvResult.youngAdultsCount > 0 && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('ipv.youngAdultsNote')))
    ) : ipvResult.eligible ? React.createElement('div', { style: { padding: '12px', background: palette.sage + '22', borderRadius: radius.sm, border: '1px solid ' + palette.sage, marginBottom: space.md } },
      React.createElement('div', { style: { fontWeight: weight.semi, color: palette.sageDeep, marginBottom: space.xs } }, hinweisZeichen('check'), t('premium.eligible')),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.text } }, t(ipvResult.noteKey, ipvResult.noteParams)),
      ipvResult.youngAdultsCount > 0 && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('ipv.youngAdultsNote')))
    ) : React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border, marginBottom: space.md } },
      React.createElement('div', { style: { fontWeight: weight.semi, color: palette.mid, marginBottom: space.xs } }, hinweisZeichen(), t('premium.notEligible')),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, t(ipvResult.noteKey, ipvResult.noteParams))
    ),

    // Anspruchsjahr, Prämienregion und die amtlichen Vorbehalte — nur dort, wo ein Kanton
    // nach seinem eigenen Modell gerechnet wurde (heute ZH, BE und AG). Eine konkrete Zahl ohne ihr Jahr
    // und ohne den Rückzahlungs-Vorbehalt wäre zu selbstsicher (Fachprüfung 20.09.2026).
    ipvResult.jahr && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: '1.5', marginBottom: '12px' } },
      // Prämienregion nur, wo es eine gibt: Im Aargau hängt die Richtprämie nicht an der
      // Region (V KVGG § 4 Abs. 1), darum dort ein eigener Satz statt «Prämienregion undefined».
      React.createElement('div', null, ipvResult.region
        ? t('ipv.jahrRegion', { jahr: ipvResult.jahr, region: ipvResult.region })
        : t('ipv.jahrOhneRegion', { jahr: ipvResult.jahr })),
      React.createElement('div', { style: { marginTop: space.xs } }, t('ipv.naeherung')),
      // Der Vorbehalt ist kantonsspezifisch: BE rechnet mit den Steuerdaten des Vorvorjahres
      // (KKVV Art. 7 Abs. 1), ZH mit denen des Anspruchsjahres, AG mit denen von vor DREI
      // Jahren (§ 7 Abs. 1 KVGG). Ein Satz für alle wäre für zwei der drei Kantone falsch.
      React.createElement('div', { style: { marginTop: space.xs } },
        t(ipvResult.vorbehaltKey || 'ipv.vorbehalt', { jahr: ipvResult.jahr, basisjahr: ipvResult.basisjahr ?? ipvResult.jahr - 2 })),
      // 🛑 Ein ZWEITER Vorbehalt, und nur für die, die er betrifft: Wo der 3a-Deckel wirkt,
      // hängt der ganze Betrag an einer Lesart von KKVV Art. 6 Abs. 4 lit. i, die beim ASV
      // Bern angefragt und nicht bestätigt ist (SAEULE_3A.bisBundesMaximum.vorbehalt). Ohne
      // diesen Satz stünde eine Zahl im Brief, deren Grundlage strittig ist, und niemand
      // wüsste es. Steht nur bei `zusatzVorbehaltKey` — sonst wäre es Lärm für alle anderen.
      // (Befund Fachprüfung 23.09.2026: der Vorbehalt lag im Code und kam nie bei der Person an.)
      ipvResult.zusatzVorbehaltKey && React.createElement('div', { style: { marginTop: space.xs } },
        t(ipvResult.zusatzVorbehaltKey)),
      // Der Weg zur zuständigen Stelle gehört auch dorthin, wo ein Betrag steht — gerade wenn
      // der Anspruch beantragt werden muss.
      stelleUrl && React.createElement(ExternerLink, { t, href: stelleUrl, style: { display: 'inline-block', marginTop: space.xs, fontSize: text.xs, fontWeight: weight.semi, color: palette.sageDeep, textDecoration: 'underline', textUnderlineOffset: '2px' } }, t('ipv.zurStelle'))
    ),

    // IPV-Lebenslinie — der Beleg als Gesicht seines Ablaufs (Phase 2)
    renderLebenslinie(),

    React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: '12px', fontStyle: 'italic' } }, t('premium.disclaimer')),

    hasIncome && showCalculation && React.createElement('div', null,
      // Results — nur mit amtlich belegtem Kanton (E9)
      !ohneBetrag && React.createElement('div', { style: { border: '1px solid ' + palette.border + '66', borderRadius: radius.sm, background: palette.up, marginBottom: space.md } },
        React.createElement('div', { style: { padding: space.sm + 'px ' + space.md + 'px', borderBottom: '1px solid ' + palette.border + '33' } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: space.md } },
            React.createElement('span', { style: { fontSize: text.body, color: palette.text } }, t('premium.monthlySubsidy')),
            React.createElement('span', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text, whiteSpace: 'nowrap' } }, 'CHF ' + ipvResult.amount)
          ),
          ipvResult.reductionPercent != null && ipvResult.reductionPercent < 100 && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } },
            t('premium.reductionNote', { percent: ipvResult.reductionPercent })
          )
        ),
        React.createElement('div', { style: { padding: space.sm + 'px ' + space.md + 'px' } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: space.md } },
            React.createElement('span', { style: { fontSize: text.body, color: palette.text } }, t('premium.annualSubsidy')),
            React.createElement('span', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text, whiteSpace: 'nowrap' } }, 'CHF ' + (ipvResult.annual || 0))
          ),
          ipvResult.maxAnnual && ipvResult.annual < ipvResult.maxAnnual && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } },
            t('premium.maxPossible', { value: ipvResult.maxAnnual })
          )
        )
      ),

      // All cantons overview — nur amtlich belegte Kantone (E9); ohne einen belegten entfällt der Vergleich
      belegteKantone.length > 0 && React.createElement('details', { style: { marginBottom: space.md } },
        React.createElement('summary', { style: { cursor: 'pointer', fontSize: text.sm, fontWeight: weight.semi, color: palette.mid, padding: '8px 0' } }, t('premium.compareCantons')),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: space.sm, marginTop: space.sm } },
          belegteKantone.map(([key, val]) =>
            React.createElement('div', {
              key,
              style: {
                padding: space.sm,
                background: key === canton ? palette.sage + '22' : palette.up,
                borderRadius: '4px',
                border: '1px solid ' + (key === canton ? palette.sage : palette.border),
                fontSize: text.sm
              }
            },
              React.createElement('div', { style: { fontWeight: weight.semi } }, key + ' — ' + getCantonName(key, t)),
              React.createElement('div', { style: { color: palette.mid } }, 'Max: CHF ' + val.maxIncome.toLocaleString() + ' | Single: CHF ' + val.subsidySingle + t('common.perYear'))
            )
          )
        )
      ),

      // Checklist
      React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, marginBottom: space.md } },
        // h3, nicht h4: die Checkliste ist eine eigene Sektion unter dem h2-Ergebnis, kein Unterpunkt (WCAG 1.3.1, Voll-Review 15.09.2026)
        React.createElement('h3', { style: { fontSize: text.sm, fontWeight: weight.semi, marginBottom: '10px' } }, hinweisZeichen('kaestchen'), t('premium.requiredDocs') + ':'),
        React.createElement('ul', { style: { fontSize: text.sm, paddingLeft: '20px', margin: 0 } },
          [t('premium.doc1'), t('premium.doc2'), t('premium.doc3'), t('premium.doc4')].map((doc, idx) =>
            React.createElement('li', { key: idx, style: { marginBottom: space.xs } }, doc)
          )
        )
      ),

      // Actions
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: space.sm } },
        React.createElement('button', {
          onClick: handleApplyOnline,
          disabled: !anspruchMoeglich,
          style: { padding: '10px', background: palette.sand, color: palette.onSand, border: 'none', borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm, ...(anspruchMoeglich ? null : gesperrtStil) }
        },
          // K64: Zeichen und Ansage kommen aus ZielHinweis — derselbe Baustein wie in
          // ExternerLink, damit das Versprechen nicht an zwei Orten gepflegt wird.
          React.createElement(ZielHinweis, { t }),
          t('premium.applyOnline')
        ),
        React.createElement('button', {
          onClick: () => setIpvVorschau(true),
          disabled: !anspruchMoeglich,
          style: { padding: '10px', background: palette.skyDeep, color: palette.surface, /* Kontrast: onSand/sky 4.496:1 < AA → surface/skyDeep (Voll-Review 15.09.2026) */ border: 'none', borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm, ...(anspruchMoeglich ? null : gesperrtStil) }
        }, hinweisZeichen('kaestchen'), t('premium.document')),
        React.createElement('button', {
          onClick: () => setShowCalculation(false),
          style: { padding: '10px', background: palette.up, color: palette.text, border: '1px solid ' + palette.border, borderRadius: radius.sm, cursor: 'pointer', fontWeight: weight.semi, fontSize: text.sm }
        }, hinweisZeichen('kreuz'), t('common.close'))
      ),

      // Export-Vorschau (K20) direkt unter den Knöpfen, die sie geöffnet haben.
      ipvVorschau && React.createElement(ExportVorschau, {
        palette, t, art: 'ipvJson',
        quelle: { dokument: buildIpvDokument(data, t, ipvResult) },
        onWeiter: () => { setIpvVorschau(false); handleDownloadDocument(); },
        onZurueck: () => setIpvVorschau(false),
      })
    ),

    React.createElement(OfficialLinkBox, { palette, t, data, ids: 'praemienverbilligung', cantonalKey: 'ipv' }),

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '12px' } }, hinweisZeichen(), t('trust.localOnly')),

    onNavigate && React.createElement('button', {
      onClick: () => onNavigate('finanzuebersicht'),
      style: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sandDeep, fontFamily: 'inherit', fontWeight: weight.medium, marginTop: space.md }
    }, t('nav.finanzUebersicht')),

    // Crosslink: IPV wird kantonal beantragt → zu den offiziellen Behörden-Links
    onNavigate && React.createElement('button', {
      onClick: () => onNavigate('direktlinks'),
      style: { display: 'block', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: text.sm, color: palette.sandDeep, fontFamily: 'inherit', fontWeight: weight.medium, marginTop: space.sm }
    }, t('nav.direktlinks'))
  );
};

export default PremiumSubsidy;

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
import { merkpunktSichern } from './utils/merkliste.js';
import { ipvErinnerung, erinnerungLiegtSchon } from './data/ipvErinnerung.js';
import { useVorlaeufig } from './hooks/vorlaeufigContext.js';
import { readIpvStatus, nextIpvStatus, IPV_STATUS } from './data/ipvStatus.js';
import { verfuegungZuordnung, VERFUEGUNG_ZUORDNUNG } from './data/ipvAbzug.js';
import { abweichungen, mitUebergabe } from './data/schnellcheckUebergabe.js';
import { text, weight, radius , space } from './config/tokens.js';
import { GlossarText } from './GlossarBegriff.jsx';
import { betrag, zahl } from './utils/geld.js';
import { geburtsjahr } from './config/kantonsModell.js';
import { ansichtIkon } from './config/ansichtenRegister.js';

// Schweizer Format mit Tausender-Apostroph, konsistent zu Pegel/Beleg.
const fmtCHF = (n) => betrag(n || 0);

// schnellcheckZahlen (B-1/E22): { monthlyIncome, rentAmount, kkPremium } aus dem
// Schnellcheck, übergeben von main.jsx. Der Rechner rechnet damit und sagt es; das
// Profil ändert sich erst auf «Ins Profil übernehmen».
export const PremiumSubsidy = ({ palette, t, data: profil, onNavigate, onUpdateData, schnellcheckZahlen }) => {
  const vorlesen = useVorlesenContext();
  const [uebernommen, setUebernommen] = useState(false);
  // Regler (Fassung 5): ein Einkommen zum Ausprobieren. Gilt wie die Schnellcheck-Zahlen nur
  // hier — ins Profil geht es erst mit «Ins Profil übernehmen». null = nicht bewegt.
  const [regler, setRegler] = useState(null);
  const profilEinkommen = Number(profil && profil.finanzen && profil.finanzen.monthlyIncome) || 0;
  const schnellcheckOffen = abweichungen(profil, schnellcheckZahlen);
  // Ist der Regler bewegt, gilt sein Wert fürs Einkommen — auch wenn er wieder auf dem
  // Profilwert steht (dann ist das Einkommen nicht mehr «offen»).
  const schnellcheckListe = regler != null ? schnellcheckOffen.filter(([, feld]) => feld !== 'monthlyIncome') : schnellcheckOffen;
  const reglerOffen = regler != null && regler !== profilEinkommen ? [['finanzen', 'monthlyIncome', regler]] : [];
  const offeneZahlen = [...schnellcheckListe, ...reglerOffen];
  const data = mitUebergabe(profil, offeneZahlen);
  const [showCalculation, setShowCalculation] = useState(true);
  // IPV-Lebenslinie (Phase 2): der Beleg als Gesicht seines Ablaufs. Verfügungs-
  // Betrag lokal gepuffert (Init aus dem persistierten Status). Siehe docs/design/ipv-lebenslinie.md.
  const [verfBetrag, setVerfBetrag] = useState(() => {
    const s = readIpvStatus(data);
    return s.betrag ? String(s.betrag) : '';
  });
  // false | 'gespeichert' | 'vorlaeufig' (Beispiel/Ausprobieren: nichts in der echten Merkliste).
  const vorlaeufig = useVorlaeufig();
  const [renewAdded, setRenewAdded] = useState(() => (erinnerungLiegtSchon(t('ipvStatus.reminderTitle'), vorlaeufig) ? 'gespeichert' : false));
  // Für welches Jahr die Verfügung gilt (Deploy-Gate Runde 4): wählbar beim Eintragen, laufendes
  // oder folgendes Jahr — eine Verfügung fürs nächste Jahr kommt oft schon im Herbst.
  const laufendesJahr = new Date().getFullYear();
  const [verfJahr, setVerfJahr] = useState(String(laufendesJahr));
  // Export-Vorschau (K20): erst zeigen, was im IPV-Dokument steht, dann herunterladen.
  const [ipvVorschau, setIpvVorschau] = useState(false);
  // Unterlagen für den IPV-Antrag als offenen Punkt in die Merkliste legen (Muster wie Umzug),
  // nimmt der „Welche Papiere brauche ich?"-Unsicherheit die Spitze. Idempotent, Link → Lebensordner.
  // false | 'gespeichert' | 'vorlaeufig' (Beispiel/Ausprobieren: nichts in der echten Merkliste).
  const [permitAdded, setPermitAdded] = useState(false);

  // Zweitknopf: Umriss, kein Primär-Gewicht (neben dem einen lauten Knopf).
  const ruhigerKnopf = {
    display: 'inline-flex', alignItems: 'center', gap: space.xs + 'px', minHeight: '44px', boxSizing: 'border-box',
    padding: '10px 16px', background: 'none', color: palette.text, border: '1px solid ' + palette.border,
    borderRadius: radius.sm, cursor: 'pointer', fontFamily: 'inherit', fontWeight: weight.medium, fontSize: text.sm,
  };

  const permitTodoButton = () => React.createElement('button', {
    type: 'button',
    onClick: () => { const ergebnis = merkpunktSichern({ text: t('premium.permitTodoText'), link: 'tresor' }, vorlaeufig); if (ergebnis) setPermitAdded(ergebnis); },
    disabled: !!permitAdded,
    'aria-pressed': !!permitAdded,
    style: {
      ...ruhigerKnopf,
      cursor: permitAdded ? 'default' : 'pointer',
      border: '1px solid ' + (permitAdded ? palette.sage : palette.border),
      color: permitAdded ? (palette.sageDeep || palette.sage) : palette.text,
    },
  }, erledigtZeichen(!!permitAdded, permitAdded ? t(permitAdded === 'vorlaeufig' ? 'common.savedTemporary' : 'premium.permitTodoAdded') : t('premium.permitTodoAdd')));

  const canton = data.basis?.canton || '';
  const ipvResult = calculateIPV(data);
  const residenceType = data.wohnen?.residenceType || 'hauptwohnsitz';
  // Das Feld speichert `weekly`/`secondary` (constants.js, i18n residenceType.options); verglichen wurde mit
  // 'wochenaufenthalt'/'nebenwohnsitz' — der Hinweis erschien darum nie (Fachprüfung 25.10.2026). Beide Schreibweisen.
  const residenceKey = ['weekly', 'wochenaufenthalt'].includes(residenceType) ? 'wochenaufenthalt' : ['secondary', 'nebenwohnsitz'].includes(residenceType) ? 'nebenwohnsitz' : 'hauptwohnsitz';
  const kvgLink = getKVGApplicationLink(canton);
  // E9: Solange der Kanton nicht amtlich belegt ist, zeigt der Rechner keinen Betrag,
  // kein «Berechtigt» und keine Grenze — nur eine Orientierung mit dem Weg zum Kanton.
  const ohneBetrag = ipvResult.belegt === false;
  const anspruchMoeglich = !!ipvResult.anspruchMoeglich;
  const stelleUrl = (getCantonalLinks(canton) || {}).ipv || null;
  // Fassung 5: rechnet die App einen Betrag (kantonales Modell geladen), steht er wie bisher da.
  // Kann sie keinen rechnen, steht unter «Berechtigt» «Möglicher Betrag — nur auf Antrag».
  const betragGerechnet = typeof ipvResult.amount === 'number' && Number.isFinite(ipvResult.amount);

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

  // --- Bausteine des ruhigen Layouts (Fassung 5) ----------------------------
  // Abschnitts-Titel: echte Überschrift (h3) im ruhigen Kleinformat, keine Versalien.
  const abschnittTitel = (label, id) => React.createElement('h3', {
    id,
    style: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text, margin: '0 0 ' + space.sm + 'px' },
  }, label);
  // Aufklapp-Zeile wie im Mockup: Linie unten, Titel als <summary> mit 44 px Tippfläche.
  const aufklappZeile = (titel, inhalt, opts = {}) => React.createElement('details', {
    open: opts.open || undefined,
    style: { borderBottom: '1px solid ' + palette.border, padding: space.xs + 'px 0 ' + space.sm + 'px' },
  },
    React.createElement('summary', {
      style: { cursor: 'pointer', minHeight: '44px', display: 'flex', alignItems: 'center', fontSize: text.sm, fontWeight: weight.semi, color: palette.text },
    }, titel),
    inhalt
  );
  const fliesstext = { fontSize: text.sm, color: palette.mid, lineHeight: '1.55', margin: space.xs + 'px 0 0' };

  // Kopf links: Icon, Titel mit Glossar «IPV ⓘ», Untertitel mit Vorlesen daneben.
  const kopf = () => React.createElement(React.Fragment, null,
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: ansichtIkon('premium'), size: 22 }), style: { marginBottom: space.sm } },
      React.createElement(GlossarText, { palette, t }, t('premium.title'))),
    React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, margin: '0 0 ' + space.lg + 'px', lineHeight: '1.5' } }, t('premium.subtitle'), vorlesen?.enabled && React.createElement(VorlesenButton, { text: t('premium.subtitle'), speak: vorlesen.speak, color: palette.mid, label: t('vorlesen.label') }))
  );

  // «Anspruch & Aufenthaltsbewilligung» als Aufklapp-Zeile (offen) — ruhige Orientierung für
  // Neuzuzüger:innen, kein Verdikt (Quellen: SVA Zürich „Wer hat Anspruch", Kanton Basel-Stadt).
  const anspruchZeile = () => aufklappZeile(t('premium.permitTitle'),
    React.createElement('p', { style: fliesstext }, t('premium.permitText')),
    { open: true });

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
    type: 'button',
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

  // «Jährlich erinnern» in JEDEM Schritt (Fassung 5, Wunsch Stebler Studios 23.10.2026; vorher nur nach
  // der Verfügung): legt «Prämienverbilligung fürs nächste Jahr prüfen» als jährliche Aufgabe auf
  // die Merkliste. Im Beispiel und beim Ausprobieren bleibt nichts (merkpunktSichern).
  const erinnern = () => {
    if (renewAdded) return;
    const datum = ipvStatus.status === IPV_STATUS.BESTAETIGT ? ipvStatus.datum : null;
    const ergebnis = merkpunktSichern(ipvErinnerung(t, datum), vorlaeufig);
    if (ergebnis) setRenewAdded(ergebnis);
  };
  const erinnernZeile = (weitere = []) => React.createElement(React.Fragment, null,
    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: '1.55', margin: space.md + 'px 0 ' + space.sm + 'px' } }, t('ipvStatus.renewLead')),
    React.createElement('div', { style: { display: 'flex', gap: space.sm, flexWrap: 'wrap', alignItems: 'center' } },
      lineBtn(erledigtZeichen(!!renewAdded, renewAdded ? t(renewAdded === 'vorlaeufig' ? 'common.savedTemporary' : 'ipvStatus.renewAdded') : t('ipvStatus.renewAdd')),
        erinnern, { pressed: !!renewAdded }),
      ...weitere
    )
  );

  const renderLebenslinie = () => {
    if (!onUpdateData || !hasIncome) return null;
    // Ein bereits beantragter/bestätigter Status bleibt sichtbar, auch wenn die
    // aktuelle Live-Schätzung knapp unter die Grenze fällt — sonst verschwänden
    // real eingetragene Verfügungsdaten. Nur im reinen Schätz-Zustand blenden wir
    // die Lebenslinie aus, wenn (noch) kein Anspruch geschätzt wird.
    if (!anspruchMoeglich && ipvStatus.status === IPV_STATUS.GESCHAETZT) return null;
    const h = React.createElement;
    const weg = (children) => h('section', {
      'aria-labelledby': 'ipv-weg-titel',
      style: { padding: space.md + 'px 0', borderBottom: '1px solid ' + palette.border },
    }, ...children);
    const head = (badge) => h('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: space.sm, marginBottom: space.xs } },
      h('h3', { id: 'ipv-weg-titel', style: { fontSize: text.lg, fontWeight: weight.semi, color: palette.text, margin: 0 } }, t('ipvStatus.title')),
      badge || null
    );
    const lead = (s) => h('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: '1.55', marginBottom: space.sm } }, s);

    if (ipvStatus.status === IPV_STATUS.BESTAETIGT) {
      const stamp = h('span', { style: { border: '2px solid ' + palette.sageDeep, color: palette.sageDeep, fontSize: text.xs, fontWeight: weight.semi, letterSpacing: '0.5px', padding: '2px 8px', borderRadius: radius.xs, transform: 'rotate(-6deg)', display: 'inline-block' } }, t('ipvStatus.stamp'));
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
      return weg([
        head(stamp),
        hinweis,
        zuordnen,
        ipvStatus.betrag > 0
          ? h('div', { style: { fontSize: text.lg, fontWeight: weight.bold, color: palette.sageDeep, marginBottom: space.sm } }, fmtCHF(ipvStatus.betrag) + ' / ' + t('schnellcheck.monat'))
          : h('div', { style: { fontSize: text.sm, color: palette.mid, marginBottom: space.sm } }, t('ipvStatus.betragPrompt')),
        h('label', { htmlFor: 'ipv-verf-betrag', style: { display: 'block', fontSize: text.xs, color: palette.mid, marginBottom: space.xs } }, t('ipvStatus.betragLabel')),
        h('div', { style: { display: 'flex', gap: space.sm, alignItems: 'center', flexWrap: 'wrap' } },
          h('input', {
            id: 'ipv-verf-betrag',
            type: 'number', inputMode: 'numeric', min: '0', value: verfBetrag,
            onChange: (e) => setVerfBetrag(e.target.value),
            onBlur: () => setIpvStatus(IPV_STATUS.BESTAETIGT, { betrag: verfBetrag, datum: ipvStatus.datum, kanton: ipvStatus.kanton, jahr: ipvStatus.jahr }),
            style: { width: '120px', padding: '9px 10px', minHeight: '44px', fontSize: text.sm, border: '1px solid ' + palette.border, borderRadius: radius.sm, background: palette.surface, color: palette.text, fontFamily: 'inherit' },
          })
        ),
        erinnernZeile([lineBtn(t('ipvStatus.reset'), () => { setVerfBetrag(''); setIpvStatus(IPV_STATUS.GESCHAETZT); })]),
      ]);
    }

    if (ipvStatus.status === IPV_STATUS.BEANTRAGT) {
      const badge = h('span', { style: { fontSize: text.xs, fontWeight: weight.semi, color: palette.sandDeep } }, t('ipvStatus.appliedLabel'));
      return weg([
        head(badge),
        lead(t('ipvStatus.appliedLead')),
        jahrWahl(),
        h('div', { style: { display: 'flex', gap: space.sm, flexWrap: 'wrap' } },
          lineBtn(t('ipvStatus.markConfirmed'), verfuegungEintragen, { primary: true }),
          lineBtn(t('ipvStatus.reset'), () => setIpvStatus(IPV_STATUS.GESCHAETZT))
        ),
        erinnernZeile(),
      ]);
    }

    // geschaetzt — ehrliche Verzweigung: zwei Wege neutral, beide Übergänge offen.
    return weg([
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
      erinnernZeile(),
    ]);
  };

  // Codex-Audit 24.09., Nachtrag: nach Kanton und Einkommen hielt die Rechnung an der nächsten
  // fehlenden Angabe an (Geburtsdatum, PLZ/Ort, Prämie) — mit einem Satz, aber ohne Feld. Fehlt
  // genau eine eigene Angabe, steht ihr Feld hier; es schreibt dasselbe Profilfeld wie das Kapitel.
  // Kinder-Geburtsdaten bleiben im Haushalt: dort gibt es je Kind eine Zeile, hier nicht.
  const uebernehmen = (feld, wert) => {
    const v = String(wert ?? '').trim();
    if (v !== String(feld.value ?? '')) onUpdateData(feld.kapitel, feld.k, v);
  };
  const offenFeld = (offen) => {
    if (!onUpdateData) return null;
    // Bis vier Ziffern stehen, bleibt das PLZ-Feld — sonst spränge es beim ersten Tippen zum Ort-Feld.
    const plz = String(data.wohnen?.postalCode || '').trim();
    const ohnePlz = !/^\d{4}$/.test(plz);
    const felder = [
      offen === 'alter' && !geburtsjahr(data.basis) && { id: 'ipv-geburt', kapitel: 'basis', k: 'dateOfBirth', type: 'date', label: t('chapters.basis.fields.dateOfBirth'), value: data.basis?.dateOfBirth || '', autoComplete: 'bday' },
      offen === 'region' && ohnePlz && { id: 'ipv-plz', kapitel: 'wohnen', k: 'postalCode', type: 'text', label: t('chapters.wohnen.fields.postalCode'), value: plz, inputMode: 'numeric', autoComplete: 'postal-code' },
      // PLZ da, Gemeinde trotzdem offen: die PLZ deckt mehrere Gemeinden ab → der Ort entscheidet.
      offen === 'region' && !ohnePlz && { id: 'ipv-ort', kapitel: 'wohnen', k: 'city', type: 'text', label: t('chapters.wohnen.fields.city'), value: data.wohnen?.city || '', autoComplete: 'address-level2' },
      offen === 'praemie' && { id: 'ipv-praemie', kapitel: 'versicherungen', k: 'kkPremium', type: 'number', label: t('chapters.versicherungen.fields.kkPremium'), value: data.versicherungen?.kkPremium ?? '', inputMode: 'decimal' },
    ];
    const feld = felder.find(Boolean);
    if (!feld) return null;
    return React.createElement('div', { style: { marginTop: space.sm } },
      React.createElement('label', { htmlFor: feld.id, style: { display: 'block', fontSize: text.sm, fontWeight: weight.semi, color: palette.text, marginBottom: '6px' } }, feld.label),
      // Unkontrolliert, übernommen beim Verlassen, mit Enter oder «Speichern». Bei jedem Tastendruck
      // zu schreiben machte schon die erste Ziffer zur Angabe: im Browser verschwand das Prämienfeld
      // nach «4» mitten im Tippen, der Fokus war weg (24.09.). `key` setzt es bei neuem Wert zurück.
      React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: space.sm } },
      React.createElement('input', {
        key: feld.id + ':' + feld.value,
        id: feld.id, type: feld.type, defaultValue: feld.value,
        ...(feld.type === 'number' && { min: '0' }),
        ...(feld.inputMode && { inputMode: feld.inputMode }),
        ...(feld.autoComplete && { autoComplete: feld.autoComplete }),
        'aria-describedby': feld.id + '-hinweis',
        onBlur: (e) => uebernehmen(feld, e.target.value),
        onKeyDown: (e) => { if (e.key === 'Enter') uebernehmen(feld, e.target.value); },
        style: { padding: '8px 10px', fontSize: text.sm, border: '1px solid ' + palette.border, borderRadius: radius.sm, background: palette.surface, color: palette.text, fontFamily: 'inherit', minWidth: '180px' },
      }),
      React.createElement('button', {
        type: 'button',
        onClick: () => { const el = document.getElementById(feld.id); if (el) uebernehmen(feld, el.value); },
        style: { padding: '8px 14px', fontSize: text.sm, fontWeight: weight.semi, fontFamily: 'inherit', cursor: 'pointer', border: '1px solid ' + palette.border, borderRadius: radius.sm, background: palette.up, color: palette.text },
      }, t('common.save'))
      ),
      React.createElement('p', { id: feld.id + '-hinweis', style: { margin: space.xs + 'px 0 0', fontSize: text.xs, color: palette.mid, lineHeight: '1.5' } }, t('premium.feldImProfil'))
    );
  };

  // Hinweise je nach Lage (Fassung 5: im ruhigen Gold-Kasten wie im Mockup, Texte wie bisher).
  const lageHinweisStil = { padding: '10px 12px', borderRadius: radius.md, background: palette.gold + '1A', border: '1px solid ' + palette.gold + '66', fontSize: text.sm, color: palette.text, lineHeight: '1.5', marginBottom: space.md };

  // Only block when the canton is genuinely missing. If the canton is set but the
  // income isn't yet, we still show the canton-specific info and prompt for income.
  if (!canton) {
    return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
      kopf(),
      // «Ihre Lage» mit dem Hinweis «Kanton fehlt»: Codex-Audit 24.09. — die Kachel verspricht
      // «Kanton und Einkommen hier eingeben», die Wahl steht deshalb direkt hier. Sie schreibt
      // basis.canton, dasselbe Feld wie Einführung und «Persönliche Basis».
      React.createElement('section', { 'aria-labelledby': 'ipv-lage-titel', style: { paddingBottom: space.md, borderBottom: '1px solid ' + palette.border } },
        abschnittTitel(t('premium.lageTitle'), 'ipv-lage-titel'),
        React.createElement('div', { style: { ...lageHinweisStil, marginBottom: 0 } },
          onUpdateData
            ? React.createElement(React.Fragment, null,
                React.createElement('label', { htmlFor: 'ipv-kanton', style: { display: 'block', color: palette.text, fontWeight: weight.semi, marginBottom: '6px' } }, t('premium.cantonChoose')),
                React.createElement('select', {
                  id: 'ipv-kanton',
                  value: '',
                  onChange: (e) => { if (e.target.value) onUpdateData('basis', 'canton', e.target.value); },
                  'aria-describedby': 'ipv-kanton-hinweis',
                  style: { padding: '8px 10px', minHeight: '44px', fontSize: text.sm, border: '1px solid ' + palette.border, borderRadius: radius.sm, background: palette.surface, color: palette.text, fontFamily: 'inherit', appearance: 'auto', minWidth: '220px', maxWidth: '100%' },
                },
                  React.createElement('option', { value: '' }, t('common.select')),
                  CANTON_CODES.map((c) => React.createElement('option', { key: c, value: c }, getCantonName(c, t)))
                ),
                React.createElement('p', { id: 'ipv-kanton-hinweis', style: { margin: space.xs + 'px 0 0', fontSize: text.xs, color: palette.mid, lineHeight: '1.5' } }, t('premium.cantonSavedHint'))
              )
            : React.createElement('span', { style: { color: palette.text } }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('premium.enterCanton')))
        )
      ),
      // Anspruch & Bewilligung — gerade für Neuzuzüger:innen ohne gesetzten Kanton relevant.
      anspruchZeile(),
      React.createElement('div', { style: { marginTop: space.md } }, permitTodoButton())
    );
  }

  // --- Regler «Einkommen pro Monat» -----------------------------------------
  // Der Wert steht im Regler, gerechnet wird mit ihm (data.finanzen.monthlyIncome). Die Spanne
  // ist eine Bedien-Spanne, keine Grenze: bis mindestens CHF 12'000, sonst bis zum Doppelten des
  // Ausgangswerts — an keiner Stelle eine Aussage über den Anspruch.
  const einkommenJetzt = Number(data.finanzen?.monthlyIncome) || 0;
  const reglerMax = Math.max(12000, Math.ceil((Math.max(profilEinkommen, Number(schnellcheckZahlen?.monthlyIncome) || 0) * 2) / 1000) * 1000);
  const reglerBlock = () => React.createElement('div', { style: { margin: space.md + 'px 0' } },
    React.createElement('label', { htmlFor: 'ipv-regler', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: space.sm, flexWrap: 'wrap', fontSize: text.sm, color: palette.text, marginBottom: space.xs } },
      React.createElement('span', null, t('finanzUebersicht.monthlyIncome')),
      React.createElement('b', { style: { fontWeight: weight.semi, color: palette.text, whiteSpace: 'nowrap' } }, fmtCHF(einkommenJetzt) + ' ' + t('common.perMonth'))
    ),
    React.createElement('input', {
      id: 'ipv-regler', type: 'range', min: 0, max: reglerMax, step: 100,
      value: Math.min(reglerMax, einkommenJetzt),
      'aria-valuetext': fmtCHF(einkommenJetzt) + ' ' + t('common.perMonth'),
      onChange: (e) => { setRegler(Number(e.target.value) || 0); setUebernommen(false); },
      style: { width: '100%', minHeight: '44px', accentColor: palette.sand, cursor: 'pointer' },
    })
  );

  // B-1/E22 + Regler: sichtbar sagen, womit gerechnet wird. Ins Profil geht nichts ohne den Klick.
  const uebernahmeBlock = () => offeneZahlen.length > 0 ? React.createElement('div', { style: { padding: '12px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border, borderLeft: '3px solid ' + palette.sky, marginBottom: space.md, fontSize: text.sm, lineHeight: '1.5' } },
    schnellcheckListe.length > 0 && React.createElement('div', { style: { fontWeight: weight.semi, color: palette.text, marginBottom: space.xs } }, t('premium.schnellcheckGerechnet')),
    schnellcheckListe.length > 0 && React.createElement('ul', { style: { margin: '0 0 ' + space.xs + 'px', paddingLeft: '18px', color: palette.text } },
      schnellcheckListe.map(([, feld, wert]) => React.createElement('li', { key: feld },
        t(feld === 'monthlyIncome' ? 'schnellcheck.income' : feld === 'rentAmount' ? 'schnellcheck.rent' : 'schnellcheck.kk') + ': ' + fmtCHF(wert)))
    ),
    React.createElement('div', { style: { color: palette.mid, marginBottom: onUpdateData ? space.sm : 0 } }, t('premium.schnellcheckProfilBleibt')),
    onUpdateData && React.createElement('button', {
      type: 'button',
      onClick: () => { offeneZahlen.forEach(([kapitel, feld, wert]) => onUpdateData(kapitel, feld, wert)); setUebernommen(true); },
      style: { cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, fontWeight: weight.semi, padding: '8px 14px', minHeight: '44px', borderRadius: radius.sm, background: 'none', color: palette.sandDeep, border: '1px solid ' + palette.border },
    }, t('premium.schnellcheckUebernehmen'))
  ) : uebernommen && React.createElement('div', { role: 'status', style: { fontSize: text.sm, color: palette.sageDeep, marginBottom: space.md } }, hinweisZeichen('check'), t('premium.schnellcheckUebernommen'));

  // Ergebnis — Urteil gross, darunter der Satz; die Beträge, wo die App sie rechnet.
  const urteil = (label, farbe, zeichen) => React.createElement('div', { style: { fontSize: text.xl, fontWeight: weight.bold, color: farbe, lineHeight: '1.2', margin: space.sm + 'px 0 ' + space.xs + 'px' } }, hinweisZeichen(zeichen), label);
  const ergebnis = () => {
    // Eligibility Status — only once income is present; otherwise prompt for income
    if (!hasIncome) return React.createElement('div', { style: { padding: '12px', background: palette.sky + '15', borderRadius: radius.sm, border: '1px solid ' + palette.sky + '40', marginBottom: space.md } },
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
          style: { width: '140px', padding: '8px 10px', minHeight: '44px', fontSize: text.sm, border: '1px solid ' + palette.border, borderRadius: radius.sm, background: palette.surface, color: palette.text, fontFamily: 'inherit' }
        }),
        React.createElement('span', { style: { fontSize: text.sm, color: palette.mid } }, 'CHF ' + t('common.perMonth'))
      )
    );
    // Orientierung ohne Betrag (E9): ruhig, kein Verdikt in beide Richtungen.
    if (ohneBetrag) return React.createElement('div', { style: { marginBottom: space.md } },
      React.createElement('div', { style: { fontSize: text.sm, color: palette.text, lineHeight: '1.5' } }, hinweisZeichen(), t(ipvResult.noteKey, ipvResult.noteParams)),
      // Warum hier keine Zahl steht (K31, Fachprüfung 20.09.2026). Ohne diesen Satz liest sich
      // «kein Betrag» wie «der Kanton ist ungeprüft» — es heisst aber oft nur, dass eine Angabe fehlt.
      ipvResult.offen && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, lineHeight: '1.5', marginTop: space.xs } }, t('ipv.offenGrund.' + ipvResult.offen)),
      offenFeld(ipvResult.offen),
      stelleUrl && React.createElement(ExternerLink, { t, href: stelleUrl, style: { display: 'inline-block', marginTop: space.sm, fontSize: text.sm, fontWeight: weight.semi, color: palette.sageDeep, textDecoration: 'underline', textUnderlineOffset: '2px' } }, t('ipv.zurStelle')),
      ipvResult.youngAdultsCount > 0 && React.createElement('div', { style: { ...lageHinweisStil, marginTop: space.sm, marginBottom: 0 } }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('ipv.youngAdultsNote')))
    );
    if (ipvResult.eligible) return React.createElement('div', { style: { marginBottom: space.md } },
      // «Berechtigt» stimmt nicht, wo der Kanton den Anspruch nur auf Antrag prüft (GE unter der
      // RDU-Untergrenze): dann eine Überschrift, die den Antrag nennt, ohne Häkchen — sonst stünde
      // «Berechtigt» neben «prüft nicht automatisch» (Rechtsprüfung 28.09.2026).
      urteil(t(ipvResult.antragNoetig ? 'premium.eligibleAntrag' : 'premium.eligible'), palette.sageDeep, ipvResult.antragNoetig ? undefined : 'check'),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.text, lineHeight: '1.5' } }, t(ipvResult.noteKey, ipvResult.noteParams)),
      // Fassung 5: ohne gerechneten Betrag steht unter «Berechtigt» der Antrags-Satz statt einer Zahl.
      !betragGerechnet && !ipvResult.antragNoetig && React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: space.xs } }, t('premium.eligibleAntrag')),
      ipvResult.youngAdultsCount > 0 && React.createElement('div', { style: { ...lageHinweisStil, marginTop: space.sm, marginBottom: 0 } }, hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('ipv.youngAdultsNote')))
    );
    return React.createElement('div', { style: { marginBottom: space.md } },
      urteil(t('premium.notEligible'), palette.text),
      React.createElement('div', { style: { fontSize: text.sm, color: palette.mid } }, t(ipvResult.noteKey, ipvResult.noteParams))
    );
  };

  // Beträge — nur mit amtlich belegtem Kanton (E9) und nur, wo die App einen rechnet.
  const betraege = () => (hasIncome && showCalculation && !ohneBetrag && betragGerechnet) && React.createElement('div', { style: { border: '1px solid ' + palette.border + '66', borderRadius: radius.sm, background: palette.up, marginBottom: space.md } },
    React.createElement('div', { style: { padding: space.sm + 'px ' + space.md + 'px', borderBottom: '1px solid ' + palette.border + '33' } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: space.md } },
        React.createElement('span', { style: { fontSize: text.body, color: palette.text } }, t('premium.monthlySubsidy')),
        React.createElement('span', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text, whiteSpace: 'nowrap' } }, betrag(ipvResult.amount, { hoechstens: 2 }))
      ),
      ipvResult.reductionPercent != null && ipvResult.reductionPercent < 100 && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } },
        t('premium.reductionNote', { percent: ipvResult.reductionPercent })
      )
    ),
    React.createElement('div', { style: { padding: space.sm + 'px ' + space.md + 'px' } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: space.md } },
        React.createElement('span', { style: { fontSize: text.body, color: palette.text } }, t('premium.annualSubsidy')),
        React.createElement('span', { style: { fontSize: text.body, fontWeight: weight.semi, color: palette.text, whiteSpace: 'nowrap' } }, betrag(ipvResult.annual || 0, { hoechstens: 2 }))
      ),
      ipvResult.maxAnnual && ipvResult.annual < ipvResult.maxAnnual && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.xs } },
        t('premium.maxPossible', { value: ipvResult.maxAnnual })
      )
    ),
    // Wie im Steuerrechner (annahmen.ohneDreizehnten): die Frage nach dem 13. Monatslohn ist offen,
    // gerechnet ×12 — mit 13. läge die Verbilligung tiefer. Sichtbar, nicht still angenommen.
    ipvResult.annahmen?.ohneDreizehnten && React.createElement('div', { style: { padding: '0 ' + space.md + 'px ' + space.sm + 'px', fontSize: text.xs, color: palette.mid, lineHeight: '1.5' } },
      hinweisZeichen(), t('ipv.annahmeOhneDreizehnten')),
    ipvResult.annahmen?.partnerOhneDreizehnten && React.createElement('div', { style: { padding: '0 ' + space.md + 'px ' + space.sm + 'px', fontSize: text.xs, color: palette.mid, lineHeight: '1.5' } },
      hinweisZeichen(), t('ipv.annahmePartnerOhneDreizehnten'))
  );

  // Anspruchsjahr, Prämienregion und die amtlichen Vorbehalte — nur dort, wo ein Kanton
  // nach seinem eigenen Modell gerechnet wurde (alle Kantone in IPV_MODULE). Eine konkrete Zahl ohne ihr Jahr
  // und ohne den Rückzahlungs-Vorbehalt wäre zu selbstsicher (Fachprüfung 20.09.2026).
  const grundlage = () => ipvResult.jahr && React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, lineHeight: '1.5', marginBottom: '12px' } },
    // Prämienregion nur, wo es eine gibt: Im Aargau hängt die Richtprämie nicht an der
    // Region (V KVGG § 4 Abs. 1), darum dort ein eigener Satz statt «Prämienregion undefined».
    // `jahrKey`: ein Kanton ohne Prämienregionen, der nicht der Aargau ist, bringt seinen eigenen
    // Satz mit (UR, NE, OW, NW, 28.09.2026) — `ipv.jahrOhneRegion` nennt den Aargau beim Namen.
    React.createElement('div', null, ipvResult.jahrKey
      ? t(ipvResult.jahrKey, { jahr: ipvResult.jahr })
      : ipvResult.region
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
    // Ein Schlüssel oder eine Liste (VD: spezifischer Subside und Vermögensgrenze 2027 zugleich).
    ...[].concat(ipvResult.zusatzVorbehaltKey || []).map((k) => React.createElement('div', { key: k, style: { marginTop: space.xs } },
      t(k))),
    // Der Weg zur zuständigen Stelle gehört auch dorthin, wo ein Betrag steht — gerade wenn
    // der Anspruch beantragt werden muss.
    stelleUrl && React.createElement(ExternerLink, { t, href: stelleUrl, style: { display: 'inline-block', marginTop: space.xs, fontSize: text.xs, fontWeight: weight.semi, color: palette.sageDeep, textDecoration: 'underline', textUnderlineOffset: '2px' } }, t('ipv.zurStelle'))
  );

  return React.createElement('div', { style: { maxWidth: '720px', background: palette.surface, padding: '20px', borderRadius: radius.sm, border: '1px solid ' + palette.border } },
    kopf(),

    // ── Ihre Lage ─────────────────────────────────────────────────────────
    React.createElement('section', { 'aria-labelledby': 'ipv-lage-titel', style: { padding: space.md + 'px 0', borderTop: '1px solid ' + palette.border, borderBottom: '1px solid ' + palette.border } },
      abschnittTitel(t('premium.lageTitle'), 'ipv-lage-titel'),

      // Kanton, Modell, Grenze — die Lage, in der gerechnet wird.
      React.createElement('div', { style: { fontSize: text.sm, color: palette.text, lineHeight: '1.55', marginBottom: space.sm } },
        React.createElement('div', { style: { fontWeight: weight.semi, color: palette.text } }, t('premium.canton', { name: getCantonName(canton, t) || t('premium.cantonUnknown') })),
        ipvResult.cantonData && React.createElement('div', { style: { color: palette.mid } },
          React.createElement('div', null, t('premium.model', { value: t(ipvResult.cantonData.modelKey) })),
          // Nicht jeder Kanton publiziert eine Einkommensgrenze als Zahl: der Aargau definiert
          // sie in § 5 Abs. 5 KVGG, veröffentlicht sie aber nicht. Eine abgeleitete Zahl wäre
          // unsere eigene Rechnung — dann lieber keine Zeile (K31, 20.09.2026).
          ipvResult.cantonData.maxIncome != null && React.createElement('div', null, t('premium.maxIncome', { value: zahl(ipvResult.cantonData.maxIncome, { hoechstens: 2 }) })),
          React.createElement('div', null, t('premium.note', { value: t(ipvResult.cantonData.noteKey, ipvResult.cantonData.noteParams) }))
        )
        // E9: unbelegt weder Modell noch Grenze noch Verfahrens-Hinweis (für GL nachweislich
        // falsch) — der Weg zum Kanton steht als Link in der Orientierung darunter.
      ),

      // Wochenaufenthalt / Nebenwohnsitz (Fachprüfung 25.10.2026): zuständig für die IPV und massgebend für die
      // Prämie ist der Hauptwohnsitz (KVG Art. 61 Abs. 2, Art. 65 Abs. 1). Gerechnet wird mit dem eingetragenen
      // Kanton — der Hinweis nennt ihn, damit auffällt, wenn dort der Arbeitsort steht.
      residenceKey !== 'hauptwohnsitz' && React.createElement('div', { 'data-teil': 'wohnsitz-hinweis', style: lageHinweisStil },
        React.createElement('div', { style: { fontWeight: weight.semi, color: palette.goldDeep, marginBottom: space.xs } }, hinweisZeichen(), t(residenceKey === 'wochenaufenthalt' ? 'premium.weeklyResidence' : 'premium.nebenResidence')),
        React.createElement('div', null, t('premium.weeklyIpvNote')),
        React.createElement('div', null, t('premium.weeklyKkNote')),
        canton && React.createElement('div', null, t('premium.weeklyKanton', { kanton: kantonName(canton) }))
      ),

      // Nur wo die App rechnet: ohne amtlich belegten Kanton (E9) änderte der Regler nichts —
      // die Seite bleibt dort für jedes Einkommen gleich (ipvOhneBeleg.test.js).
      hasIncome && !ohneBetrag && reglerBlock(),
      uebernahmeBlock(),
      ergebnis(),
      betraege(),
      grundlage()
    ),

    // ── Aufklapp-Zeilen wie die App-Überschriften ─────────────────────────
    anspruchZeile(),
    aufklappZeile(t('premium.requiredDocs'),
      React.createElement('ul', { style: { ...fliesstext, paddingLeft: '20px' } },
        [t('premium.doc1'), t('premium.doc2'), t('premium.doc3'), t('premium.doc4')].map((doc, idx) =>
          React.createElement('li', { key: idx, style: { marginBottom: space.xs } }, doc)
        )
      )),
    aufklappZeile(t('dl.mirrorTitle'),
      React.createElement(OfficialLinkBox, { palette, t, data, ids: 'praemienverbilligung', cantonalKey: 'ipv', ohneRahmen: true })),

    // ── Ihr IPV-Weg ───────────────────────────────────────────────────────
    renderLebenslinie(),

    // Knöpfe — EIN lauter Knopf (Online-Antrag), die anderen ruhig (Seitenrundgang
    // 27.09.2026: vorher drei gefüllte Flächen, «Dokument» in skyDeep genauso laut).
    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: space.sm, alignItems: 'center', margin: space.md + 'px 0' } },
      // Bleibt ein eigener Knopf statt PrimaryButton: gesperrt gilt der Stil aus K53
      // (gestrichelt, ohne Deckkraft) — PrimaryButton dimmt über opacity.
      hasIncome && showCalculation && React.createElement('button', {
        type: 'button',
        onClick: handleApplyOnline,
        disabled: !anspruchMoeglich,
        style: { display: 'inline-flex', alignItems: 'center', gap: space.xs + 'px', minHeight: '44px', boxSizing: 'border-box', padding: '10px 16px', background: palette.sand, color: palette.onSand, border: 'none', borderRadius: radius.sm, cursor: 'pointer', fontFamily: 'inherit', fontWeight: weight.semi, fontSize: text.sm, ...(anspruchMoeglich ? null : gesperrtStil) }
      },
        // K64: Zeichen und Ansage kommen aus ZielHinweis — derselbe Baustein wie in
        // ExternerLink, damit das Versprechen nicht an zwei Orten gepflegt wird.
        React.createElement(ZielHinweis, { t }),
        t('premium.applyOnline')
      ),
      // «Unterlagen für den Antrag merken» — wie bisher ein Merkliste-Eintrag, danach «Auf der Merkliste».
      permitTodoButton(),
      hasIncome && showCalculation && React.createElement('button', {
        type: 'button',
        onClick: () => setIpvVorschau(true),
        disabled: !anspruchMoeglich,
        style: { ...ruhigerKnopf, ...(anspruchMoeglich ? null : gesperrtStil) }
      }, hinweisZeichen('kaestchen'), t('premium.document')),
      hasIncome && showCalculation && React.createElement('button', {
        type: 'button',
        onClick: () => setShowCalculation(false),
        style: { ...ruhigerKnopf, color: palette.mid }
      }, hinweisZeichen('kreuz'), t('common.close'))
    ),

    // Export-Vorschau (K20) direkt unter den Knöpfen, die sie geöffnet haben.
    hasIncome && showCalculation && ipvVorschau && React.createElement(ExportVorschau, {
      palette, t, art: 'ipvJson',
      quelle: { dokument: buildIpvDokument(data, t, ipvResult) },
      onWeiter: () => { setIpvVorschau(false); handleDownloadDocument(); },
      onZurueck: () => setIpvVorschau(false),
    }),

    // All cantons overview — nur amtlich belegte Kantone (E9); ohne einen belegten entfällt der
    // Vergleich (Logik unverändert, Fassung 5: «Alle Kantone vergleichen» bleibt wie heute).
    hasIncome && showCalculation && belegteKantone.length > 0 && React.createElement('details', { style: { marginBottom: space.md } },
      React.createElement('summary', { style: { cursor: 'pointer', fontSize: text.sm, fontWeight: weight.semi, color: palette.mid, padding: '8px 0', minHeight: '44px' } }, t('premium.compareCantons')),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: space.sm, marginTop: space.sm } },
        belegteKantone.map(([key, val]) =>
          React.createElement('div', {
            key,
            style: {
              padding: space.sm,
              background: key === canton ? palette.sage + '22' : palette.up,
              borderRadius: radius.xs,
              border: '1px solid ' + (key === canton ? palette.sage : palette.border),
              fontSize: text.sm, color: palette.text,
            }
          },
            React.createElement('div', { style: { fontWeight: weight.semi } }, key + ' — ' + getCantonName(key, t)),
            React.createElement('div', { style: { color: palette.mid } }, 'Max: ' + betrag(val.maxIncome, { hoechstens: 2 }) + ' | Single: ' + betrag(val.subsidySingle, { hoechstens: 2 }) + t('common.perYear'))
          )
        )
      )
    ),

    React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginBottom: '12px', fontStyle: 'italic' } }, t('premium.disclaimer')),

    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '12px' } }, hinweisZeichen(), t('trust.localOnly')),

    onNavigate && React.createElement('button', {
      type: 'button',
      onClick: () => onNavigate('finanzuebersicht'),
      style: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, minHeight: '44px', fontSize: text.sm, color: palette.sandDeep, fontFamily: 'inherit', fontWeight: weight.medium, marginTop: space.md }
    }, t('nav.finanzUebersicht')),

    // Crosslink: IPV wird kantonal beantragt → zu den offiziellen Behörden-Links
    onNavigate && React.createElement('button', {
      type: 'button',
      onClick: () => onNavigate('direktlinks'),
      style: { display: 'block', background: 'none', border: 'none', cursor: 'pointer', padding: 0, minHeight: '44px', fontSize: text.sm, color: palette.sandDeep, fontFamily: 'inherit', fontWeight: weight.medium }
    }, t('nav.direktlinks'))
  );
};

export default PremiumSubsidy;

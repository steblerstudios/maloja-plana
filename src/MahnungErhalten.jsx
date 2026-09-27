import React, { useState } from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';
import { leseBetrag } from './briefGenerator.js';
import { verzugszins, zinsEingabeStatus, SATZ_GESETZ } from './utils/verzugszins.js';
import { zahl } from './utils/geld.js';
import { text, radius, space, weight } from './config/tokens.js';

// Mahnung erhalten — die Stufe VOR der Betreibung, gebaut 27.09.2026 auf Wunsch von
// Stebler Studios. Hier ist der Spielraum am grössten: prüfen, bestreiten, Raten anfragen.
// Jede Aussage am Gesetzeswortlaut (Fedlex-Filestore, gelesen 27.09.2026): OR Stand
// 1.1.2026 (Fassungen 1.10.2026 und 1.7.2027 für diese Artikel wortgleich), SchKG Stand
// 1.1.2026, KVG Stand 1.7.2026, KVV Stand 1.8.2026. «Mahngebühr» kommt im OR nicht vor
// (Volltextsuche in der Fassung 1.1.2026: 0 Treffer). Nachprüfung 27.09.2026 (Rechts- + Fach-
// Prüfer): 104 Abs. 2, 102 Abs. 2 «mit Ablauf», SchKG 149a, OR 137 Abs. 2, KVG 64a Abs. 7 ergänzt.
// Bewusst OHNE Frist-Knopf: die Zahlungsfrist einer Mahnung setzt der Gläubiger, nicht das
// Gesetz; die 30-Tage-Nachfrist der Krankenkasse steht auf der Zahlungsaufforderung selbst
// (KVG Art. 64a Abs. 1) — ab welchem Tag sie läuft, sagt das Gesetz nicht, also rechnen wir nicht.
// Keine Aussage zu Mahngebühren als Rechtslage: das OR nennt keine; die App fragt nach der
// Grundlage, statt sie zu behaupten oder abzustreiten. Orientierung, keine Rechtsberatung.

// Verzugszins-Rechner (27.09.2026) — Annäherung, 365 und 360 Tage nebeneinander, weil das
// Gesetz die Tageszählung nicht festlegt. Nichts wird gespeichert.
const ZinsRechner = ({ palette, t }) => {
  const s = ablaufStyles(palette);
  const [betrag, setBetrag] = useState('');
  const [seit, setSeit] = useState('');
  const [satz, setSatz] = useState(String(SATZ_GESETZ));
  const r = verzugszins({ betrag: leseBetrag(betrag), satz, seit });
  const status = zinsEingabeStatus({ betrag: leseBetrag(betrag), satz, seit });
  const feld = { padding: '10px 12px', borderRadius: radius.sm, border: '1px solid ' + palette.border, background: palette.up, color: palette.text, fontSize: text.sm, fontFamily: 'inherit', boxSizing: 'border-box', width: '100%', maxWidth: '220px' };
  const label = { fontSize: text.sm, color: palette.mid, display: 'block', margin: space.sm + 'px 0 ' + space.xs + 'px' };
  const hilfe = { fontSize: text.xs, color: palette.mid, margin: space.xs + 'px 0 0' };
  const eingabe = (id, lbl, value, set, type, extra) => [
    React.createElement('label', { key: id + 'l', htmlFor: id, style: label }, lbl),
    React.createElement('input', { key: id, id, type, value, onChange: (e) => set(e.target.value), style: feld, ...extra }),
  ];
  return React.createElement('div', { style: { marginTop: space.md + 'px', padding: space.md + 'px', border: '1px solid ' + palette.border, borderRadius: radius.sm } },
    React.createElement('div', { style: { fontSize: text.body, color: palette.text, fontWeight: weight.semi } }, t('mahnung.zins.title')),
    ...eingabe('mahnung-zins-betrag', t('mahnung.zins.betrag'), betrag, setBetrag, 'text', { inputMode: 'decimal', autoComplete: 'off' }),
    ...eingabe('mahnung-zins-seit', t('mahnung.zins.seit'), seit, setSeit, 'date'),
    React.createElement('p', { style: hilfe }, t('mahnung.zins.seitHilfe')),
    ...eingabe('mahnung-zins-satz', t('mahnung.zins.satz'), satz, setSatz, 'text', { inputMode: 'decimal', autoComplete: 'off', 'aria-describedby': 'mahnung-zins-satz-hilfe' }),
    React.createElement('p', { id: 'mahnung-zins-satz-hilfe', style: hilfe }, t('mahnung.zins.satzHilfe')),
    React.createElement('p', { role: 'status', 'aria-live': 'polite', style: { ...s.stepText, marginTop: space.sm + 'px', color: palette.text } },
      r ? t('mahnung.zins.ergebnis', { tage: String(r.tage), satz: zahl(r.satz, { hoechstens: 3 }), z365: zahl(r.zins365, { stellen: 2 }), z360: zahl(r.zins360, { stellen: 2 }) }) : t(status === 'satz' ? 'mahnung.zins.satzUngueltig' : status === 'zukunft' ? 'mahnung.zins.nochNicht' : 'mahnung.zins.ohne'))
  );
};

export const MahnungErhalten = ({ palette, t, onNavigate }) => {
  const s = ablaufStyles(palette);
  const brief = (template) => () => onNavigate('briefe', undefined, { template });
  return React.createElement(AblaufContainer, {
    palette, icon: 'money',
    title: t('mahnung.title'),
    intro: t('mahnung.intro'),
  },
    // Schritt 1 — Einordnen: Verzug ja, Betreibung nein (OR 102, SchKG 38 Abs. 2)
    React.createElement(AblaufStep, { palette, title: t('mahnung.step1Title') },
      React.createElement('p', { style: s.stepText }, t('mahnung.step1Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('mahnung.step1LinkBetreibung'), onClick: () => onNavigate('betreibung') })
    ),

    // Schritt 2 — Stimmt die Forderung? Inkl. Verjährung und die Falle «Anzahlung = Anerkennung»
    React.createElement(AblaufStep, { palette, title: t('mahnung.step2Title') },
      React.createElement('p', { style: s.stepText }, t('mahnung.step2Text')),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('mahnung.step2Verjaehrung')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('briefe.ablaufLink.claimDispute'), onClick: brief('claimDispute') })
    ),

    // Schritt 3 — Was dazukommen darf (Verzugszins 5 %, kein Zinseszins, Gebühren nur mit Grundlage)
    React.createElement(AblaufStep, { palette, title: t('mahnung.step3Title') },
      React.createElement('p', { style: s.stepText }, t('mahnung.step3Text')),
      React.createElement(ZinsRechner, { palette, t }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('mahnung.step3LinkSchulden'), onClick: () => onNavigate('schulden') })
    ),

    // Schritt 4 — Sonderfälle mit festen Regeln: Miete (OR 257d, Kündigungsandrohung),
    // Krankenkasse (KVG 64a, KVV 105a/105b) + IPV, direkte Bundessteuer (DBG 163–167)
    React.createElement(AblaufStep, { palette, title: t('mahnung.step4Title') },
      React.createElement('p', { style: s.stepText }, t('mahnung.step4Miete')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('mahnung.step4LinkWohnung'), onClick: () => onNavigate('wohnunggekuendigt') }),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('mahnung.step4Kk')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('mahnung.step4LinkIpv'), onClick: () => onNavigate('premium') }),
      // Bussen und Geldstrafen (27.09.2026): StGB 35, 36, 79a, 106.
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('mahnung.step4Bussen')),
      // Steuern (27.09.2026): DBG 163/164/166/167 — Erlass nur VOR dem Zahlungsbefehl (167 Abs. 4).
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('mahnung.step4Steuer')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('mahnung.step4LinkSteuer'), onClick: () => onNavigate('tax') })
    ),

    // Schritt 5 — Nicht auf einmal zahlen können: Raten, Budget, Beratung
    React.createElement(AblaufStep, { palette, title: t('mahnung.step5Title') },
      React.createElement('p', { style: s.stepText }, t('mahnung.step5Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('briefe.ablaufLink.installmentRequest'), onClick: brief('installmentRequest') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('mahnung.step5LinkBudget'), onClick: () => onNavigate('budget') }),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('mahnung.step5LinkBeratung'), onClick: () => onNavigate('direktlinks') })
    ),

    // Schritt 6 — Umgekehrt: selbst mahnen (OR 102 Abs. 1, 104 Abs. 1)
    React.createElement(AblaufStep, { palette, title: t('mahnung.step6Title') },
      React.createElement('p', { style: s.stepText }, t('mahnung.step6Text')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('briefe.ablaufLink.paymentReminder'), onClick: brief('paymentReminder') })
    ),

    React.createElement(AblaufFooter, { palette, t, quelle: t('mahnung.quelle'), notes: [t('mahnung.footerNote'), t('trust.localOnly')] })
  );
};

export default MahnungErhalten;

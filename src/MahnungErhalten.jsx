import React from 'react';
import { AblaufContainer, AblaufStep, AblaufLink, AblaufFooter, ablaufStyles } from './AblaufSchale.jsx';

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
      onNavigate && React.createElement(AblaufLink, { palette, label: t('mahnung.step3LinkSchulden'), onClick: () => onNavigate('schulden') })
    ),

    // Schritt 4 — Zwei Sonderfälle mit festen Regeln: Miete (OR 257d, Kündigungsandrohung)
    // und Krankenkasse (KVG 64a, KVV 105a/105b) + IPV
    React.createElement(AblaufStep, { palette, title: t('mahnung.step4Title') },
      React.createElement('p', { style: s.stepText }, t('mahnung.step4Miete')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('mahnung.step4LinkWohnung'), onClick: () => onNavigate('wohnunggekuendigt') }),
      React.createElement('p', { style: { ...s.stepText, marginTop: '8px' } }, t('mahnung.step4Kk')),
      onNavigate && React.createElement(AblaufLink, { palette, label: t('mahnung.step4LinkIpv'), onClick: () => onNavigate('premium') })
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

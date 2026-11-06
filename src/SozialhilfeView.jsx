import React, { useState } from 'react';
import { calculateSozialhilfe, checkELEligibility, getCantonName, getHouseholdInfo, SKOS_GRUNDBEDARF } from './config/cantonalData.js';
import { rueckerstattungsFreibetrag } from './data/sozialhilfeRechner.js';
import { SozialhilfeRechner } from './SozialhilfeRechner.jsx';
import { OfficialLinkBox } from './OfficialLinkBox.jsx';
import { ErklaerseiteLink } from './components/ErklaerseiteLink.jsx';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { text, weight, leading, space, radius } from './config/tokens.js';
import { useVorlesenContext } from './hooks/vorlesenContext.js';
import { VorlesenButton } from './components/VorlesenButton.jsx';
import { GlossarText } from './GlossarBegriff.jsx';
import { betrag } from './utils/geld.js';
import { linkStil } from './components/PrimaryButton.jsx';
import { ansichtName } from './config/ansichtenRegister.js';

export const SozialhilfeView = ({ palette, t, data, onNavigate }) => {
  const vorlesen = useVorlesenContext();
  const canton = data.basis?.canton || '';
  const sozialhilfe = calculateSozialhilfe(data);
  const el = checkELEligibility(data);
  // Rückerstattungs-Rechner (Orientierung): eigener, höherer Freibetrag als beim
  // laufenden Bezug (30/50/+15). Haushalt aus dem Profil vorbelegt. Erbschafts-
  // Betrag frei eingebbar — reine Was-wäre-wenn-Einschätzung, keine Rechnung an
  // calculateSozialhilfe (Leitplanke).
  const hh = getHouseholdInfo(data);
  const minorChildren = hh.children.filter(c => (Number(c.age) || 0) < 18).length;
  const rueckFreibetrag = rueckerstattungsFreibetrag(hh.adults, minorChildren);
  const [erbschaft, setErbschaft] = useState('');
  const residenceType = data.wohnen?.residenceType || 'hauptwohnsitz';
  // Das Feld speichert `weekly` (constants.js); verglichen wurde mit 'wochenaufenthalt' — der Hinweis erschien
  // nie (Fachprüfung 25.10.2026). Beide Schreibweisen.
  const residenceKey = ['weekly', 'wochenaufenthalt'].includes(residenceType) ? 'wochenaufenthalt' : ['secondary', 'nebenwohnsitz'].includes(residenceType) ? 'nebenwohnsitz' : 'hauptwohnsitz';

  const formatCHF = (n) => betrag(n || 0);

  // Inline-Präfix-Icon vor Fliesstext-Titeln (statt roher Glyphe ◰/□): sitzt in der
  // Textzeile, Farbe erbt vom Elternelement, `aria-hidden` über `Icon`.
  const praefix = (name, size) => React.createElement(Icon, { name, size, style: { verticalAlign: '-3px', marginRight: '8px' } });

  // Rechner-Form X (F7-A2, 27.10.2026): die Seite IST der Rechner. Kopf, Ergebnis und Angaben kommen aus
  // SozialhilfeRechner (RechnerForm); die Rückerstattung und die Hinweise stehen darunter (`weiteres`),
  // «Nächste Schritte» als «was zu tun ist», die Stelle als Zeilen. Eine Rechnung, die den Eingaben folgt (F8-S2).
  const satz = React.createElement(React.Fragment, null, t('sozialhilfe.intro'), vorlesen?.enabled && React.createElement(VorlesenButton, { text: t('sozialhilfe.intro'), speak: vorlesen.speak, color: palette.mid, label: t('vorlesen.label') }));
  const stelle = React.createElement(OfficialLinkBox, { palette, t, data, ids: 'sozialhilfe', cantonalKey: 'sozialdienst', alsZeilen: true });
  const wege = React.createElement(React.Fragment, null,
    // D1 (06.11.2026): zur öffentlichen Erklärseite «Sozialhilfe in der Schweiz».
    React.createElement(ErklaerseiteLink, { palette, t, view: 'sozialhilfe' }),
    onNavigate && React.createElement('button', {
      onClick: () => onNavigate('finanzuebersicht'),
      style: { ...linkStil(palette), fontSize: text.sm, fontWeight: weight.medium, marginTop: space.md }
    }, t('nav.finanzUebersicht')),

    // Mietzinsbeiträge können ein Anspruch VOR/neben der Sozialhilfe sein — ruhig dorthin verweisen.
    onNavigate && React.createElement('button', {
      onClick: () => onNavigate('mietzins'),
      style: { ...linkStil(palette), display: 'block', fontSize: text.sm, fontWeight: weight.medium, marginTop: space.sm + 'px' }
    }, t('nav.mietzins')),
    // Fassung 9 (F9-D3): Querverweis in beide Richtungen, Name aus dem Register (alle Sprachen).
    onNavigate && React.createElement('button', {
      onClick: () => onNavigate('stelleverloren'),
      style: { ...linkStil(palette), display: 'block', fontSize: text.sm, fontWeight: weight.medium, marginTop: space.sm + 'px' }
    }, t(ansichtName('stelleverloren')))
  );
  const rechner = (extra) => React.createElement(SozialhilfeRechner, { palette, t, data, onNavigate, titel: t('sozialhilfe.title'), satz, stelle, mitPegel: true, ...extra });

  // Ohne Kanton: der Rechner rechnet trotzdem (SKOS-Grundbedarf je Haushalt); der Hinweis steht darunter.
  if (!canton) {
    return rechner({ weiteres: React.createElement(React.Fragment, null,
        React.createElement('div', { style: { padding: space.md + 'px 0', fontSize: text.sm, color: palette.mid } },
          hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('sozialhilfe.enterCanton'))
        ),
      wege) });
  }

  return rechner({
    // Der EL-Schritt hängt nicht am Sozialhilfe-Ergebnis: Rentnerinnen und Rentner brauchen ihn auch bei einem Nein.
    tun: (ergebnis, sozialdienst) => (sozialdienst || el.elPruefen) ? ({ titel: t('sozialhilfe.nextSteps'), inhalt: React.createElement('ul', { style: { fontSize: text.xs, paddingLeft: '24px', margin: 0, color: palette.mid, lineHeight: leading.relaxed } },
        sozialdienst && React.createElement('li', { style: { marginBottom: space.xs } }, t('sozialhilfe.step1')),
        sozialdienst && React.createElement('li', { style: { marginBottom: space.xs } }, t('sozialhilfe.step2')),
        sozialdienst && React.createElement('li', { style: { marginBottom: space.xs } }, t('sozialhilfe.step3')),
        ergebnis?.hatAnspruch && React.createElement('li', { style: { marginBottom: space.xs } }, t('sozialhilfe.step4')),
        el.elPruefen && React.createElement('li', { style: { marginBottom: space.xs } }, t('sozialhilfe.step5'))
      ) }) : undefined,
    weiteres: React.createElement('div', { style: { paddingTop: space.lg } },
    sozialhilfe.ivUnklar3a && React.createElement('p', { style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed, margin: '0 0 ' + space.lg + 'px' } }, t('sh.ivUnklar3a')),
    // Canton
    React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.lg, marginBottom: space.lg, fontSize: text.sm } },
      React.createElement('div', { style: { fontWeight: weight.semi } }, hinweisZeichen(), t('premium.canton', { name: getCantonName(canton, t) || t('premium.cantonUnknown') })),
    ),

    // Wochenaufenthalt / Nebenwohnsitz (Fachprüfung 25.10.2026): zuständig ist in der Regel der Hauptwohnsitz,
    // in der Notlage auch der Aufenthaltsort. Beim Wochenaufenthalt zusätzlich die Steuern (mit Vorbehalt) und
    // die Miete — sie gehört womöglich zum Zimmer am Wochenaufenthaltsort. Beim Nebenwohnsitz kein Steuersatz:
    // oft eine eigene Ferienwohnung, die dort besteuert wird, wo sie liegt (StHG Art. 4 Abs. 1).
    residenceKey !== 'hauptwohnsitz' && React.createElement('div', { 'data-teil': 'wohnsitz-hinweis', style: { padding: '12px', background: palette.sky + '18', borderRadius: radius.md, border: '1px solid ' + palette.sky, marginBottom: space.md, fontSize: text.sm } },
      React.createElement('div', { style: { fontWeight: weight.semi, color: palette.skyDeep, marginBottom: space.xs } }, hinweisZeichen(), t(residenceKey === 'wochenaufenthalt' ? 'sozialhilfe.weeklyResidence' : 'sozialhilfe.nebenResidence')),
      React.createElement('div', null, t('sozialhilfe.weeklyNote')),
      residenceKey === 'wochenaufenthalt' && React.createElement('div', null, t('sozialhilfe.weeklyMiete')),
      residenceKey === 'wochenaufenthalt' && React.createElement('div', null, t('residence.taxNote'))
    ),

    // Repayment info
    React.createElement('details', { style: { marginBottom: space.md } },
      React.createElement('summary', { style: { cursor: 'pointer', fontSize: text.sm, fontWeight: weight.semi, color: palette.mid, padding: '8px 0' } }, hinweisZeichen(), t('sozialhilfe.repaymentTitle')),
      React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.lg, fontSize: text.sm, color: palette.text, lineHeight: leading.relaxed } },
        React.createElement('p', { style: { marginBottom: space.sm } }, t('sozialhilfe.repaymentText')),
        React.createElement('p', { style: { marginBottom: space.sm } }, t('sozialhilfe.repaymentInheritance')),
        React.createElement('p', { style: { marginBottom: space.sm, color: palette.mid } }, t('sozialhilfe.repaymentFreibetrag')),
        React.createElement('p', { style: { marginBottom: space.sm, color: palette.mid } }, t('sozialhilfe.repaymentVaries')),
        React.createElement('p', { style: { fontWeight: weight.medium, marginBottom: space.md } }, t('sozialhilfe.repaymentAdvice')),

        // Leichter Orientierungs-Rechner — Was-wäre-wenn bei Vermögensanfall.
        React.createElement('div', { style: { paddingTop: space.md, borderTop: '1px solid ' + palette.border } },
          React.createElement('div', { style: { fontWeight: weight.semi, marginBottom: space.xs } }, praefix('document', 16), t('sozialhilfe.repaymentRechnerTitle')),
          React.createElement('div', { style: { color: palette.mid, marginBottom: space.sm } }, t('sozialhilfe.repaymentRechnerIntro')),
          React.createElement('label', { htmlFor: 'sh-erbschaft', style: { display: 'block', fontSize: text.xs, color: palette.mid, marginBottom: space.xs } }, t('sozialhilfe.repaymentAnfallLabel')),
          React.createElement('input', {
            id: 'sh-erbschaft',
            type: 'number', inputMode: 'numeric', min: '0', value: erbschaft,
            onChange: (e) => setErbschaft(e.target.value),
            placeholder: '0',
            style: { width: '160px', padding: '8px 12px', minHeight: '44px', fontSize: text.sm, border: '1px solid ' + palette.border, borderRadius: radius.md, background: palette.surface, color: palette.text, fontFamily: 'inherit', boxSizing: 'border-box' },
          }),
          (Number(erbschaft) || 0) > 0 && React.createElement('div', {
            style: { marginTop: space.sm, padding: space.sm + 'px ' + space.md + 'px', background: palette.surface, borderRadius: radius.md, border: '1px solid ' + palette.border, borderLeft: '3px solid ' + palette.sky, lineHeight: leading.relaxed },
          },
            Math.max(0, (Number(erbschaft) || 0) - rueckFreibetrag) > 0
              ? t('sozialhilfe.repaymentRechnerOver', { ueber: formatCHF(Math.max(0, (Number(erbschaft) || 0) - rueckFreibetrag)), freibetrag: formatCHF(rueckFreibetrag) })
              : t('sozialhilfe.repaymentRechnerUnder', { freibetrag: formatCHF(rueckFreibetrag) })
          ),
          React.createElement('div', { style: { fontSize: text.xs, color: palette.mid, marginTop: space.sm, lineHeight: leading.relaxed } }, t('sozialhilfe.repaymentRechnerHint'))
        )
      )
    ),

    // F7-R2 (31.10.2026): IPV und EL je eine Zeile, die Antwort steht in «Was steht mir zu?». Vorher rechnete diese
    // Seite beide selbst, dieselben Themen wie dort.
    onNavigate && React.createElement('div', { 'data-teil': 'auch-pruefen', style: { marginBottom: space.md } },
      [['ipv', t('sozialhilfe.ipvSection')], ['el', t('sozialhilfe.elSection')]].map(([key, titel]) => React.createElement('button', {
        key, type: 'button', className: 'mp-link', onClick: () => onNavigate('ansprueche'),
        style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: space.sm + 'px', width: '100%', minHeight: '44px', textAlign: 'left', background: 'none', border: 'none', borderBottom: '1px solid ' + palette.border, cursor: 'pointer', fontFamily: 'inherit', fontSize: text.sm, color: palette.text },
      },
        React.createElement('span', { style: { minWidth: 0 } }, titel),
        React.createElement('span', { style: { color: palette.sandDeep, whiteSpace: 'nowrap' } }, t('dashboard.anspruchTitle') + ' ›')))),

    // Orientation note — visually distinct so users don't overlook it
    React.createElement('div', { style: { fontSize: text.sm, color: palette.text, lineHeight: leading.relaxed, marginBottom: space.md, padding: space.md + 'px', background: palette.sky + '18', borderRadius: radius.lg + 'px', borderLeft: '3px solid ' + palette.sky } },
      hinweisZeichen(), React.createElement(GlossarText, { palette, t }, t('sozialhilfe.orientationNote'))
    ),

    // Children context (only when children present)
    sozialhilfe.childrenCount > 0 && React.createElement('div', { style: { padding: space.md, background: palette.up, borderRadius: radius.lg, marginBottom: space.md, fontSize: text.xs, color: palette.mid, lineHeight: leading.relaxed } },
      React.createElement('div', { style: { marginBottom: space.xs } }, praefix('kaestchen', 14), t('sozialhilfe.childrenNote')),
      sozialhilfe.children.some(c => c.age >= 16) &&
        React.createElement('div', { style: { marginTop: space.xs } }, praefix('kaestchen', 14), t('sozialhilfe.childrenEducationNote'))
    ),

    // SKOS table
    React.createElement('details', { style: { marginBottom: space.md } },
      React.createElement('summary', { style: { cursor: 'pointer', fontSize: text.sm, fontWeight: weight.semi, color: palette.mid, padding: '8px 0' } }, praefix('document', 16), t('sozialhilfe.skosTable')),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: space.sm, marginTop: space.sm } },
        Object.entries(SKOS_GRUNDBEDARF).map(([size, amount]) =>
          React.createElement('div', {
            key: size,
            style: {
              padding: space.sm,
              background: Number(size) === sozialhilfe.householdSize ? palette.gold + '22' : palette.up,
              borderRadius: radius.xs,
              border: '1px solid ' + (Number(size) === sozialhilfe.householdSize ? palette.gold : palette.border),
              fontSize: text.sm,
              textAlign: 'center'
            }
          },
            React.createElement('div', { style: { fontWeight: weight.semi } }, Number(size) === 1 ? t('common.person', { count: size }) : t('common.persons', { count: size })),
            React.createElement('div', { style: { color: palette.mid } }, formatCHF(amount))
          )
        )
      )
    ),
    React.createElement('div', { style: { fontSize: text.sm, color: palette.mid, marginTop: '12px' } }, hinweisZeichen(), t('trust.localOnly')),
      wege
    ),
  });
};

export default SozialhilfeView;

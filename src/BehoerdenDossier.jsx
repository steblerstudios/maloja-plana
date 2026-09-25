import React, { useState } from 'react';
import { PageTitle } from './components/Heading.jsx';
import { ExportVorschau } from './components/ExportVorschau.jsx';
import { Icon, hinweisZeichen } from './IconSystem.jsx';
import { getBehoerdenDossierPreview, generateBehoerdenDossier, generateBehoerdenJSON } from './dossierGenerator.js';
import { calculateSozialhilfe, calculateIPV, checkELEligibility } from './config/cantonalData.js';
import { steuernFuerProfil, steuerEingabenAusDaten, KANTONAL_DATA_VERSION } from './data/kantonaleSteuerdaten.js';
import { text, weight, radius, leading, space } from './config/tokens.js';
import { openPrintWindow, inDays } from './utils/helpers.js';
import { Brotkrume } from './components/Brotkrume.jsx';

export const BehoerdenDossier = ({ palette, t, data, chapters, onNavigate }) => {
  // Export-Vorschau (K3): null | 'druck' | 'json' — erst zeigen, was rausgeht, dann erstellen.
  const [vorschau, setVorschau] = useState(null);

  const sozialhilfe = calculateSozialhilfe(data);
  const ipv = calculateIPV(data);
  const el = checkELEligibility(data);

  const income = parseFloat((data.finanzen || {}).monthlyIncome) || 0;
  // E38/E39: dieselben Eingaben und dieselbe Regel wie Steuerrechner und Finanzübersicht —
  // Steuerkanton (K33), Kinder aus dem Haushalt, Elterntarif nur mit Bestätigung, und EIN
  // steuerbares Einkommen (Standardabzüge der ESTV) für Bund und Kanton.
  const eingaben = steuerEingabenAusDaten(data);
  const canton = eingaben.kanton;
  const steuern = income > 0 ? steuernFuerProfil(eingaben) : null;
  const taxResult = steuern ? steuern.bund : null;
  const kantonal = steuern ? steuern.kanton.kantonal : null;

  const calculations = {
    sozialhilfe,
    ipv,
    el,
    tax: taxResult ? {
      total: taxResult.steuer,
      taxableIncome: taxResult.steuerBaresEinkommen,
      // 'estv' = geschätzt nach den Standardabzügen der ESTV, 'direkt' = selbst eingetragen
      taxableQuelle: steuern.quelle,
      kantonal,
      // R4: Annahmen der Schätzung (13. Monatslohn offen, Alleinverdiener-Ehepaar)
      annahmen: steuern.annahmen,
      // Für die Zeile «keine Schätzung» im Dossier: Kanton gewählt, Tabelle trägt nicht.
      kantonOhneZahl: Boolean(canton) && !kantonal,
      datenstand: KANTONAL_DATA_VERSION,
    } : null,
  };

  const preview = getBehoerdenDossierPreview(data, chapters, t, calculations);
  const hasSections = preview.sections.length > 0;

  const handlePrint = () => {
    const html = generateBehoerdenDossier(data, chapters, t, calculations);
    openPrintWindow(html);
  };

  const handleExportJSON = () => {
    const dossier = generateBehoerdenJSON(data, calculations, t);
    const json = JSON.stringify(dossier, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const name = (data.basis?.lastName || 'dossier').toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.download = 'dossier_' + name + '_' + inDays(0) + '.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderSection = (section) =>
    React.createElement('div', {
      key: section.key,
      style: {
        padding: '14px 16px',
        background: palette.up,
        borderRadius: radius.sm,
        marginBottom: space.sm,
      }
    },
      React.createElement('div', {
        style: {
          fontSize: text.sm, fontWeight: weight.semi, color: palette.text,
          marginBottom: space.sm, letterSpacing: '0.2px',
        }
      }, section.title),
      section.status && React.createElement('div', {
        style: {
          fontSize: text.sm, fontWeight: weight.semi,
          // NICHT section.statusColor: das ist eine DRUCK-Farbe aus dossierGenerator.js,
          // gebaut fürs weisse Blatt und deshalb unabhängig vom Thema. Am Bildschirm
          // gemessen: im Hellmodus 4.86:1 (knapp gut), im DUNKELMODUS 2.2:1 — #6B6560
          // auf #343330, weit unter AA. Der Abschnitt trägt jetzt `statusOk` als
          // Bedeutung; die Farbe wählt jedes Medium selbst. Der Druck benutzt weiterhin
          // statusColor (dossierGenerator.js, Zeile mit `bd-status`).
          color: section.statusOk ? (palette.sageDeep || palette.sage) : palette.mid,
          marginBottom: section.rows.length > 0 ? space.sm : 0,
        }
      }, section.status),
      ...section.rows.map((row, i) =>
        React.createElement('div', {
          key: i,
          style: {
            display: 'flex', justifyContent: 'space-between',
            padding: '3px 0', fontSize: text.sm,
            borderBottom: i < section.rows.length - 1 ? '1px solid ' + palette.border : 'none',
          }
        },
          React.createElement('span', { style: { color: palette.mid } }, row.label),
          React.createElement('span', {
            style: {
              fontWeight: row.bold ? weight.semi : weight.medium,
              textAlign: 'right', maxWidth: '50%',
            }
          }, row.value)
        )
      )
    );

  const renderEmpty = () =>
    React.createElement('div', {
      style: {
        padding: '32px 20px', textAlign: 'center',
        background: palette.up, borderRadius: radius.sm,
        border: '1px solid ' + palette.border,
      }
    },
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid, lineHeight: '1.6' }
      }, t('behoerdenDossier.empty'))
    );

  return React.createElement('div', { style: { maxWidth: '520px' } },

    // Ein Weg zurück: die Brotkrume (Entscheid 25.09.2026) statt eines eigenen Zurück-Knopfs.
    React.createElement(Brotkrume, { palette, t, view: 'behoerdendossier', onNavigate }),
    React.createElement('div', {
      style: {
        background: palette.surface, padding: '24px 20px', borderRadius: radius.sm,
        border: '1px solid ' + palette.border, marginBottom: '20px',
      }
    },
      React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'legal', size: 22 }), style: { marginBottom: space.md + 'px' } }, t('behoerdenDossier.title')),
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal }
      }, t('behoerdenDossier.subtitle'))
    ),

    hasSections && React.createElement('div', { style: { display: 'flex', gap: space.sm, marginBottom: vorschau ? 0 : '20px' } },
      React.createElement('button', {
        onClick: () => setVorschau('druck'),
        style: {
          flex: 1, padding: '12px',
          background: palette.sand, color: palette.onSand, border: 'none',
          borderRadius: radius.sm, cursor: 'pointer',
          fontSize: text.sm, fontWeight: weight.medium, fontFamily: 'inherit',
          letterSpacing: '0.2px',
        }
      }, t('behoerdenDossier.printAction')),
      React.createElement('button', {
        onClick: () => setVorschau('json'),
        style: {
          flex: 1, padding: '12px',
          background: palette.sageBtn, color: '#fff', border: 'none',
          borderRadius: radius.sm, cursor: 'pointer',
          fontSize: text.sm, fontWeight: weight.medium, fontFamily: 'inherit',
          letterSpacing: '0.2px',
        }
      }, t('behoerdenDossier.exportJSON'))
    ),
    hasSections && vorschau && React.createElement('div', { style: { marginBottom: '20px' } },
      React.createElement(ExportVorschau, {
        palette, t,
        art: vorschau === 'json' ? 'dossierJson' : 'dossier',
        quelle: vorschau === 'json'
          ? { dossier: generateBehoerdenJSON(data, calculations, t) }
          : { abschnitte: preview.sections.map(s => ({ titel: s.title, felder: s.rows.map(r => r.label) })) },
        onWeiter: () => { const art = vorschau; setVorschau(null); if (art === 'json') handleExportJSON(); else handlePrint(); },
        onZurueck: () => setVorschau(null),
      })
    ),

    hasSections && React.createElement('div', {
      style: { fontSize: text.sm, color: palette.soft, marginBottom: '12px' }
    }, t('behoerdenDossier.previewNote')),

    hasSections
      ? preview.sections.map(renderSection)
      : renderEmpty(),

    React.createElement('div', {
      style: {
        marginTop: space.md, fontSize: text.xs, color: palette.soft, lineHeight: '1.4',
      }
    }, hinweisZeichen(), t('behoerdenDossier.footerPrivacy'))
  );
};

export default BehoerdenDossier;

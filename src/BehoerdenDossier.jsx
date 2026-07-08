import React from 'react';
import { PageTitle } from './components/Heading.jsx';
import { Icon } from './IconSystem.jsx';
import { getBehoerdenDossierPreview, generateBehoerdenDossier, generateBehoerdenJSON } from './dossierGenerator.js';
import { calculateSozialhilfe, calculateIPV, checkELEligibility } from './config/cantonalData.js';
import { berechneBundessteuer } from './data/steuerRechner.js';
import { schaetzeKantonaleSteuer } from './data/kantonaleSteuerdaten.js';
import { text, weight, radius, leading, space } from './config/tokens.js';
import { openPrintWindow } from './utils/helpers.js';

export const BehoerdenDossier = ({ palette, t, data, chapters, onNavigate }) => {

  const sozialhilfe = calculateSozialhilfe(data);
  const ipv = calculateIPV(data);
  const el = checkELEligibility(data);

  const income = parseFloat((data.finanzen || {}).monthlyIncome) || 0;
  const canton = (data.basis || {}).canton || '';
  const taxResult = income > 0
    ? berechneBundessteuer({ bruttoEinkommen: income * 12, verheiratet: (data.basis || {}).maritalStatus === 'married', kinder: 0 })
    : null;
  const kantonal = taxResult && canton ? schaetzeKantonaleSteuer(taxResult.steuer, canton) : null;

  const calculations = {
    sozialhilfe,
    ipv,
    el,
    tax: taxResult ? {
      total: taxResult.steuer,
      taxableIncome: taxResult.steuerBaresEinkommen,
      kantonal,
    } : null,
  };

  const preview = getBehoerdenDossierPreview(data, chapters, t, calculations);
  const hasSections = preview.sections.length > 0;

  const handlePrint = () => {
    const html = generateBehoerdenDossier(data, chapters, t, calculations);
    openPrintWindow(html);
  };

  const handleExportJSON = () => {
    const dossier = generateBehoerdenJSON(data, calculations);
    const json = JSON.stringify(dossier, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const name = (data.basis?.lastName || 'dossier').toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.download = 'dossier_' + name + '_' + new Date().toISOString().slice(0, 10) + '.json';
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
          color: section.statusColor || palette.mid,
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

    React.createElement('button', {
      onClick: () => onNavigate('unterlagen'),
      style: {
        background: 'none', border: 'none', cursor: 'pointer',
        color: palette.mid, fontSize: text.sm, padding: '0 0 16px 0',
        fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: space.xs,
      }
    }, '← ' + t('lebensmappe.back')),

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

    hasSections && React.createElement('div', { style: { display: 'flex', gap: space.sm, marginBottom: '20px' } },
      React.createElement('button', {
        onClick: handlePrint,
        style: {
          flex: 1, padding: '12px',
          background: palette.sand, color: palette.onSand, border: 'none',
          borderRadius: radius.sm, cursor: 'pointer',
          fontSize: text.sm, fontWeight: weight.medium, fontFamily: 'inherit',
          letterSpacing: '0.2px',
        }
      }, t('behoerdenDossier.printAction')),
      React.createElement('button', {
        onClick: handleExportJSON,
        style: {
          flex: 1, padding: '12px',
          background: palette.sage, color: '#fff', border: 'none',
          borderRadius: radius.sm, cursor: 'pointer',
          fontSize: text.sm, fontWeight: weight.medium, fontFamily: 'inherit',
          letterSpacing: '0.2px',
        }
      }, t('behoerdenDossier.exportJSON'))
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
    }, 'ⓘ ' + t('behoerdenDossier.footerPrivacy'))
  );
};

export default BehoerdenDossier;

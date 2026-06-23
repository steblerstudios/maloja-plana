import React, { useState } from 'react';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius, leading } from './config/tokens.js';
import { KVG_KATALOG, KVG_CATEGORIES, FRANCHISE_STUFEN, berechneFranchise, berechneArztrechnung, TAXPUNKTWERT, KVG_DATA_VERSION } from './data/kvgLeistungen.js';

const STATUS_COLORS = (palette) => ({
  covered: palette.sage || '#5a7a5a',
  limited: palette.sand || '#c8a96e',
  excluded: palette.gold || '#c47a20',
});

const StatusBadge = ({ status, label, palette }) => {
  const colors = STATUS_COLORS(palette);
  return React.createElement('span', {
    style: {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: text.xs,
      fontWeight: weight.medium,
      background: (colors[status] || palette.mid) + '18',
      color: colors[status] || palette.mid,
      whiteSpace: 'nowrap',
    }
  }, label);
};

const TabButton = ({ active, label, onClick, palette }) =>
  React.createElement('button', {
    onClick,
    style: {
      padding: '8px 14px',
      background: active ? palette.sand : 'transparent',
      color: active ? '#000' : palette.mid,
      border: 'none',
      borderRadius: radius.sm,
      cursor: 'pointer',
      fontSize: text.sm,
      fontWeight: active ? weight.semi : weight.medium,
      fontFamily: 'inherit',
      whiteSpace: 'nowrap',
    }
  }, label);

const CatButton = ({ active, label, onClick, palette }) =>
  React.createElement('button', {
    onClick,
    style: {
      padding: '4px 10px',
      background: active ? palette.sand + '25' : 'transparent',
      color: active ? palette.sand : palette.soft,
      border: active ? '1px solid ' + palette.sand + '40' : '1px solid ' + palette.border,
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: text.xs,
      fontWeight: weight.medium,
      fontFamily: 'inherit',
      whiteSpace: 'nowrap',
    }
  }, label);

// ─── Katalog Tab ───────────────────────────────────────────
const KatalogTab = ({ palette, t, filterCat }) => {
  const items = filterCat === 'all'
    ? KVG_KATALOG
    : KVG_KATALOG.filter(i => i.cat === filterCat);

  return React.createElement('div', null,
    items.map(item =>
      React.createElement('div', {
        key: item.key,
        style: {
          padding: '12px 14px',
          background: palette.up,
          borderRadius: radius.sm,
          border: '1px solid ' + palette.border,
          marginBottom: '8px',
        }
      },
        React.createElement('div', {
          style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }
        },
          React.createElement('span', {
            style: { fontSize: text.sm, fontWeight: weight.semi }
          }, t('kvg.' + item.key)),
          React.createElement(StatusBadge, {
            status: item.status,
            label: t('kvg.' + item.status),
            palette,
          })
        ),
        React.createElement('div', {
          style: { fontSize: text.xs, color: palette.mid, lineHeight: leading.normal }
        }, t('kvg.' + item.key + 'Note')),
        item.intervalKey && React.createElement('div', {
          style: {
            fontSize: text.xs,
            color: palette.sand,
            marginTop: '4px',
            fontWeight: weight.medium,
          }
        }, 'ⓘ ' + t('kvg.' + item.intervalKey))
      )
    )
  );
};

// ─── Franchise Tab ─────────────────────────────────────────
const FranchiseTab = ({ palette, t, data }) => {
  const storedFranchise = (() => {
    const f = data.versicherungen?.franchise;
    if (!f) return 300;
    const n = Number(String(f).replace(/[^0-9]/g, ''));
    return FRANCHISE_STUFEN.includes(n) ? n : 300;
  })();

  const [franchise, setFranchise] = useState(storedFranchise);
  const [kosten, setKosten] = useState('');

  const result = berechneFranchise(franchise, Number(kosten) || 0);
  const hasInput = Number(kosten) > 0;

  const barStyle = (value, max, color) => ({
    height: '8px',
    background: palette.border,
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '4px',
  });

  const barFill = (value, max, color) => ({
    height: '100%',
    width: (max > 0 ? Math.min(100, (value / max) * 100) : 0) + '%',
    background: color,
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  });

  return React.createElement('div', null,
    React.createElement('div', {
      style: { padding: '14px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border, marginBottom: '16px' }
    },
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal, marginBottom: '12px' }
      }, t('kvg.franchiseExplain')),

      React.createElement('label', {
        style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: space.xs, fontWeight: weight.medium }
      }, t('kvg.franchiseLabel')),
      React.createElement('div', { style: { position: 'relative', marginBottom: '12px' } },
        React.createElement('select', {
          value: franchise,
          onChange: (e) => setFranchise(Number(e.target.value)),
          style: {
            width: '100%', padding: space.sm, borderRadius: radius.sm,
            border: '1px solid ' + palette.border, background: palette.surface,
            color: palette.text, fontSize: text.sm, fontFamily: 'inherit',
            appearance: 'none', WebkitAppearance: 'none', paddingRight: '36px',
            cursor: 'pointer',
          }
        },
          FRANCHISE_STUFEN.map(f =>
            React.createElement('option', { key: f, value: f }, 'CHF ' + f)
          )
        ),
        React.createElement('div', {
          style: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: palette.mid, fontSize: '10px' }
        }, '▾')
      ),

      React.createElement('label', {
        style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: space.xs, fontWeight: weight.medium }
      }, t('kvg.costsLabel')),
      React.createElement('input', {
        type: 'number',
        inputMode: 'decimal',
        value: kosten,
        onChange: (e) => setKosten(e.target.value),
        placeholder: '0',
        style: {
          width: '100%', padding: space.sm, borderRadius: radius.sm,
          border: '1px solid ' + palette.border, background: palette.surface,
          color: palette.text, fontSize: text.sm, boxSizing: 'border-box',
        }
      })
    ),

    hasInput && React.createElement('div', {
      style: { padding: '14px', background: palette.surface, borderRadius: radius.sm, border: '1px solid ' + palette.border }
    },
      React.createElement('div', { style: { marginBottom: '14px' } },
        React.createElement('div', {
          style: { display: 'flex', justifyContent: 'space-between', fontSize: text.sm, marginBottom: '4px' }
        },
          React.createElement('span', { style: { color: palette.mid } }, t('kvg.franchiseUsed')),
          React.createElement('span', { style: { fontWeight: weight.semi } }, 'CHF ' + result.franchiseVerbraucht)
        ),
        React.createElement('div', { style: barStyle() },
          React.createElement('div', { style: barFill(result.franchiseVerbraucht, result.franchise, palette.sand) })
        ),
        React.createElement('div', {
          style: { fontSize: text.xs, color: palette.soft }
        }, t('kvg.franchiseOpen') + ': CHF ' + result.franchiseOffen)
      ),

      React.createElement('div', { style: { marginBottom: '14px' } },
        React.createElement('div', {
          style: { display: 'flex', justifyContent: 'space-between', fontSize: text.sm, marginBottom: '4px' }
        },
          React.createElement('span', { style: { color: palette.mid } }, t('kvg.selbstbehalt')),
          React.createElement('span', { style: { fontWeight: weight.semi } }, 'CHF ' + Math.round(result.selbstbehalt))
        ),
        React.createElement('div', { style: barStyle() },
          React.createElement('div', { style: barFill(result.selbstbehalt, result.selbstbehaltMax, palette.sage || '#5a7a5a') })
        ),
        React.createElement('div', {
          style: { fontSize: text.xs, color: palette.soft }
        }, t('kvg.selbstbehaltMax') + ': CHF ' + result.selbstbehaltMax)
      ),

      result.selbstbehaltAusgeschoepft && React.createElement('div', {
        style: {
          padding: '10px 12px', background: (palette.sage || '#5a7a5a') + '15',
          borderRadius: radius.sm, border: '1px solid ' + (palette.sage || '#5a7a5a') + '30',
          fontSize: text.sm, color: palette.sage || '#5a7a5a', marginBottom: '14px',
        }
      }, '✓ ' + t('kvg.selbstbehaltDone')),

      React.createElement('div', {
        style: { height: '1px', background: palette.border, marginBottom: '14px' }
      }),

      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', fontSize: text.sm, marginBottom: '8px' }
      },
        React.createElement('span', { style: { color: palette.mid } }, t('kvg.eigenanteil')),
        React.createElement('span', {
          style: { fontWeight: weight.semi, color: palette.gold || '#c47a20' }
        }, 'CHF ' + Math.round(result.eigenanteil))
      ),
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', fontSize: text.sm }
      },
        React.createElement('span', { style: { color: palette.mid } }, t('kvg.kasseZahlt')),
        React.createElement('span', {
          style: { fontWeight: weight.semi, color: palette.sage || '#5a7a5a' }
        }, 'CHF ' + Math.round(result.kasseZahlt))
      )
    )
  );
};

// ─── Rechnung Tab ──────────────────────────────────────────
const RechnungTab = ({ palette, t, data }) => {
  const canton = data.basis?.canton || '';
  const [tp, setTp] = useState('');
  const [selCanton, setSelCanton] = useState(canton);

  const cantons = Object.keys(TAXPUNKTWERT).sort();
  const result = tp ? berechneArztrechnung(Number(tp), selCanton) : null;

  return React.createElement('div', null,
    React.createElement('div', {
      style: { padding: '14px', background: palette.up, borderRadius: radius.sm, border: '1px solid ' + palette.border, marginBottom: '16px' }
    },
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal, marginBottom: '12px' }
      }, t('kvg.rechnungExplain')),

      React.createElement('label', {
        style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: space.xs, fontWeight: weight.medium }
      }, t('kvg.taxpunkte')),
      React.createElement('input', {
        type: 'number',
        inputMode: 'decimal',
        value: tp,
        onChange: (e) => setTp(e.target.value),
        placeholder: '0',
        style: {
          width: '100%', padding: space.sm, borderRadius: radius.sm,
          border: '1px solid ' + palette.border, background: palette.surface,
          color: palette.text, fontSize: text.sm, boxSizing: 'border-box',
          marginBottom: '12px',
        }
      }),

      React.createElement('label', {
        style: { display: 'block', fontSize: text.sm, color: palette.mid, marginBottom: space.xs, fontWeight: weight.medium }
      }, t('finanzUebersicht.canton')),
      React.createElement('div', { style: { position: 'relative' } },
        React.createElement('select', {
          value: selCanton,
          onChange: (e) => setSelCanton(e.target.value),
          style: {
            width: '100%', padding: space.sm, borderRadius: radius.sm,
            border: '1px solid ' + palette.border, background: palette.surface,
            color: palette.text, fontSize: text.sm, fontFamily: 'inherit',
            appearance: 'none', WebkitAppearance: 'none', paddingRight: '36px',
            cursor: 'pointer',
          }
        },
          React.createElement('option', { value: '' }, t('common.select')),
          cantons.map(c => React.createElement('option', { key: c, value: c }, c + ' (' + TAXPUNKTWERT[c].toFixed(2) + ')'))
        ),
        React.createElement('div', {
          style: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: palette.mid, fontSize: '10px' }
        }, '▾')
      )
    ),

    result && React.createElement('div', {
      style: { padding: '14px', background: palette.sand + '10', borderRadius: radius.sm, border: '1px solid ' + palette.sand + '25' }
    },
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', fontSize: text.sm, marginBottom: '8px' }
      },
        React.createElement('span', { style: { color: palette.mid } }, t('kvg.taxpunkte')),
        React.createElement('span', { style: { fontWeight: weight.semi } }, result.taxpunkte)
      ),
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', fontSize: text.sm, marginBottom: '8px' }
      },
        React.createElement('span', { style: { color: palette.mid } }, t('kvg.taxpunktwert')),
        React.createElement('span', { style: { fontWeight: weight.semi } }, 'CHF ' + result.taxpunktwert.toFixed(2))
      ),
      React.createElement('div', {
        style: { height: '1px', background: palette.border, marginBottom: '8px' }
      }),
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'space-between', fontSize: text.body }
      },
        React.createElement('span', { style: { color: palette.mid, fontWeight: weight.medium } }, t('kvg.berechneterBetrag')),
        React.createElement('span', { style: { fontWeight: weight.semi, color: palette.sand } }, 'CHF ' + result.betrag.toFixed(2))
      ),
      React.createElement('div', {
        style: { fontSize: text.xs, color: palette.soft, marginTop: '6px' }
      }, 'ⓘ ' + t('kvg.tpwNote'))
    )
  );
};

// ─── Main Component ────────────────────────────────────────
export const KVGLeistungen = ({ palette, t, data }) => {
  const [tab, setTab] = useState('katalog');
  const [filterCat, setFilterCat] = useState('all');

  const catLabels = {
    all: t('kvg.allCategories'),
    arzt: t('kvg.catArzt'),
    vorsorge: t('kvg.catVorsorge'),
    labor: t('kvg.catLabor'),
    medi: t('kvg.catMedi'),
    spital: t('kvg.catSpital'),
    dental: t('kvg.catDental'),
    therapie: t('kvg.catTherapie'),
    divers: t('kvg.catDivers'),
  };

  return React.createElement('div', { style: { maxWidth: '580px' } },

    React.createElement('div', {
      style: {
        background: palette.surface, padding: '24px 20px', borderRadius: radius.sm,
        border: '1px solid ' + palette.border, marginBottom: '16px',
      }
    },
      React.createElement('h2', {
        style: {
          fontSize: text.lg, fontWeight: weight.semi, marginBottom: '6px',
          display: 'flex', alignItems: 'center', gap: space.sm,
        }
      }, React.createElement(Icon, { name: 'health', size: 18 }), t('kvg.title')),
      React.createElement('div', {
        style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.normal }
      }, t('kvg.subtitle'))
    ),

    React.createElement('div', {
      style: {
        display: 'flex', gap: '4px', background: palette.up, borderRadius: radius.sm,
        padding: '4px', marginBottom: '16px', overflowX: 'auto',
      }
    },
      React.createElement(TabButton, { active: tab === 'katalog', label: t('kvg.tabKatalog'), onClick: () => setTab('katalog'), palette }),
      React.createElement(TabButton, { active: tab === 'franchise', label: t('kvg.tabFranchise'), onClick: () => setTab('franchise'), palette }),
      React.createElement(TabButton, { active: tab === 'rechnung', label: t('kvg.tabRechnung'), onClick: () => setTab('rechnung'), palette })
    ),

    tab === 'katalog' && React.createElement(React.Fragment, null,
      React.createElement('div', {
        style: {
          display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px',
        }
      },
        React.createElement(CatButton, { active: filterCat === 'all', label: catLabels.all, onClick: () => setFilterCat('all'), palette }),
        KVG_CATEGORIES.map(cat =>
          React.createElement(CatButton, { key: cat, active: filterCat === cat, label: catLabels[cat], onClick: () => setFilterCat(cat), palette })
        )
      ),
      React.createElement(KatalogTab, { palette, t, filterCat })
    ),

    tab === 'franchise' && React.createElement(FranchiseTab, { palette, t, data }),
    tab === 'rechnung' && React.createElement(RechnungTab, { palette, t, data }),

    React.createElement('div', {
      style: { marginTop: '16px', padding: '12px', background: palette.up, borderRadius: radius.sm, fontSize: text.xs, color: palette.mid, lineHeight: leading.normal }
    },
      'ⓘ ' + t('kvg.disclaimer'),
      React.createElement('br'),
      'ⓘ ' + t('kvg.source') + ' · v' + KVG_DATA_VERSION
    )
  );
};

export default KVGLeistungen;

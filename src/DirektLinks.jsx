import React, { useState } from 'react';
import { PageTitle, PanelTitle } from './components/Heading.jsx';
import { DIREKTLINKS, KATEGORIEN, BERATUNG_HILFE, HEARTFELT, HEARTFELT_GROUPS, getAllKategorien, getLinksByKategorie, getCantonalLinks } from './data/direktLinks.js';
import { getCantonName } from './config/cantonalData.js';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius, ease } from './config/tokens.js';
import { renderSource } from './utils/renderSource.js';

// Jede Kategorie ist ein Buch, das im Regal steht (Buchrücken = Kategorie).
// Ein Klick klappt das Buch auf. Zwei Sonderbücher rechts: „Beratung & Hilfe"
// (gemeinnützige Anlaufstellen) und die persönlichen „Herzensempfehlungen" (24,
// gruppiert, geteilte Quelle mit LegalView). Ruhige Skeuomorphie: dünnes
// Regalbrett, flache Rücken, kleiner Farbstreifen.
const BUCH_TON = {
  gesundheit: 'rose',
  vorsorge: 'sage',
  soziales: 'sky',
  arbeit: 'gold',
  familie: 'sand',
  finanzen: 'sky',
  recht: 'soft',
};
const BERATUNG_TON = 'sage';
const HERZ_TON = 'gold';

export const DirektLinks = ({ palette, t, data }) => {
  const kategorien = getAllKategorien();
  const [offen, setOffen] = useState(null); // Kategorie-id oder 'herz' oder null
  const lang = t('dl.lang');
  const l = (obj) => obj[lang] || obj.de;

  const s = {
    card: { maxWidth: '720px', background: palette.surface, padding: space.lg + 'px', borderRadius: radius.md + 'px', border: '1px solid ' + palette.border },
    intro: { fontSize: text.sm, color: palette.mid, lineHeight: 1.55, margin: '0 0 ' + space.md + 'px' },
    shelfWrap: { overflowX: 'auto', paddingBottom: space.xs + 'px', marginBottom: space.md + 'px', WebkitOverflowScrolling: 'touch' },
    shelf: { display: 'inline-flex', gap: space.sm + 'px', alignItems: 'flex-end', minWidth: '100%', padding: '0 2px', borderBottom: '3px solid ' + palette.top },
    spine: (ton, active) => ({
      position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px',
      flex: '0 0 auto', width: '48px', minHeight: '76px', paddingTop: '11px', paddingBottom: space.sm + 'px',
      background: palette.up, border: '1px solid ' + (active ? palette[ton] : palette.border), borderBottom: 'none',
      borderTopLeftRadius: '3px', borderTopRightRadius: '3px', cursor: 'pointer', fontFamily: 'inherit',
      color: palette.text, // Dark-Mode: Icon erbt fill:currentColor — Button erbt color nicht zuverlässig
      transform: active ? 'translateY(-5px)' : 'none', transition: 'transform 140ms ' + ease.out,
      boxShadow: active ? '0 2px 10px ' + palette[ton] + '2E' : 'none',
    }),
    cap: (ton) => ({ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', background: palette[ton], borderTopLeftRadius: '3px', borderTopRightRadius: '3px' }),
    spineName: { writingMode: 'vertical-rl', textOrientation: 'mixed', fontSize: text.xs, fontWeight: weight.semi, color: palette.text, letterSpacing: '0.2px', whiteSpace: 'nowrap' },
    book: (ton) => ({ background: palette.up, border: '1px solid ' + palette.border, borderLeft: '4px solid ' + palette[ton], borderRadius: '0 ' + radius.sm + 'px ' + radius.sm + 'px 0', padding: space.md + 'px', marginBottom: space.md + 'px' }),
    bookHead: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', marginBottom: space.sm + 'px' },
    herzNote: { fontSize: text.xs, color: palette.mid, lineHeight: 1.55, margin: '0 0 ' + space.md + 'px', fontStyle: 'italic' },
    hfGroup: { fontWeight: weight.semi, fontSize: text.sm, color: palette.mid, margin: space.md + 'px 0 ' + space.xs + 'px' },
    hfRow: { fontSize: text.sm, color: palette.mid, lineHeight: 1.5, margin: '0 0 ' + space.sm + 'px' },
    hfLink: { color: palette.sage, textDecoration: 'none' },
    hfAff: { color: palette.soft, fontSize: text.xs },
    linkCard: { padding: space.md + 'px', background: palette.surface, borderRadius: radius.sm + 'px', marginBottom: space.sm + 'px', border: '1px solid ' + palette.border },
    linkName: { fontWeight: weight.semi, fontSize: text.sm, marginBottom: '2px', color: palette.text },
    linkDesc: { fontSize: text.xs, color: palette.mid, marginBottom: space.xs + 'px', lineHeight: 1.5 },
    linkUrl: { fontSize: text.xs, color: palette.sage, textDecoration: 'none', wordBreak: 'break-all' },
    linkStelle: { fontSize: text.xs, color: palette.mid, marginTop: space.xs + 'px' },
    empty: { fontSize: text.sm, color: palette.mid, textAlign: 'center', padding: space.lg + 'px' },
    canton: { padding: space.md + 'px', background: palette.sage + '11', borderRadius: radius.sm + 'px', marginBottom: space.md + 'px', border: '1px solid ' + palette.sage + '33' },
    cantonTitle: { fontWeight: weight.semi, fontSize: text.sm, marginBottom: space.sm + 'px', color: palette.sage },
    source: { marginTop: space.md + 'px', fontSize: text.xs, color: palette.sky },
  };

  // Ein einzelner Link als Karte (amtlich mit Antragsstelle, Herz ohne).
  const linkCard = (link, mitStelle) => React.createElement('div', { key: link.id, style: s.linkCard },
    React.createElement('div', { style: s.linkName }, l(link.name)),
    React.createElement('div', { style: s.linkDesc }, l(link.beschreibung)),
    React.createElement('a', { href: link.url, target: '_blank', rel: 'noopener noreferrer', style: s.linkUrl }, link.url),
    mitStelle && link.antragsstelle && React.createElement('div', { style: s.linkStelle }, t('dl.antragsstelle') + ': ' + l(link.antragsstelle))
  );

  // Ein Buchrücken im Regal.
  const spine = (id, ton, iconName, name) => {
    const active = offen === id;
    return React.createElement('button', {
      key: id, type: 'button', 'aria-pressed': active, 'aria-expanded': active, 'aria-controls': 'buch-panel',
      'aria-label': name, title: name, style: s.spine(ton, active),
      onClick: () => setOffen(active ? null : id),
    },
      React.createElement('span', { style: s.cap(ton), 'aria-hidden': 'true' }),
      React.createElement(Icon, { name: iconName, size: 17 }),
      React.createElement('span', { style: s.spineName }, name)
    );
  };

  // Eine Herzensempfehlungs-Zeile: „→ Name · Affiliate — Beschreibung". Beschreibung
  // aus i18n (legal.resources.<key>, geteilt mit LegalView); ohne url nur der Name
  // (bewusst kein Link). Übersetzt eine fehlende Beschreibung nicht → Eintrag entfällt.
  const hfRow = (item, desc) => React.createElement('p', { key: item.key, style: s.hfRow },
    '→ ',
    item.url
      ? React.createElement('a', { href: item.url, target: '_blank', rel: 'noopener noreferrer', style: s.hfLink }, item.name)
      : item.name,
    item.affiliate ? React.createElement('span', { style: s.hfAff }, ' · ' + t('legal.resources.affiliateMarker')) : null,
    ' — ' + desc
  );

  // Inhalt des aufgeschlagenen Buchs.
  const renderBuch = () => {
    if (!offen) return null;
    // Herzensempfehlungen: die echten 24, nach Themengruppen (geteilte Quelle + i18n
    // mit LegalView). Affiliate transparent, „kein Link" ehrlich.
    if (offen === 'herz') {
      const hasAff = HEARTFELT.some(i => i.affiliate);
      return React.createElement('div', { id: 'buch-panel', role: 'region', 'aria-label': t('dl.herzTitle'), style: s.book(HERZ_TON) },
        React.createElement('div', { style: s.bookHead },
          React.createElement(Icon, { name: 'heart', size: 20 }),
          React.createElement(PanelTitle, { palette, style: { margin: 0 } }, t('dl.herzTitle'))
        ),
        React.createElement('p', { style: s.herzNote }, t(hasAff ? 'legal.resources.heartfeltIntroAffiliate' : 'legal.resources.heartfeltIntro')),
        ...HEARTFELT_GROUPS.flatMap(g => {
          const items = HEARTFELT
            .filter(i => i.group === g)
            .map(item => ({ item, desc: t('legal.resources.' + item.key) }))
            .filter(({ desc }) => desc && desc.indexOf('legal.resources.') !== 0)
            .sort((a, b) => a.item.name.localeCompare(b.item.name, undefined, { sensitivity: 'base' }));
          if (!items.length) return [];
          return [
            React.createElement('p', { key: 'hg-' + g, style: s.hfGroup }, t('legal.resources.heartfeltGroups.' + g)),
            ...items.map(({ item, desc }) => hfRow(item, desc)),
          ];
        })
      );
    }
    // Beratung & Hilfe: gemeinnützige Beratungsstellen (eigenes Buch, damit Sophies
    // ursprüngliche 4 erhalten bleiben, ohne die Herzensempfehlungen zu verwässern).
    if (offen === 'beratung') {
      return React.createElement('div', { id: 'buch-panel', role: 'region', 'aria-label': t('dl.beratungTitle'), style: s.book(BERATUNG_TON) },
        React.createElement('div', { style: s.bookHead },
          React.createElement(Icon, { name: 'hilfe', size: 20 }),
          React.createElement(PanelTitle, { palette, style: { margin: 0 } }, t('dl.beratungTitle'))
        ),
        React.createElement('p', { style: s.herzNote }, t('dl.beratungNote')),
        BERATUNG_HILFE.map(link => linkCard(link, false))
      );
    }
    const kat = KATEGORIEN[offen];
    const links = getLinksByKategorie(offen);
    return React.createElement('div', { id: 'buch-panel', role: 'region', 'aria-label': l(kat), style: s.book(BUCH_TON[offen] || 'soft') },
      React.createElement('div', { style: s.bookHead },
        React.createElement(Icon, { name: kat.icon, size: 20 }),
        React.createElement(PanelTitle, { palette, style: { margin: 0 } }, l(kat))
      ),
      links.length ? links.map(link => linkCard(link, true)) : React.createElement('div', { style: s.empty }, t('dl.alle'))
    );
  };

  return React.createElement('div', { style: s.card },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'dokumentTresor', size: 22 }), style: { marginBottom: space.sm + 'px' } }, t('dl.title')),
    React.createElement('p', { style: s.intro }, t('dl.shelfIntro')),

    // Das Regal: Kategorie-Bücher, dann Beratung & Hilfe, dann Herzensempfehlungen.
    React.createElement('div', { style: s.shelfWrap },
      React.createElement('div', { style: s.shelf, role: 'group', 'aria-label': t('dl.title') },
        ...kategorien.map(k => spine(k.id, BUCH_TON[k.id] || 'soft', k.icon, l(k))),
        spine('beratung', BERATUNG_TON, 'hilfe', t('dl.beratungTitle')),
        spine('herz', HERZ_TON, 'heart', t('dl.herzTitle'))
      )
    ),

    // Aufgeschlagenes Buch (nur wenn ein Rücken gewählt ist).
    renderBuch(),

    // Kantonale Anlaufstellen bleiben erhalten (unverändert), unter dem Regal.
    data && data.basis?.canton && getCantonalLinks(data.basis.canton) && React.createElement('div', { style: s.canton },
      React.createElement('div', { style: s.cantonTitle }, t('dl.cantonalTitle', { canton: getCantonName(data.basis.canton, t) })),
      Object.entries(getCantonalLinks(data.basis.canton)).map(([key, url]) =>
        React.createElement('div', { key, style: { marginBottom: space.xs + 'px' } },
          React.createElement('a', { href: url, target: '_blank', rel: 'noopener noreferrer', style: { fontSize: text.xs, color: palette.sage, textDecoration: 'none' } },
            t('dl.cantonal.' + key) + ' →'
          )
        )
      )
    ),

    React.createElement('div', { style: s.source }, renderSource(t('dl.source')))
  );
};

export default DirektLinks;

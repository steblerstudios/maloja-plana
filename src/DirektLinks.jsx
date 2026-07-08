import React, { useState } from 'react';
import { PageTitle, PanelTitle } from './components/Heading.jsx';
import { KATEGORIEN, BERATUNG_HILFE, HEARTFELT, HEARTFELT_GROUPS, getAllKategorien, getLinksByKategorie, getCantonalLinks } from './data/direktLinks.js';
import { getCantonName } from './config/cantonalData.js';
import { Icon } from './IconSystem.jsx';
import { text, weight, space, radius, ease } from './config/tokens.js';
import { renderSource } from './utils/renderSource.js';

// Bücherregal mit mehreren Etagen: jede Kategorie (und jedes Sonderthema) ist ein
// Buch, dessen Rücken auf einem Regalbrett steht. Ein Klick klappt das Buch unter
// seiner eigenen Etage auf. Logisch sortiert (amtlich / Rat & Schutz /
// Herzensempfehlungen). Die Herzensempfehlungen sind eine eigene Etage, in der jede
// Themengruppe ein kleines Buch ist (alle mit Herz-Icon = „persönlich empfohlen",
// unterschieden durch Farbe + Name). ALLE Buch-Inhalte nutzen dieselbe Karte.
const BUCH_TON = {
  gesundheit: 'rose',
  vorsorge: 'sage',
  soziales: 'sky',
  arbeit: 'gold',
  familie: 'sand',
  finanzen: 'sky',
  recht: 'soft',
};
// Sonderbücher (nicht aus KATEGORIEN): Ton, Icon, Titel-Key.
const SONDER = {
  beratung: { ton: 'sage', icon: 'contacts', titleKey: 'dl.beratungTitle' },
  sicher: { ton: 'sky', icon: 'lock', titleKey: 'dl.sicherTitle' },
  mitreden: { ton: 'sand', icon: 'edit', titleKey: 'dl.mitredenTitle' },
};
// Herzensempfehlungs-Bücher (je Themengruppe): eigene Farbe + thematisches Icon.
// Neue Icons globe/tag/paw/palette (IconSystem); gesundheit/soziales/gemeinschaft
// nutzen bestehende, bedeutungsgleiche Icons.
const HERZ_TON = { digital: 'sky', soziales: 'sage', konsum: 'gold', tiere: 'sand', gesundheit: 'rose', kunst: 'soft', gemeinschaft: 'sage' };
const HERZ_ICON = { digital: 'globe', soziales: 'sozialhilfe', konsum: 'tag', tiere: 'paw', gesundheit: 'health', kunst: 'palette', gemeinschaft: 'family' };

// Kanton-/Gemeinde-Portal nach dem Muster www.<code|gemeinde>.ch (Sophies Entscheid:
// trifft meist, gelegentlich daneben, bewusst akzeptiert).
const cantonPortalUrl = (code) => 'https://www.' + String(code).toLowerCase() + '.ch';
const communeUrl = (city) => {
  const slug = String(city).toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')
    .replace(/[àâá]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíî]/g, 'i')
    .replace(/[òóô]/g, 'o').replace(/[ùúû]/g, 'u').replace(/ç/g, 'c').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return slug ? 'https://www.' + slug + '.ch' : null;
};

export const DirektLinks = ({ palette, t, data }) => {
  const kategorien = getAllKategorien();
  const [offen, setOffen] = useState(null); // Buch-id ('hf:<gruppe>' für Herzensempf.) oder null
  const lang = t('dl.lang');
  const l = (obj) => obj[lang] || obj.de;
  const hasAff = HEARTFELT.some(i => i.affiliate);

  // Etagen des Regals — logisch sortiert. Herzensempfehlungen: je Gruppe ein Buch.
  const regale = [
    { key: 'amtlich', label: t('dl.shelfAmtlich'), ids: kategorien.map(k => k.id) },
    { key: 'rat', label: t('dl.shelfRat'), ids: ['beratung', 'sicher', 'mitreden'] },
    { key: 'herz', label: t('dl.herzTitle'), desc: t(hasAff ? 'legal.resources.heartfeltIntroAffiliate' : 'legal.resources.heartfeltIntro'), ids: HEARTFELT_GROUPS.map(g => 'hf:' + g) },
  ];

  // Ton, Icon, Titel je Buch (Kategorie / Sonderbuch / Herzensempfehlungs-Gruppe).
  const bookInfo = (id) => {
    if (id.indexOf('hf:') === 0) {
      const g = id.slice(3);
      return { ton: HERZ_TON[g] || 'gold', icon: HERZ_ICON[g] || 'heart', name: t('legal.resources.heartfeltGroups.' + g) };
    }
    if (SONDER[id]) return { ton: SONDER[id].ton, icon: SONDER[id].icon, name: t(SONDER[id].titleKey) };
    return { ton: BUCH_TON[id] || 'soft', icon: KATEGORIEN[id].icon, name: l(KATEGORIEN[id]) };
  };

  const s = {
    card: { maxWidth: '720px', background: palette.surface, padding: space.lg + 'px', borderRadius: radius.md + 'px', border: '1px solid ' + palette.border },
    intro: { fontSize: text.sm, color: palette.mid, lineHeight: 1.55, margin: '0 0 ' + space.lg + 'px' },
    etage: { marginBottom: space.lg + 'px' },
    shelfLabel: { fontSize: text.xs, fontWeight: weight.semi, color: palette.mid, letterSpacing: '0.3px', margin: '0 0 ' + space.xs + 'px 2px' },
    shelfDesc: { fontSize: text.xs, color: palette.mid, fontStyle: 'italic', lineHeight: 1.5, margin: '0 0 ' + space.sm + 'px 2px', maxWidth: '440px' },
    shelfWrap: { overflowX: 'auto', paddingBottom: space.xs + 'px', WebkitOverflowScrolling: 'touch' },
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
    book: (ton) => ({ background: palette.up, border: '1px solid ' + palette.border, borderLeft: '4px solid ' + palette[ton], borderRadius: '0 ' + radius.sm + 'px ' + radius.sm + 'px 0', padding: space.md + 'px', marginTop: space.sm + 'px' }),
    bookHead: { display: 'flex', alignItems: 'center', gap: space.sm + 'px', marginBottom: space.sm + 'px' },
    bookIntro: { fontSize: text.xs, color: palette.mid, lineHeight: 1.55, margin: '0 0 ' + space.md + 'px', fontStyle: 'italic' },
    groupHeading: { fontWeight: weight.semi, fontSize: text.sm, color: palette.mid, margin: space.md + 'px 0 ' + space.xs + 'px' },
    // Einheitliche Eintrags-Karte für ALLE Bücher.
    entryCard: { padding: space.md + 'px', background: palette.surface, border: '1px solid ' + palette.border, borderRadius: radius.sm + 'px', margin: '0 0 ' + space.sm + 'px' },
    entryName: { fontSize: text.sm, fontWeight: weight.semi, color: palette.text },
    entryNameLink: { fontSize: text.sm, fontWeight: weight.semi, color: palette.sage, textDecoration: 'none' },
    entryDesc: { fontSize: text.xs, color: palette.mid, lineHeight: 1.5, marginTop: '3px' },
    entryMeta: { fontSize: text.xs, color: palette.soft, marginTop: space.xs + 'px' },
    entryMetaLink: { fontSize: text.xs, color: palette.sage, textDecoration: 'none' },
    aff: { color: palette.soft, fontSize: text.xs, fontWeight: weight.normal },
    empty: { fontSize: text.sm, color: palette.mid, textAlign: 'center', padding: space.lg + 'px' },
    canton: { padding: space.md + 'px', background: palette.sage + '11', borderRadius: radius.sm + 'px', margin: space.sm + 'px 0 ' + space.md + 'px', border: '1px solid ' + palette.sage + '33' },
    cantonTitle: { fontWeight: weight.semi, fontSize: text.sm, marginBottom: space.sm + 'px', color: palette.sage },
    source: { marginTop: space.md + 'px', fontSize: text.xs, color: palette.sky },
  };

  // Einheitliche Eintrags-Karte: Name (Link aufs Wort, sonst Text) + optional
  // Affiliate-Marker, Beschreibung, und Meta-Zeilen (Antragsstelle / Website).
  // e = { key, name, url?, desc?, affiliate?, extras?: [{ label, url? }] }
  const entryCard = (e) => React.createElement('div', { key: e.key, style: s.entryCard },
    React.createElement('div', null,
      e.url
        ? React.createElement('a', { href: e.url, target: '_blank', rel: 'noopener noreferrer', style: s.entryNameLink }, e.name)
        : React.createElement('span', { style: s.entryName }, e.name),
      e.affiliate ? React.createElement('span', { style: s.aff }, ' · ' + t('legal.resources.affiliateMarker')) : null
    ),
    e.desc ? React.createElement('div', { style: s.entryDesc }, e.desc) : null,
    ...(e.extras || []).map((x, i) => React.createElement('div', { key: 'x' + i, style: s.entryMeta },
      x.url ? React.createElement('a', { href: x.url, target: '_blank', rel: 'noopener noreferrer', style: s.entryMetaLink }, x.label) : x.label
    ))
  );

  // Kategorie-Link → normalisierter Eintrag (Antragsstelle als Meta).
  const katEntries = (id) => getLinksByKategorie(id).map(link => ({
    key: link.id, name: l(link.name), url: link.url, desc: l(link.beschreibung),
    extras: link.antragsstelle ? [{ label: t('dl.antragsstelle') + ': ' + l(link.antragsstelle) }] : [],
  }));
  // i18n-Ressourcen-Objekt ({ name, url, desc, web? }) → normalisierter Eintrag.
  const resEntry = (key, e) => ({ key, name: e.name, url: e.url, desc: e.desc, extras: e.web ? [{ label: 'Website', url: e.web }] : [] });
  // Herzensempfehlungen einer Gruppe → normalisierte Einträge (Beschreibung aus i18n).
  const herzEntries = (g) => HEARTFELT
    .filter(i => i.group === g)
    .map(item => ({ item, desc: t('legal.resources.' + item.key) }))
    .filter(({ desc }) => desc && desc.indexOf('legal.resources.') !== 0)
    .sort((a, b) => a.item.name.localeCompare(b.item.name, undefined, { sensitivity: 'base' }))
    .map(({ item, desc }) => ({ key: item.key, name: item.name, url: item.url, desc, affiliate: item.affiliate }));

  // Gemeinde-/Kanton-Karte fürs „Mitreden"-Buch (kantonsabhängig) — gleiche Karten-Optik.
  const renderLocalGov = () => {
    const canton = (data && data.basis && data.basis.canton) || '';
    const city = ((data && data.wohnen && data.wohnen.city) || '').trim();
    const cantonName = canton ? getCantonName(canton, t) : '';
    if (!city && !cantonName) return React.createElement('div', { key: 'lg', style: s.entryCard },
      React.createElement('div', { style: s.entryName }, t('legal.resources.petition3')));
    const links = [];
    if (city) { const cUrl = communeUrl(city); links.push(cUrl ? React.createElement('a', { key: 'gm', href: cUrl, target: '_blank', rel: 'noopener noreferrer', style: s.entryNameLink }, city) : React.createElement('span', { key: 'gm', style: s.entryName }, city)); }
    if (cantonName) {
      if (city) links.push(' · ');
      links.push(React.createElement('a', { key: 'kt', href: cantonPortalUrl(canton), target: '_blank', rel: 'noopener noreferrer', style: s.entryNameLink }, t('legal.resources.cantonPortal', { canton: cantonName })));
    }
    return React.createElement('div', { key: 'lg', style: s.entryCard },
      React.createElement('div', null, ...links),
      React.createElement('div', { style: s.entryDesc }, t('legal.resources.localGovDesc'))
    );
  };

  // Buch-Hülle: farbige Kante + Kopf (Icon + Titel) + optionaler Intro + Inhalt.
  const bookWrap = (id, intro, children) => {
    const info = bookInfo(id);
    return React.createElement('div', { id: 'buch-panel', role: 'region', 'aria-label': info.name, style: s.book(info.ton) },
      React.createElement('div', { style: s.bookHead },
        React.createElement(Icon, { name: info.icon, size: 20 }),
        React.createElement(PanelTitle, { palette, style: { margin: 0 } }, info.name)
      ),
      intro ? React.createElement('p', { style: s.bookIntro }, intro) : null,
      ...children
    );
  };

  const groupHeading = (label, key) => React.createElement('p', { key, style: s.groupHeading }, label);

  // Inhalt des aufgeschlagenen Buchs.
  const renderBuch = () => {
    if (!offen) return null;
    // Herzensempfehlungs-Gruppe (eigenes Buch): Karten dieser Gruppe.
    if (offen.indexOf('hf:') === 0) {
      return bookWrap(offen, null, herzEntries(offen.slice(3)).map(entryCard));
    }
    // Beratung & Hilfe: Beratungsstellen (help + Sophies 3) + Ombudsstellen (ombuds).
    if (offen === 'beratung') {
      const kids = [];
      kids.push(groupHeading(t('legal.resources.helpTitle'), 'gh-help'));
      ['help1', 'help2', 'help3', 'help4'].forEach((k, i) => kids.push(entryCard(resEntry('help' + i, t('legal.resources.' + k)))));
      BERATUNG_HILFE.forEach((x, i) => kids.push(entryCard({ key: 'ber' + i, name: l(x.name), url: x.url, desc: l(x.beschreibung) })));
      kids.push(groupHeading(t('legal.resources.ombudsTitle'), 'gh-omb'));
      ['ombuds1', 'ombuds2', 'ombuds3', 'ombuds4'].forEach((k, i) => kids.push(entryCard(resEntry('omb' + i, t('legal.resources.' + k)))));
      return bookWrap('beratung', t('dl.beratungNote'), kids);
    }
    // Sichere Kanäle: verschlüsselte/rechtsgültige Kommunikationswege.
    if (offen === 'sicher') {
      const kids = ['threema', 'secureSafe', 'incamail'].map((k, i) => entryCard(resEntry('sec' + i, t('legal.resources.' + k))));
      return bookWrap('sicher', t('legal.resources.secure1'), kids);
    }
    // Mitreden: Petitionen + Gemeinde/Kanton (Bürgerrechte, Art. 33 BV).
    if (offen === 'mitreden') {
      return bookWrap('mitreden', t('legal.resources.petition1'), [
        entryCard(resEntry('pet2', t('legal.resources.petition2'))),
        renderLocalGov(),
      ]);
    }
    // Kategorie-Buch.
    const entries = katEntries(offen);
    return bookWrap(offen, null, entries.length ? entries.map(entryCard) : [React.createElement('div', { key: 'empty', style: s.empty }, t('dl.alle'))]);
  };

  // Ein Buchrücken im Regal.
  const spine = (id) => {
    const info = bookInfo(id);
    const active = offen === id;
    return React.createElement('button', {
      key: id, type: 'button', 'aria-pressed': active, 'aria-expanded': active, 'aria-controls': 'buch-panel',
      'aria-label': info.name, title: info.name, style: s.spine(info.ton, active),
      onClick: () => setOffen(active ? null : id),
    },
      React.createElement('span', { style: s.cap(info.ton), 'aria-hidden': 'true' }),
      React.createElement(Icon, { name: info.icon, size: 17 }),
      React.createElement('span', { style: s.spineName }, info.name)
    );
  };

  return React.createElement('div', { style: s.card },
    React.createElement(PageTitle, { palette, icon: React.createElement(Icon, { name: 'dokumentTresor', size: 22 }), style: { marginBottom: space.sm + 'px' } }, t('dl.title')),
    React.createElement('p', { style: s.intro }, t('dl.shelfIntro')),

    // Das Regal mit mehreren Etagen. Das aufgeschlagene Buch erscheint unter seiner Etage.
    ...regale.map(regal => React.createElement('div', { key: regal.key, style: s.etage },
      React.createElement('div', { style: s.shelfLabel }, regal.label),
      regal.desc ? React.createElement('div', { style: s.shelfDesc }, regal.desc) : null,
      React.createElement('div', { style: s.shelfWrap },
        React.createElement('div', { style: s.shelf, role: 'group', 'aria-label': regal.label },
          ...regal.ids.map(id => spine(id))
        )
      ),
      regal.ids.includes(offen) ? renderBuch() : null
    )),

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

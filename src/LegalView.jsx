import React from 'react';
import { text, weight, leading, space, radius } from './config/tokens.js';

const Section = ({ title, children, palette }) =>
  React.createElement('div', {
    style: { marginBottom: '28px' }
  },
    React.createElement('h3', {
      style: {
        fontSize: text.body, fontWeight: weight.semi, color: palette.text,
        marginBottom: space.sm, letterSpacing: '0.2px',
        paddingBottom: space.sm, borderBottom: '1px solid ' + palette.border,
      }
    }, title),
    React.createElement('div', {
      style: { fontSize: text.sm, color: palette.mid, lineHeight: leading.relaxed }
    }, Array.isArray(children) ? children.map((c, i) => React.cloneElement(c, { key: i })) : children)
  );

const linkStyle = { color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '2px' };

// Herzensempfehlungen: Name + Ziel-Link sind sprachunabhängig (Eigennamen),
// nur die Beschreibung kommt aus i18n (heartfeltN). url: null = bewusst kein Link
// (App-Store-App ohne Website, oder Website mit defektem HTTPS-Zertifikat).
const HEARTFELT = [
  { key: 'heartfelt1', name: 'Ecosia', url: 'https://www.ecosia.org' },
  { key: 'heartfelt2', name: 'Infomaniak', url: 'https://www.infomaniak.com' },
  { key: 'heartfelt3', name: 'Posteo', url: 'https://posteo.de' },
  { key: 'heartfelt4', name: 'artfuljana', url: 'https://artfuljana.ch' },
  { key: 'heartfelt5', name: 'Baukunst Nick', url: null }, // HTTPS-Zertifikat defekt – vorerst kein Link
  { key: 'heartfelt6', name: 'Living Dream Design', url: null }, // HTTPS-Zertifikat defekt – vorerst kein Link
  { key: 'heartfelt7', name: 'Pfadibewegung Schweiz', url: 'https://pfadi.swiss' },
  { key: 'heartfelt8', name: 'Tierschutz beider Basel', url: 'https://www.tbb.ch' },
  { key: 'heartfelt9', name: 'Abschiedsagentur', url: 'https://abschiedsagentur.ch' },
  { key: 'heartfelt10', name: 'Xdo', url: null }, // App Store (Rau Media), keine Website
];

const LEGAL_LINKS = {
  'Art. 28 nDSG': 'https://www.fedlex.admin.ch/eli/cc/2022/491/de#art_28',
  'Art. 7': 'https://www.fedlex.admin.ch/eli/cc/1994/1837_1837_1837/de#art_7',
  'Art. 266a': 'https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_266_a',
  'Art. 169': 'https://www.fedlex.admin.ch/eli/cc/24/233_245_233/de#art_169',
  'edoeb.admin.ch': 'https://www.edoeb.admin.ch',
  'nDSG': 'https://www.fedlex.admin.ch/eli/cc/2022/491/de',
};

const autoLink = (text, palette) => {
  if (typeof text !== 'string') return text;
  const parts = [];
  let rest = text;
  const urlRe = /((https?:\/\/[^\s,)]+)|([\w.+-]+@[\w.-]+\.\w{2,}))/g;
  let match;
  let lastIdx = 0;
  while ((match = urlRe.exec(rest)) !== null) {
    if (match.index > lastIdx) parts.push(rest.slice(lastIdx, match.index));
    const val = match[0];
    if (val.includes('@')) {
      parts.push(React.createElement('a', { key: match.index, href: 'mailto:' + val, style: linkStyle }, val));
    } else {
      const label = val.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
      parts.push(React.createElement('a', { key: match.index, href: val, target: '_blank', rel: 'noopener', style: linkStyle }, label));
    }
    lastIdx = match.index + val.length;
  }
  if (lastIdx < rest.length) parts.push(rest.slice(lastIdx));
  for (const [term, url] of Object.entries(LEGAL_LINKS)) {
    for (let i = 0; i < parts.length; i++) {
      if (typeof parts[i] === 'string' && parts[i].includes(term)) {
        const idx = parts[i].indexOf(term);
        const before = parts[i].slice(0, idx);
        const after = parts[i].slice(idx + term.length);
        const link = React.createElement('a', { key: 'law-' + i, href: url, target: '_blank', rel: 'noopener', style: linkStyle }, term);
        parts.splice(i, 1, before, link, after);
        i += 2;
      }
    }
  }
  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
};

const P = ({ children, palette }) =>
  React.createElement('p', { style: { margin: '0 0 8px 0' } }, autoLink(children, palette));

export const LegalView = ({ palette, t, onNavigate, section }) => {
  const activeSection = section || 'privacy';

  const tabs = [
    { key: 'privacy', label: t('legal.tabs.privacy') },
    { key: 'terms', label: t('legal.tabs.terms') },
    { key: 'imprint', label: t('legal.tabs.imprint') },
    { key: 'license', label: t('legal.tabs.license') },
    { key: 'ethics', label: t('legal.tabs.ethics') },
    { key: 'resources', label: t('legal.tabs.resources') },
    { key: 'faq', label: t('legal.tabs.faq') },
  ];

  return React.createElement('div', {
    style: { maxWidth: '600px', margin: '0 auto' }
  },
    // Back
    React.createElement('button', {
      onClick: () => onNavigate('dashboard'),
      style: {
        background: 'none', border: 'none', cursor: 'pointer',
        color: palette.mid, fontSize: text.sm, padding: '0 0 16px 0',
        fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: space.xs,
      }
    }, '← ' + t('common.back')),

    // Title
    React.createElement('h2', {
      style: {
        fontSize: text.lg, fontWeight: weight.semi, marginBottom: space.md,
        letterSpacing: '0.2px',
      }
    }, t('legal.title')),

    // Tabs
    React.createElement('div', {
      style: {
        display: 'flex', gap: space.xs, marginBottom: space.lg,
        borderBottom: '1px solid ' + palette.border, paddingBottom: '12px',
        flexWrap: 'wrap',
      }
    },
      tabs.map(tab =>
        React.createElement('button', {
          key: tab.key,
          onClick: () => onNavigate('legal', undefined, tab.key),
          style: {
            padding: space.sm + 'px ' + space.md + 'px',
            background: activeSection === tab.key ? palette.sand : 'transparent',
            color: activeSection === tab.key ? '#000' : palette.text,
            border: 'none',
            borderRadius: radius.sm + 'px ' + radius.sm + 'px 0 0',
            cursor: 'pointer',
            fontWeight: activeSection === tab.key ? weight.semi : weight.normal,
            fontSize: text.sm,
            fontFamily: 'inherit',
          }
        }, tab.label)
      )
    ),

    // ─── Privacy / Datenschutz (nDSG) ─────────────────────────
    activeSection === 'privacy' && React.createElement('div', null,
      Section({ title: t('legal.privacy.responsibleTitle'), palette, children: [
        P({ children: t('legal.privacy.responsible1') }),
        P({ children: t('legal.privacy.responsible2') }),
        P({ children: t('legal.privacy.responsible3') }),
      ]}),
      Section({ title: t('legal.privacy.localTitle'), palette, children: [
        P({ children: t('legal.privacy.local1') }),
        P({ children: t('legal.privacy.local2') }),
        P({ children: t('legal.privacy.local3') }),
      ]}),
      Section({ title: t('legal.privacy.dataTitle'), palette, children: [
        P({ children: t('legal.privacy.data1') }),
        P({ children: t('legal.privacy.data2') }),
        P({ children: t('legal.privacy.data3') }),
        P({ children: t('legal.privacy.data4') }),
      ]}),
      Section({ title: t('legal.privacy.sensitiveTitle'), palette, children: [
        P({ children: t('legal.privacy.sensitive1') }),
        P({ children: t('legal.privacy.sensitive2') }),
      ]}),
      Section({ title: t('legal.privacy.hostingTitle'), palette, children: [
        P({ children: t('legal.privacy.hosting1') }),
        P({ children: t('legal.privacy.hosting2') }),
      ]}),
      Section({ title: t('legal.privacy.backupTitle'), palette, children: [
        P({ children: t('legal.privacy.backup1') }),
      ]}),
      Section({ title: t('legal.privacy.rightsTitle'), palette, children: [
        P({ children: t('legal.privacy.rights1') }),
        P({ children: t('legal.privacy.rights2') }),
        P({ children: t('legal.privacy.rights3') }),
      ]}),
      Section({ title: t('legal.privacy.securityTitle'), palette, children: [
        P({ children: t('legal.privacy.security1') }),
        P({ children: t('legal.privacy.security2') }),
      ]}),
      Section({ title: t('legal.privacy.cookiesTitle'), palette, children: [
        P({ children: t('legal.privacy.cookies1') }),
      ]}),
      Section({ title: t('legal.privacy.notificationsTitle'), palette, children: [
        P({ children: t('legal.privacy.notifications1') }),
      ]}),
      Section({ title: t('legal.privacy.supervisoryTitle'), palette, children: [
        P({ children: t('legal.privacy.supervisory1') }),
      ]})
    ),

    // ─── Terms / Nutzungsbedingungen ────────────────────────
    activeSection === 'terms' && React.createElement('div', null,
      Section({ title: t('legal.terms.scopeTitle'), palette, children: [
        P({ children: t('legal.terms.scope1') }),
        P({ children: t('legal.terms.scope2') }),
      ]}),
      Section({ title: t('legal.terms.noAdviceTitle'), palette, children: [
        P({ children: t('legal.terms.noAdvice1') }),
        P({ children: t('legal.terms.noAdvice2') }),
        P({ children: t('legal.terms.noAdvice3') }),
      ]}),
      Section({ title: t('legal.terms.accuracyTitle'), palette, children: [
        P({ children: t('legal.terms.accuracy1') }),
        P({ children: t('legal.terms.accuracy2') }),
      ]}),
      Section({ title: t('legal.terms.responsibilityTitle'), palette, children: [
        P({ children: t('legal.terms.responsibility1') }),
      ]}),
      Section({ title: t('legal.terms.ipTitle'), palette, children: [
        P({ children: t('legal.terms.ip1') }),
        P({ children: t('legal.terms.ip2') }),
      ]}),
      Section({ title: t('legal.terms.availabilityTitle'), palette, children: [
        P({ children: t('legal.terms.availability1') }),
        P({ children: t('legal.terms.availability2') }),
      ]}),
      Section({ title: t('legal.terms.dataLossTitle'), palette, children: [
        P({ children: t('legal.terms.dataLoss1') }),
        P({ children: t('legal.terms.dataLoss2') }),
      ]}),
      Section({ title: t('legal.terms.changesTitle'), palette, children: [
        P({ children: t('legal.terms.changes1') }),
        P({ children: t('legal.terms.changes2') }),
      ]})
    ),

    // ─── Imprint / Impressum ────────────────────────────────
    activeSection === 'imprint' && React.createElement('div', null,
      Section({ title: t('legal.imprint.operatorTitle'), palette, children: [
        P({ children: t('legal.imprint.operator1') }),
        P({ children: t('legal.imprint.operator2') }),
      ]}),
      Section({ title: t('legal.imprint.contactTitle'), palette, children: [
        P({ children: t('legal.imprint.contact1') }),
        P({ children: t('legal.imprint.contact2') }),
      ]}),
      Section({ title: t('legal.imprint.projectTitle'), palette, children: [
        P({ children: t('legal.imprint.project1') }),
      ]}),
      Section({ title: t('legal.imprint.hostingTitle'), palette, children: [
        P({ children: t('legal.imprint.hosting1') }),
      ]}),
      Section({ title: t('legal.imprint.disclaimerTitle'), palette, children: [
        P({ children: t('legal.imprint.disclaimer1') }),
      ]}),
      Section({ title: t('legal.imprint.jurisdictionTitle'), palette, children: [
        P({ children: t('legal.imprint.jurisdiction1') }),
      ]})
    ),

    // ─── License / Lizenz ─────────────────────────────────
    activeSection === 'license' && React.createElement('div', null,
      Section({ title: t('legal.license.agplTitle'), palette, children: [
        P({ children: t('legal.license.agpl1') }),
        P({ children: t('legal.license.agpl2') }),
        P({ children: t('legal.license.agpl3') }),
        P({ children: t('legal.license.agpl4') }),
      ]}),
      Section({ title: t('legal.license.dualTitle'), palette, children: [
        P({ children: t('legal.license.dual1') }),
        P({ children: t('legal.license.dual2') }),
      ]}),
      Section({ title: t('legal.license.trademarkTitle'), palette, children: [
        P({ children: t('legal.license.trademark1') }),
      ]}),
      Section({ title: t('legal.license.sourceTitle'), palette, children: [
        P({ children: t('legal.license.source1') }),
      ]}),
      Section({ title: t('legal.license.thirdPartyTitle'), palette, children: [
        P({ children: t('legal.license.thirdParty1') }),
      ]})
    ),

    // ─── Ethics & Sustainability / Ethik & Nachhaltigkeit ────
    activeSection === 'ethics' && React.createElement('div', null,
      Section({ title: t('legal.ethics.valuesTitle'), palette, children: [
        P({ children: t('legal.ethics.values1') }),
        P({ children: t('legal.ethics.values2') }),
        P({ children: t('legal.ethics.values3') }),
        P({ children: t('legal.ethics.values4') }),
      ]}),
      Section({ title: t('legal.ethics.principlesTitle'), palette, children: [
        P({ children: t('legal.ethics.principles1') }),
        P({ children: t('legal.ethics.principles2') }),
        P({ children: t('legal.ethics.principles3') }),
        P({ children: t('legal.ethics.principles4') }),
        P({ children: t('legal.ethics.principles5') }),
      ]}),
      Section({ title: t('legal.ethics.noTitle'), palette, children: [
        P({ children: t('legal.ethics.no1') }),
        P({ children: t('legal.ethics.no2') }),
        P({ children: t('legal.ethics.no3') }),
      ]}),
      Section({ title: t('legal.ethics.sustainTitle'), palette, children: [
        P({ children: t('legal.ethics.sustain1') }),
        P({ children: t('legal.ethics.sustain2') }),
        P({ children: t('legal.ethics.sustain3') }),
        P({ children: t('legal.ethics.sustain4') }),
      ]}),
      Section({ title: t('legal.ethics.contactTitle'), palette, children: [
        P({ children: t('legal.ethics.contact1') }),
        P({ children: t('legal.ethics.contact2') }),
      ]})
    ),

    activeSection === 'resources' && React.createElement('div', null,
      Section({ title: t('legal.resources.secureTitle'), palette, children: [
        P({ children: t('legal.resources.secure1') }),
        P({ children: '→ ' + t('legal.resources.threema') }),
        P({ children: '→ ' + t('legal.resources.secureSafe') }),
        P({ children: '→ ' + t('legal.resources.incamail') }),
      ]}),
      Section({ title: t('legal.resources.petitionTitle'), palette, children: [
        P({ children: t('legal.resources.petition1') }),
        P({ children: '→ ' + t('legal.resources.petition2') }),
        P({ children: '→ ' + t('legal.resources.petition3') }),
      ]}),
      Section({ title: t('legal.resources.helpTitle'), palette, children: [
        P({ children: t('legal.resources.help1') }),
        P({ children: t('legal.resources.help2') }),
        P({ children: t('legal.resources.help3') }),
        P({ children: t('legal.resources.help4') }),
      ]}),
      Section({ title: t('legal.resources.ombudsTitle'), palette, children: [
        P({ children: '→ ' + t('legal.resources.ombuds1') }),
        P({ children: '→ ' + t('legal.resources.ombuds2') }),
        P({ children: '→ ' + t('legal.resources.ombuds3') }),
        P({ children: '→ ' + t('legal.resources.ombuds4') }),
      ]}),
      Section({ title: t('legal.resources.heartfeltTitle'), palette, children: [
        P({ children: t('legal.resources.heartfeltIntro') }),
        ...HEARTFELT
          .map(item => ({ item, desc: t('legal.resources.' + item.key) }))
          .filter(({ desc }) => desc && desc.indexOf('legal.resources.') !== 0)
          .sort((a, b) => a.item.name.localeCompare(b.item.name, undefined, { sensitivity: 'base' }))
          .map(({ item, desc }) => React.createElement('p', { key: item.key, style: { margin: '0 0 8px 0' } },
            '→ ',
            item.url
              ? React.createElement('a', { href: item.url, target: '_blank', rel: 'noopener', style: linkStyle }, item.name)
              : item.name,
            ' — ' + desc
          )),
      ]})
    ),

    activeSection === 'faq' && React.createElement('div', null,
      Section({ title: t('legal.faq.q1'), palette, children: [P({ children: t('legal.faq.a1') })] }),
      Section({ title: t('legal.faq.q2'), palette, children: [P({ children: t('legal.faq.a2') })] }),
      Section({ title: t('legal.faq.q3'), palette, children: [P({ children: t('legal.faq.a3') })] }),
      Section({ title: t('legal.faq.q4'), palette, children: [P({ children: t('legal.faq.a4') })] }),
      Section({ title: t('legal.faq.q5'), palette, children: [P({ children: t('legal.faq.a5') })] }),
      Section({ title: t('legal.faq.q6'), palette, children: [P({ children: t('legal.faq.a6') })] }),
      Section({ title: t('legal.faq.q7'), palette, children: [P({ children: t('legal.faq.a7') })] }),
      Section({ title: t('legal.faq.q8'), palette, children: [P({ children: t('legal.faq.a8') })] })
    ),

    // Footer
    React.createElement('div', {
      style: {
        marginTop: '32px', paddingTop: '16px',
        borderTop: '1px solid ' + palette.border,
        fontSize: text.xs, color: palette.soft, lineHeight: leading.relaxed,
      }
    }, t('legal.lastUpdated'))
  );
};

export default LegalView;

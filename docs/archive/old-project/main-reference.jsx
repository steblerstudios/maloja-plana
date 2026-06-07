import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

// ============================================================================
// GOOGLE FONTS
// ============================================================================
const fontStyle = document.createElement('style');
fontStyle.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');
  * { margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; }
  h1, h2, h3, .headline { font-family: 'Cormorant Garamond', serif; }
`;
document.head.appendChild(fontStyle);

// ============================================================================
// COLOR PALETTES
// ============================================================================
const DARK_PALETTE = {
  bg: '#0F0E0C',
  surface: '#161513',
  up: '#1E1C19',
  top: '#252320',
  border: '#2A2824',
  text: '#EDE8E0',
  mid: '#8A8478',
  soft: '#504C46',
  gold: '#C9A96E',
  sage: '#7B9E8C',
  rose: '#B87070',
  sky: '#6E90B0',
  sand: '#B8956A',
};

const LIGHT_PALETTE = {
  bg: '#F5F2EE',
  surface: '#FFFFFF',
  up: '#F0EDE8',
  top: '#E8E4DC',
  border: '#DDD8D0',
  text: '#1C1A17',
  mid: '#6B6560',
  soft: '#B8B4AC',
  gold: '#C9A96E',
  sage: '#7B9E8C',
  rose: '#B87070',
  sky: '#6E90B0',
  sand: '#B8956A',
};

// ============================================================================
// CHAPTERS (KOMPLETT aus v5 + Ergänzungen)
// ============================================================================
const CHAPTERS = [
  {
    key: 'basis',
    title: 'Persönliche Basis',
    icon: '◎',
    description: 'Kontakt, Identität, Adresse in der Schweiz',
    fields: [
      { k: 'fullName', label: 'Vollständiger Name', type: 'text', placeholder: 'Anna Muster' },
      { k: 'birthDate', label: 'Geburtsdatum', type: 'date' },
      { k: 'civilStatus', label: 'Zivilstand', type: 'select', options: ['ledig', 'verheiratet', 'eingetragene Partnerschaft', 'geschieden', 'verwitwet'] },
      { k: 'nationality', label: 'Nationalität', type: 'text', placeholder: 'Schweiz' },
      { k: 'ahv', label: 'AHV-Nummer', type: 'text', placeholder: '756.xxxx.xxxx.xx' },
      { k: 'address', label: 'Adresse', type: 'text', placeholder: 'Strasse, Nr., PLZ Ort' },
      { k: 'canton', label: 'Kanton', type: 'text', placeholder: 'z.B. ZH' },
      { k: 'phone', label: 'Telefon', type: 'tel', placeholder: '+41 ...' },
      { k: 'email', label: 'E-Mail', type: 'email' },
      { k: 'notes', label: 'Notizen', type: 'textarea', placeholder: 'Wichtige Hinweise' },
    ],
    docs: [
      { k: 'pass', label: 'Schweizer Pass / ID' },
      { k: 'foreignId', label: 'Ausländisches Ausweisdokument' },
      { k: 'birthCert', label: 'Geburtszeugnis' },
      { k: 'residentCert', label: 'Wohnsitzbestätigung' },
    ],
  },
  {
    key: 'wohnen',
    title: 'Wohnen & Leben',
    icon: '⌂',
    description: 'Haushalt, Wohnung, Vermieter, Hausschlüssel, Wichtige Kontakte',
    fields: [
      { k: 'household', label: 'Haushalt / Mitbewohnende', type: 'textarea', placeholder: 'Namen, Beziehung' },
      { k: 'landlord', label: 'Vermieter:in / Verwaltung', type: 'text' },
      { k: 'rentAmount', label: 'Monatsmiete (CHF)', type: 'currency', placeholder: '1500' },
      { k: 'utilities', label: 'Nebenkosten (CHF/Monat)', type: 'currency', placeholder: '200' },
      { k: 'utilitiesDesc', label: 'Nebenkosten Details (Internet, Strom, etc.)', type: 'textarea' },
      { k: 'householdInsurer', label: 'Hausrat-Versicherer', type: 'text' },
      { k: 'importantContacts', label: 'Wichtige Kontakte (Hausarzt, Zahnarzt, etc.)', type: 'textarea' },
      { k: 'keyLocation', label: 'Wo ist der Hausschlüssel?', type: 'text', placeholder: 'z.B. Schlüsselkasten hinter Türe' },
      { k: 'keyContact', label: 'Wer hat einen Ersatzschlüssel?', type: 'text', placeholder: 'Name, Beziehung, Tel' },
      { k: 'notes', label: 'Notizen', type: 'textarea' },
    ],
    docs: [
      { k: 'mietvertrag', label: 'Mietvertrag' },
      { k: 'betriebskostenabrechnung', label: 'Betriebskostenabrechnung' },
      { k: 'wohnungsversicherung', label: 'Wohnungsversicherungspolice' },
    ],
  },
  {
    key: 'finanzen',
    title: 'Finanzen & Geld',
    icon: '◇',
    description: 'Banken, Konten, Vermögen, Budget, Einnahmen & Ausgaben',
    fields: [
      { k: 'mainBank', label: 'Hauptbank', type: 'text', placeholder: 'z.B. UBS, Raiffeisen' },
      { k: 'iban', label: 'IBAN', type: 'text', placeholder: 'CH93 0076 2011 6238 5295 7' },
      { k: 'otherAccounts', label: 'Weitere Konten / Börsenplatz', type: 'textarea' },
      { k: 'monthlyIncome', label: 'Monatliches Nettoeinkommen (CHF)', type: 'currency', placeholder: '4500' },
      { k: 'monthlyExpenses', label: 'Monatliche Ausgaben Total (CHF)', type: 'currency', placeholder: '3200' },
      { k: 'savings', label: 'Ersparnisse / Notfallfonds (CHF)', type: 'currency' },
      { k: 'depot', label: 'Depot / Aktien / Fonds / Kryptowährungen', type: 'textarea' },
      { k: 'debts', label: 'Schulden / Kredite / Hypotheken', type: 'textarea' },
      { k: 'incomeSource', label: 'Einnahmequellen (Arbeit, Rente, etc.)', type: 'textarea' },
      { k: 'budgetNotes', label: 'Budget-Notizen', type: 'textarea' },
    ],
    docs: [
      { k: 'bankStatement', label: 'Aktuelle Kontoauszüge' },
      { k: 'depositStatement', label: 'Depot-Übersicht' },
      { k: 'loanContract', label: 'Kreditvertrag / Hypothek' },
      { k: 'investmentDocs', label: 'Anlageverträge' },
    ],
  },
  {
    key: 'versicherungen',
    title: 'Versicherungen & Vorsorge',
    icon: '◰',
    description: 'Krankenkasse, Haftpflicht, Pensionskasse, Säule 3a/3b, Franchise',
    fields: [
      { k: 'healthInsurer', label: 'Krankenversicherer', type: 'text', placeholder: 'z.B. Swica, CSS, Helsana' },
      { k: 'healthPlanType', label: 'Krankenkasse-Modell', type: 'select', options: ['Grundversicherung', 'HMO', 'Telemedizin', 'Versicherungsagent'] },
      { k: 'healthPremium', label: 'Monatliche Prämie KK (CHF)', type: 'currency', placeholder: '400' },
      { k: 'franchise', label: 'Franchise (CHF)', type: 'currency', placeholder: '300' },
      { k: 'supplementary', label: 'Zusatzversicherungen', type: 'textarea', placeholder: 'Zahnbehandlung, Komfort-Spital, etc.' },
      { k: 'liability', label: 'Privathaftpflicht-Versicherer', type: 'text' },
      { k: 'careInsurance', label: 'Pflege / Betreuung-Versicherung', type: 'text' },
      { k: 'pension', label: 'Pensionskasse / BVG', type: 'text' },
      { k: 'pillar3a', label: '3. Säule A (gebundene Vorsorge)', type: 'text', placeholder: 'z.B. Bank Aargau, Vanguard' },
      { k: 'pillar3b', label: '3. Säule B (freie Vorsorge)', type: 'text', placeholder: 'z.B. Private Versicherung, Sparplan' },
      { k: 'insuranceNotes', label: 'Notizen', type: 'textarea' },
    ],
    docs: [
      { k: 'healthPolicy', label: 'Krankenversicherungspolice' },
      { k: 'supplementaryPolicy', label: 'Zusatzversicherungspolice' },
      { k: 'liabilityPolicy', label: 'Haftpflichtpolice' },
      { k: 'pensionStatement', label: 'Pensionskassen-Kontoauszug' },
      { k: 'pillar3aDoc', label: 'Säule 3a Versicherungsurkunde' },
    ],
  },
  {
    key: 'ausbildung',
    title: 'Ausbildung & Arbeit',
    icon: '✦',
    description: 'Bildungsabschlüsse, Arbeitgeber, Arbeitsunterlagen, EFZ/Diplom',
    fields: [
      { k: 'highestDegree', label: 'Höchster Schulabschluss', type: 'text', placeholder: 'z.B. EFZ, Berufsmaturität, Fach-HS, Uni' },
      { k: 'specializations', label: 'Spezialisierungen / Zertifikate', type: 'textarea' },
      { k: 'currentEmployer', label: 'Aktueller Arbeitgeber', type: 'text' },
      { k: 'position', label: 'Funktion / Position', type: 'text' },
      { k: 'employmentType', label: 'Anstellungstyp', type: 'select', options: ['Unbefristet', 'Befristet', 'Selbständig', 'Freiberufler', 'in Ausbildung', 'Studium', 'Arbeitssuchend'] },
      { k: 'workStart', label: 'Arbeitsbeginn (Datum)', type: 'date' },
      { k: 'workLocation', label: 'Ablageort Arbeitsvertrag (z.B. Schrank A, Ordner 3)', type: 'text' },
      { k: 'workNotes', label: 'Notizen', type: 'textarea' },
    ],
    docs: [
      { k: 'workingContract', label: 'Arbeitsvertrag' },
      { k: 'diploma', label: 'Diplom / Abschlusszeugnis' },
      { k: 'references', label: 'Zeugnisse / Referenzen' },
      { k: 'certs', label: 'Weitere Zertifikate / Nachweise' },
    ],
  },
  {
    key: 'behoerden',
    title: 'Behörden & Rechtliches',
    icon: '◉',
    description: 'Steuern, Gemeinde, Testament, Patientenverfügung, Bewilligung',
    fields: [
      { k: 'community', label: 'Gemeinde / Stadtkanton', type: 'text' },
      { k: 'taxOffice', label: 'Steuerkanton / Steuergemeinde', type: 'text' },
      { k: 'taxStatus', label: 'Steuer-Status', type: 'select', options: ['Single, Standard', 'Single, Sparen', 'Verheiratet', 'Alleinerziehend', 'Selbständig'] },
      { k: 'taxLocation', label: 'Ablageort Steuerdokumente', type: 'text' },
      { k: 'permit', label: 'Aufenthaltsbewilligung (B/C/L/G) oder Heimatschein', type: 'text' },
      { k: 'willStatus', label: 'Testament vorhanden?', type: 'select', options: ['Ja', 'Nein', 'in Arbeit', 'bei Notariat'] },
      { k: 'patientDirective', label: 'Patientenverfügung / Betreuungsauftrag', type: 'select', options: ['Ja', 'Nein', 'in Arbeit'] },
      { k: 'powerOfAttorney', label: 'Vorsorgeauftrag / Bevollmächtigung', type: 'select', options: ['Ja', 'Nein', 'in Arbeit'] },
      { k: 'executor', label: 'Testament-Executor / Verantwortliche Person', type: 'text' },
      { k: 'legalNotes', label: 'Notizen', type: 'textarea' },
    ],
    docs: [
      { k: 'id', label: 'ID / Pass / Bewilligung' },
      { k: 'will', label: 'Testament' },
      { k: 'patientDirectiveDoc', label: 'Patientenverfügung' },
      { k: 'powerOfAttorneyDoc', label: 'Vorsorgeauftrag' },
      { k: 'taxReturn', label: 'Letzte Steuererklärung' },
    ],
  },
  {
    key: 'notfall',
    title: 'Notfall',
    icon: '⚠',
    description: 'Notfallkontakte, Medizinisches, Health-Verbindung, Notfall-QR',
    fields: [
      { k: 'emergencyContact1', label: 'Notfallkontakt 1 (Name, Beziehung, Tel)', type: 'text' },
      { k: 'emergencyContact2', label: 'Notfallkontakt 2 (Name, Beziehung, Tel)', type: 'text' },
      { k: 'emergencyContact3', label: 'Notfallkontakt 3 (Name, Beziehung, Tel)', type: 'text' },
      { k: 'primaryDoctor', label: 'Hausarzt / Hausärztin (Name, Tel, Adresse)', type: 'text' },
      { k: 'specialist', label: 'Facharzt (Kardiologe, etc.)', type: 'text' },
      { k: 'dentist', label: 'Zahnarzt (Name, Tel)', type: 'text' },
      { k: 'allergies', label: 'Allergien / Unverträglichkeiten', type: 'textarea' },
      { k: 'medications', label: 'Regelmässig eingenommene Medikamente', type: 'textarea', placeholder: 'Name, Dosis, Häufigkeit' },
      { k: 'medicalConditions', label: 'Wichtige Diagnosen / Erkrankungen', type: 'textarea' },
      { k: 'bloodType', label: 'Blutgruppe', type: 'text', placeholder: 'z.B. O+, A-, AB+' },
      { k: 'wishes', label: 'Medizinische Wünsche (Reanimation? Organspende?)', type: 'textarea' },
      { k: 'keyLocation', label: 'Wo ist der Wohnungsschlüssel?', type: 'textarea' },
      { k: 'passwordManager', label: 'Passwort-Manager / Zugang zu wichtigen Konten', type: 'textarea', placeholder: '(KEINE Passwörter speichern!)' },
      { k: 'emergencyNotes', label: 'Weitere Notizen', type: 'textarea' },
    ],
    docs: [
      { k: 'medicalReport', label: 'Aktuelle Diagnose / Befund' },
      { k: 'medicationList', label: 'Medikamentenliste / Medikamentenkarte' },
    ],
  },
];

const DEFAULT_DATA = Object.fromEntries(
  CHAPTERS.map((ch) => [ch.key, Object.fromEntries(ch.fields.map((f) => [f.k, '']))])
);

const DEFAULT_DOC_STATUS = Object.fromEntries(
  CHAPTERS.flatMap((ch) =>
    (ch.docs || []).map((d) => [
      `${ch.key}_${d.k}`,
      { status: 'missing', fileName: '', note: '', expiryDate: '' },
    ])
  )
);

// ============================================================================
// BUDGET SYNC FELDER
// ============================================================================
const BUDGET_SYNC_FIELDS = [
  { fieldKey: 'finanzen_monthlyIncome', type: 'income', category: 'Lohn / Gehalt', label: 'Monatliches Nettoeinkommen' },
  { fieldKey: 'wohnen_rentAmount', type: 'expense', category: 'Wohnen & Nebenkosten', label: 'Monatsmiete' },
  { fieldKey: 'wohnen_utilities', type: 'expense', category: 'Wohnen & Nebenkosten', label: 'Nebenkosten' },
  { fieldKey: 'versicherungen_healthPremium', type: 'expense', category: 'Krankenkasse', label: 'Monatsprämie KK' },
];

// ============================================================================
// UTILITIES
// ============================================================================
function hashLite(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return String(h);
}

function safeId(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function encryptQR(data) {
  // Einfache Base64-Verschlüsselung (Produktion: crypto.subtle)
  return btoa(JSON.stringify(data));
}

function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// ============================================================================
// COMPONENTS
// ============================================================================
function SoftCard({ children, style = {}, palette }) {
  return (
    <div
      style={{
        borderRadius: '12px',
        border: `1px solid ${palette.border}`,
        background: palette.surface,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Pill({ children, palette }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        borderRadius: '16px',
        padding: '4px 12px',
        fontSize: '11px',
        border: `1px solid ${palette.border}`,
        background: palette.up,
        color: palette.mid,
      }}
    >
      {children}
    </span>
  );
}

function SectionProgress({ chapterKey, data, palette }) {
  const ch = CHAPTERS.find((c) => c.key === chapterKey);
  const total = ch.fields.length;
  const filled = ch.fields.filter((f) => String(data?.[chapterKey]?.[f.k] || '').trim().length > 0).length;
  const pct = Math.round((filled / total) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '80px', height: '6px', borderRadius: '3px', background: palette.soft, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: palette.sage, transition: 'all 0.2s' }} />
      </div>
      <span style={{ fontSize: '11px', color: palette.mid }}>{pct}%</span>
    </div>
  );
}

function Field({ value, onChange, def, palette }) {
  const base = {
    width: '100%',
    borderRadius: '8px',
    border: `1px solid ${palette.border}`,
    padding: '10px 12px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    background: palette.surface,
    color: palette.text,
  };

  const commonProps = { value: value ?? '', onChange: (e) => onChange(e.target.value), style: base, placeholder: def.placeholder || '' };

  if (def.type === 'textarea') return <textarea rows={4} {...commonProps} />;
  if (def.type === 'select') {
    return (
      <select {...commonProps}>
        <option value="">Bitte wählen …</option>
        {def.options?.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  if (def.type === 'currency') {
    return (
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '12px', color: palette.mid }}>CHF</span>
        <input {...commonProps} type="text" inputMode="decimal" style={{ ...base, paddingLeft: '44px' }} />
      </div>
    );
  }
  return <input {...commonProps} type={def.type || 'text'} />;
}

// ============================================================================
// MAIN APP
// ============================================================================
function App() {
  const [route, setRoute] = useState('landing');
  const [darkMode, setDarkMode] = useState(true);
  const [session, setSession] = useState({ loggedIn: false, profileName: '' });
  const [auth, setAuth] = useState({ email: '', pass: '' });
  const [authErr, setAuthErr] = useState('');
  const [data, setData] = useState(DEFAULT_DATA);
  const [docStatus, setDocStatus] = useState(DEFAULT_DOC_STATUS);
  const [budget, setBudget] = useState([]);
  const [active, setActive] = useState(0);
  const [showQRModal, setShowQRModal] = useState(false);

  const palette = darkMode ? DARK_PALETTE : LIGHT_PALETTE;

  const storageKey = useMemo(() => {
    const email = (session.profileName || auth.email || '').trim().toLowerCase();
    return email ? `ordnung-ruhe:v11:${hashLite(email)}` : 'ordnung-ruhe:v11:anon';
  }, [session.profileName, auth.email]);

  // LOAD
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.data) setData((prev) => ({ ...prev, ...parsed.data }));
        if (parsed?.docStatus) setDocStatus((prev) => ({ ...prev, ...parsed.docStatus }));
        if (parsed?.budget) setBudget(parsed.budget);
        if (parsed?.profileName) setSession((s) => ({ ...s, profileName: parsed.profileName }));
        if (parsed?.darkMode !== undefined) setDarkMode(parsed.darkMode);
      }
    } catch (e) {
      console.log('Load error:', e.message);
    }
  }, [storageKey]);

  // SAVE
  useEffect(() => {
    try {
      const payload = { data, docStatus, budget, profileName: session.profileName, darkMode, lastSaved: new Date().toISOString() };
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (e) {
      console.log('Save error:', e.message);
    }
  }, [data, docStatus, budget, session.profileName, darkMode, storageKey]);

  // Compute Synced Budget
  const syncedBudget = useMemo(() => {
    const month = getCurrentMonth();
    const entries = [];
    for (const { fieldKey, type, category, label } of BUDGET_SYNC_FIELDS) {
      const [ch, fk] = fieldKey.split('_');
      const amount = Number((data?.[ch]?.[fk] || '').replace(/[^0-9.]/g, '')) || 0;
      if (amount > 0) {
        entries.push({ id: `sync_${fieldKey}_${month}`, type, category, description: label, amount, month, synced: true });
      }
    }
    return entries;
  }, [data]);

  const ch = CHAPTERS[active];

  const completion = useMemo(() => {
    const totals = CHAPTERS.map((c) => {
      const t = c.fields.length;
      const f = c.fields.filter((ff) => String(data?.[c.key]?.[ff.k] || '').trim().length > 0).length;
      return { key: c.key, filled: f, total: t };
    });
    const total = totals.reduce((a, b) => a + b.total, 0);
    const filled = totals.reduce((a, b) => a + b.filled, 0);
    return { pct: Math.round((filled / total) * 100) };
  }, [data]);

  const login = () => {
    setAuthErr('');
    const email = auth.email.trim().toLowerCase();
    if (!email || !auth.pass) { setAuthErr('Bitte E-Mail und Passwort eingeben.'); return; }
    const gateKey = `ordnung-ruhe:gate:${hashLite(email)}`;
    const stored = localStorage.getItem(gateKey);
    const h = hashLite(auth.pass);
    if (!stored) {
      localStorage.setItem(gateKey, h);
    } else if (stored !== h) {
      setAuthErr('Passwort stimmt nicht.');
      return;
    }
    setSession({ loggedIn: true, profileName: email });
    setRoute('app');
  };

  const logout = () => {
    setSession({ loggedIn: false, profileName: '' });
    setAuth({ email: '', pass: '' });
    setRoute('landing');
  };

  const updateField = (chapterKey, fieldKey, value) => {
    setData((prev) => ({ ...prev, [chapterKey]: { ...prev[chapterKey], [fieldKey]: value } }));
  };

  const makeQRData = () => {
    const month = getCurrentMonth();
    return {
      name: data.basis.fullName || 'Unbekannt',
      phone: data.basis.phone || '',
      bloodType: data.notfall.bloodType || '',
      allergies: data.notfall.allergies || '',
      medications: data.notfall.medications || '',
      emergencyContact: data.notfall.emergencyContact1 || '',
      doctor: data.notfall.primaryDoctor || '',
      month,
    };
  };

  const exportPdf = (keys, emptyTemplate = false) => {
    try {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const pageW = doc.internal.pageSize.getWidth();
        const margin = 48;
        const line = 16;

        const title = emptyTemplate ? 'Leere Vorlage' : 'Meine Unterlagen';
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text(title, margin, 56);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        if (session.profileName) doc.text(`Profil: ${session.profileName}`, margin, 76);
        doc.setDrawColor(150);
        doc.line(margin, 88, pageW - margin, 88);

        let y = 112;
        const maxY = doc.internal.pageSize.getHeight() - margin;

        for (const c of CHAPTERS) {
          if (!keys.includes(c.key)) continue;
          if (y > maxY - 36) { doc.addPage(); y = margin; }

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(13);
          doc.text(c.title, margin, y);
          y += 14;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(100);
          const descLines = doc.splitTextToSize(c.description, pageW - margin * 2);
          for (const l of descLines) { if (y > maxY) { doc.addPage(); y = margin; } doc.text(l, margin, y); y += line; }
          doc.setTextColor(0);
          y += 4;

          for (const f of c.fields) {
            const v = emptyTemplate ? '' : (data?.[c.key]?.[f.k] ?? '');
            const label = `${f.label}: `;
            const value = v?.trim() ? v.trim() : emptyTemplate ? '____________________________' : '—';
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            if (y > maxY) { doc.addPage(); y = margin; }
            doc.text(label, margin, y);
            doc.setFont('helvetica', 'normal');
            const labelW = doc.getTextWidth(label);
            const valueLines = doc.splitTextToSize(value, pageW - margin * 2 - labelW);
            doc.text(valueLines, margin + labelW, y);
            y += line * valueLines.length;
          }

          y += 10;
          doc.setDrawColor(200);
          doc.line(margin, y, pageW - margin, y);
          y += 18;
        }

        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text('Lokal erstellt. Keine Datenübertragung.', margin, doc.internal.pageSize.getHeight() - 24);

        const file = emptyTemplate ? `vorlage.pdf` : `unterlagen-${safeId(session.profileName || 'profil')}.pdf`;
        doc.save(file);
      };
      document.head.appendChild(script);
    } catch (e) {
      alert('PDF-Fehler: ' + e.message);
    }
  };

  // ============================================================================
  // LANDING
  // ============================================================================
  if (route === 'landing') {
    return (
      <div style={{ minHeight: '100vh', background: palette.bg, color: palette.text }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 20, borderBottom: `1px solid ${palette.border}`, background: `${palette.surface}99`, backdropFilter: 'blur(8px)' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '18px' }}>◈◎</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', fontFamily: "'Cormorant Garamond', serif" }}>Ordnung & Ruhe</div>
                <div style={{ fontSize: '10px', color: palette.mid }}>Schweizer Lebensordner</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${palette.border}`, background: palette.up, color: palette.text, fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}>
                {darkMode ? '☀' : '◐'}
              </button>
              <button onClick={() => setRoute('login')} style={{ padding: '8px 16px', borderRadius: '6px', background: palette.sand, color: '#fff', border: 'none', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
                Login
              </button>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 16px 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '48px' }}>
            <div>
              <h1 style={{ fontSize: '44px', fontWeight: '700', lineHeight: '1.1', marginBottom: '20px', fontFamily: "'Cormorant Garamond', serif" }}>
                Ihre Unterlagen.<br />
                <span style={{ color: palette.sand }}>Klar. Ruhig. Strukturiert.</span>
              </h1>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: palette.mid, maxWidth: '480px', marginBottom: '28px' }}>
                Erfassen Sie Ihre wichtigsten Lebensbereiche — Persönlich, Wohnen, Finanzen, Versicherungen, Ausbildung, Behörden, Notfall. Exportieren Sie als PDF und legen Sie physisch ab. 100% lokal, kein Server, kein Abo.
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <button onClick={() => setRoute('login')} style={{ padding: '12px 24px', borderRadius: '8px', background: palette.sand, color: '#fff', border: 'none', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}>
                  Jetzt starten
                </button>
                <button onClick={() => { setRoute('app'); setSession({ loggedIn: true, profileName: 'Demo' }); }} style={{ padding: '12px 24px', borderRadius: '8px', border: `1px solid ${palette.border}`, background: palette.up, color: palette.text, fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}>
                  Demo ausprobieren
                </button>
              </div>

              <div style={{ display: 'grid', gap: '12px', fontSize: '13px', color: palette.mid }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <span style={{ color: palette.sage, fontWeight: 'bold', marginTop: '2px' }}>✓</span>
                  <span>100% lokal — Ihre Daten bleiben bei Ihnen</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <span style={{ color: palette.sage, fontWeight: 'bold', marginTop: '2px' }}>✓</span>
                  <span>Für alle 7 Lebensbereiche optimiert</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <span style={{ color: palette.sage, fontWeight: 'bold', marginTop: '2px' }}>✓</span>
                  <span>PDF-Export und Druckfunktion</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <span style={{ color: palette.sage, fontWeight: 'bold', marginTop: '2px' }}>✓</span>
                  <span>Notfall-QR-Code mit Gesundheitsdaten</span>
                </div>
              </div>
            </div>

            <div>
              <SoftCard palette={palette} style={{ padding: '24px' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '16px', color: palette.text }}>7 Bereiche</div>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {CHAPTERS.map((c, idx) => (
                    <div key={c.key} style={{ padding: '12px', borderRadius: '8px', border: `1px solid ${palette.border}`, background: palette.top }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '18px' }}>{c.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: '600' }}>{c.title}</div>
                          <div style={{ fontSize: '11px', color: palette.mid }}>{c.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SoftCard>
            </div>
          </div>

          <div style={{ marginTop: '64px', paddingTop: '48px', borderTop: `1px solid ${palette.border}`, maxWidth: '800px', margin: '64px auto 0' }}>
            <div style={{ fontSize: '12px', color: palette.mid, lineHeight: '1.8', display: 'grid', gap: '16px' }}>
              <p style={{ fontWeight: '600', color: palette.text }}>Zu den Bedingungen</p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '12px' }}>
                <button onClick={() => setRoute('agb')} style={{ border: 'none', background: 'transparent', color: palette.sand, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                  AGB
                </button>
                <button onClick={() => setRoute('privacy')} style={{ border: 'none', background: 'transparent', color: palette.sand, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                  Datenschutz
                </button>
                <button onClick={() => setRoute('opensource')} style={{ border: 'none', background: 'transparent', color: palette.sand, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                  Open Source
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ============================================================================
  // LOGIN
  // ============================================================================
  if (route === 'login') {
    return (
      <div style={{ minHeight: '100vh', background: palette.bg, color: palette.text, display: 'flex', flexDirection: 'column' }}>
        <header style={{ borderBottom: `1px solid ${palette.border}`, background: `${palette.surface}99` }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px' }}>
            <button onClick={() => setRoute('landing')} style={{ fontSize: '14px', color: palette.sand, cursor: 'pointer', border: 'none', background: 'transparent', fontWeight: '500' }}>
              ← Zurück
            </button>
          </div>
        </header>

        <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '48px 16px' }}>
          <SoftCard palette={palette} style={{ width: '100%', maxWidth: '380px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ fontSize: '24px' }}>◐</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', fontFamily: "'Cormorant Garamond', serif" }}>Login</div>
                <div style={{ fontSize: '12px', color: palette.mid }}>Lokal, ohne Server, ohne Datenübertragung</div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              <label>
                <div style={{ fontSize: '12px', color: palette.mid, marginBottom: '6px', fontWeight: '600' }}>E-Mail</div>
                <input value={auth.email} onChange={(e) => setAuth((a) => ({ ...a, email: e.target.value }))} style={{ width: '100%', borderRadius: '8px', border: `1px solid ${palette.border}`, padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box', background: palette.surface, color: palette.text, fontFamily: "'DM Sans', sans-serif" }} placeholder="name@domain.ch" type="email" onKeyDown={(e) => e.key === 'Enter' && login()} />
              </label>

              <label>
                <div style={{ fontSize: '12px', color: palette.mid, marginBottom: '6px', fontWeight: '600' }}>Passwort</div>
                <input value={auth.pass} onChange={(e) => setAuth((a) => ({ ...a, pass: e.target.value }))} style={{ width: '100%', borderRadius: '8px', border: `1px solid ${palette.border}`, padding: '10px 12px', fontSize: '14px', boxSizing: 'border-box', background: palette.surface, color: palette.text, fontFamily: "'DM Sans', sans-serif" }} placeholder="••••••••" type="password" onKeyDown={(e) => e.key === 'Enter' && login()} />
              </label>

              {authErr && <div style={{ borderRadius: '8px', background: palette.up, padding: '10px 12px', fontSize: '12px', color: palette.rose }}>{authErr}</div>}

              <button onClick={login} style={{ borderRadius: '8px', background: palette.sand, color: '#fff', border: 'none', padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Weiter
              </button>

              <button onClick={() => setRoute('landing')} style={{ borderRadius: '8px', border: `1px solid ${palette.border}`, padding: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', background: palette.up, color: palette.text }}>
                Zurück
              </button>

              <div style={{ fontSize: '11px', color: palette.mid, paddingTop: '8px', lineHeight: '1.5' }}>
                Erstes Login erstellt lokal ein Konto. Ihre Daten bleiben auf Ihrem Gerät.
              </div>
            </div>
          </SoftCard>
        </main>
      </div>
    );
  }

  // ============================================================================
  // APP
  // ============================================================================
  return (
    <div style={{ minHeight: '100vh', background: palette.bg, color: palette.text }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 20, borderBottom: `1px solid ${palette.border}`, background: `${palette.surface}99`, backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActive(0)}>
            <div style={{ fontSize: '18px' }}>◈◎</div>
            <div style={{ fontSize: '13px', fontWeight: '600', fontFamily: "'Cormorant Garamond', serif" }}>Ordnung & Ruhe</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Pill palette={palette}>{completion.pct}%</Pill>
            <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${palette.border}`, background: palette.up, color: palette.text, fontSize: '12px', cursor: 'pointer' }}>
              {darkMode ? '☀' : '◐'}
            </button>
            <button onClick={logout} style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${palette.border}`, background: palette.up, color: palette.text, fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}>
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 16px 80px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
        <aside>
          <SoftCard palette={palette} style={{ padding: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>Schritte</div>
              <div style={{ fontSize: '11px', color: palette.mid }}>Fortschritt: {completion.pct}%</div>
            </div>

            <div style={{ display: 'grid', gap: '8px' }}>
              {CHAPTERS.map((c, idx) => {
                const isActive = idx === active;
                return (
                  <button key={c.key} onClick={() => setActive(idx)} style={{ width: '100%', textAlign: 'left', borderRadius: '8px', border: `1px solid ${palette.border}`, padding: '12px', background: isActive ? palette.up : palette.surface, cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{c.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: '600' }}>{c.title}</div>
                        <div style={{ fontSize: '10px', color: palette.mid }}>Schritt {idx + 1}/7</div>
                      </div>
                    </div>
                    <SectionProgress chapterKey={c.key} data={data} palette={palette} />
                  </button>
                );
              })}
            </div>
          </SoftCard>

          <SoftCard palette={palette} style={{ marginTop: '16px', padding: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>Export</div>
            <div style={{ display: 'grid', gap: '8px' }}>
              <button onClick={() => exportPdf(CHAPTERS.map((c) => c.key), false)} style={{ width: '100%', borderRadius: '6px', background: palette.sand, color: '#fff', border: 'none', padding: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                Alles als PDF
              </button>
              <button onClick={() => exportPdf([ch.key], false)} style={{ width: '100%', borderRadius: '6px', border: `1px solid ${palette.border}`, padding: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', background: palette.up, color: palette.text }}>
                Bereich PDF
              </button>
              <button onClick={() => exportPdf([ch.key], true)} style={{ width: '100%', borderRadius: '6px', border: `1px solid ${palette.border}`, padding: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', background: palette.up, color: palette.text }}>
                Leere Vorlage
              </button>
            </div>
          </SoftCard>

          {active === 6 && (
            <SoftCard palette={palette} style={{ marginTop: '16px', padding: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px' }}>Notfall</div>
              <button onClick={() => setShowQRModal(true)} style={{ width: '100%', borderRadius: '6px', background: palette.rose, color: '#fff', border: 'none', padding: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                Notfall-QR zeigen
              </button>
            </SoftCard>
          )}
        </aside>

        <section>
          <SoftCard palette={palette} style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>{ch.icon}</span>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '600', fontFamily: "'Cormorant Garamond', serif" }}>{ch.title}</div>
                  <div style={{ fontSize: '12px', color: palette.mid, marginTop: '4px' }}>{ch.description}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Pill palette={palette}>Schritt {active + 1}/7</Pill>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              {ch.fields.map((f) => {
                const isWide = f.type === 'textarea';
                return (
                  <div key={f.k} style={{ gridColumn: isWide ? '1 / -1' : 'auto' }}>
                    <label style={{ display: 'block', marginBottom: '6px' }}>
                      <div style={{ fontSize: '12px', color: palette.mid, fontWeight: '600' }}>{f.label}</div>
                    </label>
                    <Field def={f} value={data?.[ch.key]?.[f.k]} onChange={(v) => updateField(ch.key, f.k, v)} palette={palette} />
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '16px', borderTop: `1px solid ${palette.border}` }}>
              <button onClick={() => setActive((a) => Math.max(0, a - 1))} disabled={active === 0} style={{ borderRadius: '6px', border: `1px solid ${palette.border}`, padding: '10px 16px', fontSize: '13px', fontWeight: '600', cursor: active === 0 ? 'not-allowed' : 'pointer', background: palette.up, color: palette.text, opacity: active === 0 ? 0.5 : 1 }}>
                Zurück
              </button>

              <SectionProgress chapterKey={ch.key} data={data} palette={palette} />

              <button onClick={() => setActive((a) => Math.min(CHAPTERS.length - 1, a + 1))} disabled={active === CHAPTERS.length - 1} style={{ borderRadius: '6px', background: palette.sand, color: '#fff', border: 'none', padding: '10px 16px', fontSize: '13px', fontWeight: '600', cursor: active === CHAPTERS.length - 1 ? 'not-allowed' : 'pointer', opacity: active === CHAPTERS.length - 1 ? 0.5 : 1 }}>
                Weiter
              </button>
            </div>

            <div style={{ marginTop: '24px', borderRadius: '8px', border: `1px solid ${palette.border}`, background: palette.up, padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>
                ◐ Ruhiger Ablauf
              </div>
              <div style={{ fontSize: '12px', color: palette.mid, lineHeight: '1.5' }}>
                2–4 Minuten pro Schritt. Ihre Daten werden automatisch gespeichert. Lokal auf Ihrem Gerät, nirgendwo sonst.
              </div>
            </div>
          </SoftCard>

          {active === 2 && (
            <SoftCard palette={palette} style={{ padding: '28px', marginTop: '24px' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>Budget aktueller Monat</div>
              <div style={{ fontSize: '12px', color: palette.mid, lineHeight: '1.6' }}>
                Einkommen: <strong style={{ color: palette.text }}>CHF {Number(data.finanzen.monthlyIncome || 0).toFixed(2)}</strong><br />
                Ausgaben: <strong style={{ color: palette.text }}>CHF {(Number(data.wohnen.rentAmount || 0) + Number(data.wohnen.utilities || 0) + Number(data.versicherungen.healthPremium || 0)).toFixed(2)}</strong><br />
                Restbetrag: <strong style={{ color: palette.sage }}>CHF {(Number(data.finanzen.monthlyIncome || 0) - (Number(data.wohnen.rentAmount || 0) + Number(data.wohnen.utilities || 0) + Number(data.versicherungen.healthPremium || 0))).toFixed(2)}</strong>
              </div>
            </SoftCard>
          )}
        </section>
      </main>

      {showQRModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <SoftCard palette={palette} style={{ maxWidth: '400px', padding: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>Notfall-QR-Code</div>
            <div style={{ fontSize: '12px', color: palette.mid, marginBottom: '16px', lineHeight: '1.5' }}>
              Scannen im Notfall. Enthält: Name, Telefon, Blutgruppe, Allergien, Medikamente, Notfallkontakt, Hausarzt.
            </div>
            <div style={{ background: palette.bg, padding: '16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
              <div id="qr-code" style={{ fontSize: '12px', color: palette.mid }}>
                QR wird geladen...
              </div>
            </div>
            <button onClick={() => setShowQRModal(false)} style={{ width: '100%', borderRadius: '6px', border: `1px solid ${palette.border}`, padding: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', background: palette.up, color: palette.text }}>
              Schliessen
            </button>
          </SoftCard>
        </div>
      )}

      {showQRModal && (
        <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" onLoad={() => {
          const qrContainer = document.getElementById('qr-code');
          if (qrContainer && window.QRCode) {
            qrContainer.innerHTML = '';
            new window.QRCode(qrContainer, {
              text: encryptQR(makeQRData()),
              width: 200,
              height: 200,
              colorDark: palette.text,
              colorLight: palette.bg,
            });
          }
        }} />
      )}
    </div>
  );
}

// ============================================================================
// AGB PAGE
// ============================================================================
function AGBPage() {
  const [darkMode, setDarkMode] = useState(true);
  const palette = darkMode ? DARK_PALETTE : LIGHT_PALETTE;

  return (
    <div style={{ minHeight: '100vh', background: palette.bg, color: palette.text, paddingBottom: '80px' }}>
      <header style={{ borderBottom: `1px solid ${palette.border}`, background: `${palette.surface}99` }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px' }}>
          <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} style={{ fontSize: '14px', color: palette.sand, cursor: 'pointer', textDecoration: 'underline' }}>
            ← Zurück zur App
          </a>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 16px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '32px', fontFamily: "'Cormorant Garamond', serif" }}>Allgemeine Geschäftsbedingungen</h1>

        <div style={{ fontSize: '14px', lineHeight: '1.8', color: palette.mid }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginTop: '28px', marginBottom: '12px', color: palette.text }}>1. Nutzung der Anwendung</h2>
          <p>Ordnung & Ruhe ist eine lokale Web-Anwendung für die Organisation persönlicher Dokumente und Informationen. Alle Daten werden lokal in Ihrem Browser gespeichert.</p>

          <h2 style={{ fontSize: '18px', fontWeight: '600', marginTop: '28px', marginBottom: '12px', color: palette.text }}>2. Keine Datenübertragung</h2>
          <p>Ihre Daten werden NICHT an Server übertragen. Keine Cloud, keine Speicherung auf fremden Servern. Sie bleiben vollständig auf Ihrem Gerät.</p>

          <h2 style={{ fontSize: '18px', fontWeight: '600', marginTop: '28px', marginBottom: '12px', color: palette.text }}>3. Keine Garantie</h2>
          <p>Die Anwendung wird "wie besehen" bereitgestellt. Wir übernehmen keine Haftung für Datenverlust durch Browser-Probleme oder Geräteschäden.</p>

          <h2 style={{ fontSize: '18px', fontWeight: '600', marginTop: '28px', marginBottom: '12px', color: palette.text }}>4. Ihre Verantwortung</h2>
          <p>Sie sind verantwortlich für die Sicherheit Ihres Geräts und Browsers. Sichern Sie Ihre Daten regelmäßig durch PDF-Export.</p>

          <h2 style={{ fontSize: '18px', fontWeight: '600', marginTop: '28px', marginBottom: '12px', color: palette.text }}>5. Lizenz</h2>
          <p>Der Code ist Open Source. Details siehe Open-Source-Seite.</p>

          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: `1px solid ${palette.border}`, fontSize: '12px', color: palette.mid }}>
            Stand: April 2026
          </div>
        </div>
      </main>
    </div>
  );
}

// Root render
const AppWrapper = () => {
  const [page, setPage] = useState('app');
  window.navigateTo = setPage;

  if (page === 'agb') return <AGBPage />;
  return <App />;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
// ZIP-Export für Datensicherung
import { getFullName, getChapters } from './config/constants.js';
import { betrag } from './utils/geld.js';
import { keineKontaktperson } from './utils/naGruppen.js';
import { inDays } from './utils/helpers.js';

export const prepareDataForExport = (data, docs = []) => {
  return {
    exportDate: new Date().toISOString(),
    version: '5.0',
    person: {
      name: getFullName(data.basis),
      email: data.basis?.email,
      phone: data.basis?.phone
    },
    chapters: {
      basis: data.basis,
      wohnen: data.wohnen,
      finanzen: data.finanzen,
      versicherungen: data.versicherungen,
      ausbildung: data.ausbildung,
      behoerden: data.behoerden,
      notfall: data.notfall
    },
    documents: {
      count: docs.length,
      list: docs.map(d => ({
        id: d.id,
        type: d.type,
        fileName: d.fileName,
        uploadDate: d.uploadDate,
        expiryDate: d.expiryDate,
        status: d.status
      }))
    }
  };
};

const generateZipManifest = (data, t) => {
  const m = (key, params) => t ? t('zipExport.manifest.' + key, params) : key;
  const dash = '—';
  // Bis 25.09.2026 schrieb der Text-Export Rohwerte: Auswahlfelder als Schlüssel («f2500»,
  // «yes», «handwritten»), Beträge ohne Trennung — und ein LEERES Feld als «CHF 0». «Nicht
  // erfasst» ist aber keine Null. Jetzt: Beschriftung aus derselben Kapiteldefinition wie das
  // Formular (getChapters), Beträge über utils/geld.js, Leeres als «—».
  const kapitel = t ? getChapters(t) : [];
  const wahl = (kap, k, wert, sonst = dash) => {
    if (wert === undefined || wert === null || wert === '') return sonst;
    const feld = kapitel.find((c) => c.key === kap)?.fields.find((f) => f.k === k);
    const opt = feld?.options?.find((o) => String(o.value) === String(wert));
    return opt ? opt.label : String(wert);
  };
  const geld = (wert, zusatz = '') => {
    if (wert === undefined || wert === null || String(wert).trim() === '') return dash;
    const n = Number(wert);
    return Number.isFinite(n) ? betrag(n, { hoechstens: 2 }) + zusatz : String(wert) + zusatz;
  };
  return `${m('header')}
═════════════════════════════════════════

${m('exportDate')}: ${new Date().toLocaleDateString('de-CH')} ${new Date().toLocaleTimeString('de-CH')}
${m('version')}: 5.0
${m('person')}: ${data.person.name}

${m('contents')}:
──────────────────────────

${m('chBasis')}
   - ${m('name')}: ${[data.chapters.basis?.firstName, data.chapters.basis?.middleName, data.chapters.basis?.lastName].filter(Boolean).join(' ') || data.chapters.basis?.fullName || dash}
   - ${m('dateOfBirth')}: ${data.chapters.basis?.dateOfBirth || dash}
   - ${m('ahv')}: ${data.chapters.basis?.ahv || dash}
   - ${m('phone')}: ${data.chapters.basis?.phone || dash}
   - ${m('email')}: ${data.chapters.basis?.email || dash}

${m('chWohnen')}
   - ${m('address')}: ${data.chapters.wohnen?.address || dash}
   - ${m('rent')}: ${geld(data.chapters.wohnen?.rentAmount, m('perMonth'))}
   - ${m('utilities')}: ${geld(data.chapters.wohnen?.utilities, m('perMonth'))}

${m('chFinanzen')}
   - ${m('monthlyIncome')}: ${geld(data.chapters.finanzen?.monthlyIncome)}
   - ${m('employer')}: ${data.chapters.finanzen?.employer || dash}
   - ${m('pillar3a')}: ${geld(data.chapters.finanzen?.pension3a, m('perYear'))}

${m('chVersicherungen')}
   - ${m('healthInsurer')}: ${data.chapters.versicherungen?.kkInsurer || dash}
   - ${m('premium')}: ${geld(data.chapters.versicherungen?.kkPremium, m('perMonth'))}
   - ${m('franchise')}: ${data.chapters.versicherungen?.franchise ? 'CHF ' + wahl('versicherungen', 'franchise', data.chapters.versicherungen.franchise) : dash}
   - ${m('bvg')}: ${geld(data.chapters.versicherungen?.bvgContribution, m('perMonth'))}

${m('chAusbildung')}
   - ${m('jobTitle')}: ${data.chapters.ausbildung?.jobTitle || dash}
   - ${m('employer')}: ${data.chapters.ausbildung?.employer || dash}
   - ${m('educationLevel')}: ${wahl('ausbildung', 'educationLevel', data.chapters.ausbildung?.educationLevel)}

${m('chBehoerden')}
   - ${m('taxCanton')}: ${data.chapters.behoerden?.cantoneOfTaxation || dash}
   - ${m('debtStatus')}: ${wahl('behoerden', 'betreibungsStatus', data.chapters.behoerden?.betreibungsStatus, m('unknown'))}
   - ${m('will')}: ${wahl('behoerden', 'willMade', data.chapters.behoerden?.willMade)}

${m('chNotfall')}
   - ${m('bloodType')}: ${wahl('notfall', 'bloodType', data.chapters.notfall?.bloodType)}
   - ${m('emergencyContact')}: ${data.chapters.notfall?.emergencyContact || (keineKontaktperson(data.chapters.notfall) && t ? t('naZustand.keineKontaktperson') : dash)}
   - ${m('allergies')}: ${data.chapters.notfall?.allergies || dash}
   - ${m('organDonor')}: ${wahl('notfall', 'organDonor', data.chapters.notfall?.organDonor, m('unknown'))}

${m('documents', { count: data.documents.count })}:
──────────────────────────────────────
${data.documents.list.map(d => `• ${d.type} — ${d.fileName} (${d.uploadDate})`).join('\n')}

${m('securityTitle')}:
────────────────────
- ${m('securityTip1')}
- ${m('securityTip2')}
- ${m('securityTip3')}
- ${m('securityTip4')}
- ${m('securityTip5')}

${m('moreInfo')}:
──────────────────────
Webseite: https://malojaplana.ch/
Kontakt: info@malojaplana.ch
Quellcode: https://github.com/steblerstudios/maloja-plana

════════════════════════════════════════
${m('copyright')}
`;
};

const createJSONBackup = (data, docs = []) => {
  const backup = {
    created: new Date().toISOString(),
    version: '5.0',
    data: data,
    documentMetadata: docs.map(d => ({
      id: d.id,
      type: d.type,
      fileName: d.fileName,
      fileSize: d.fileSize,
      uploadDate: d.uploadDate,
      expiryDate: d.expiryDate,
      status: d.status
    }))
  };
  
  return JSON.stringify(backup, null, 2);
};

// CSV-Formelschutz (Bau-Liste E14/O2, MP-089): Zellen, die mit `=` `+` `-` `@` Tab
// oder Wagenrücklauf beginnen, öffnet manche Tabellenkalkulation als Formel — die
// Zeile bekommt dann Zugriff auf Datei/Netz statt nur als Text zu erscheinen.
// Vorgehen nach OWASP «CSV Injection»: https://owasp.org/www-community/attacks/CSV_Injection
// (abgerufen 16.09.2026) — ein vorangestelltes `'` entschärft die Zelle, Tabellenprogramme
// zeigen es nicht an, lesen die Zelle aber als Text.
// Ausnahme: eine echte Zahl (auch negativ, z. B. "-120.50") bleibt unverändert — der Export
// schreibt Zahlen immer als reines `String(zahl)` ohne Tausendertrennzeichen (kein `+`, kein
// führendes `@`/Tab/CR), darum genügt eine einfache Ziffern-Regel, um sie von einer echten
// Formel-Gefahr zu unterscheiden.
const CSV_FORMULA_TRIGGER = /^[=+\-@\t\r]/;
const CSV_PLAIN_NUMBER = /^[+-]?\d+(\.\d+)?$/;

export const escapeCsvFormula = (value) => {
  const str = String(value ?? '');
  if (CSV_PLAIN_NUMBER.test(str)) return str;
  return CSV_FORMULA_TRIGGER.test(str) ? `'${str}` : str;
};

const generateCSVBackup = (data, t) => {
  const m = (key) => t ? t('zipExport.manifest.' + key) : key;
  const rows = [
    [m('csvCategory'), m('csvField'), m('csvValue')],
    // `_`-Schlüssel sind Verwaltungsfelder (`_version`, `_migratedAt`, je Kapitel `_na`),
    // keine Angaben — die CSV ist eine Wertetabelle. Die JSON-Sicherung behält sie (K38).
    ...Object.entries(data).filter(([chapter, fields]) => !chapter.startsWith('_') && fields && typeof fields === 'object').flatMap(([chapter, fields]) =>
      Object.entries(fields).filter(([key]) => !key.startsWith('_')).map(([key, value]) => [
        chapter.toUpperCase(),
        key,
        String(value || '')
      ])
    )
  ];

  return rows.map(row => row.map(cell => `"${escapeCsvFormula(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
};

export const prepareDownloadFiles = (data, docs = [], t) => {
  return {
    manifest: {
      filename: 'MANIFEST.txt',
      content: generateZipManifest(prepareDataForExport(data, docs), t)
    },
    json: {
      filename: `backup_${(getFullName(data.basis) || 'export').replace(/\s/g, '_')}_${inDays(0)}.json`,
      content: createJSONBackup(data, docs)
    },
    csv: {
      filename: `data_export_${inDays(0)}.csv`,
      content: generateCSVBackup(data, t)
    }
  };
};

export const initiateBrowserDownload = async (filename, content, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

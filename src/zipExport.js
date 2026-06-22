// ZIP-Export für Datensicherung
import { getFullName } from './config/constants.js';

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
   - ${m('rent')}: CHF ${data.chapters.wohnen?.rentAmount || '0'}${m('perMonth')}
   - ${m('utilities')}: CHF ${data.chapters.wohnen?.utilities || '0'}${m('perMonth')}

${m('chFinanzen')}
   - ${m('monthlyIncome')}: CHF ${data.chapters.finanzen?.monthlyIncome || '0'}
   - ${m('employer')}: ${data.chapters.finanzen?.employer || dash}
   - ${m('pillar3a')}: CHF ${data.chapters.finanzen?.pension3a || '0'}${m('perYear')}

${m('chVersicherungen')}
   - ${m('healthInsurer')}: ${data.chapters.versicherungen?.kkInsurer || dash}
   - ${m('premium')}: CHF ${data.chapters.versicherungen?.kkPremium || '0'}${m('perMonth')}
   - ${m('franchise')}: CHF ${data.chapters.versicherungen?.franchise || '0'}
   - ${m('bvg')}: CHF ${data.chapters.versicherungen?.bvgContribution || '0'}${m('perMonth')}

${m('chAusbildung')}
   - ${m('jobTitle')}: ${data.chapters.ausbildung?.jobTitle || dash}
   - ${m('employer')}: ${data.chapters.ausbildung?.employer || dash}
   - ${m('educationLevel')}: ${data.chapters.ausbildung?.educationLevel || dash}

${m('chBehoerden')}
   - ${m('taxCanton')}: ${data.chapters.behoerden?.cantoneOfTaxation || dash}
   - ${m('debtStatus')}: ${data.chapters.behoerden?.betreibungsStatus || m('unknown')}
   - ${m('will')}: ${data.chapters.behoerden?.willMade || m('no')}

${m('chNotfall')}
   - ${m('bloodType')}: ${data.chapters.notfall?.bloodType || dash}
   - ${m('emergencyContact')}: ${data.chapters.notfall?.emergencyContact || dash}
   - ${m('allergies')}: ${data.chapters.notfall?.allergies || dash}
   - ${m('organDonor')}: ${data.chapters.notfall?.organDonor || m('unknown')}

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
Webseite: https://steblerstudios.github.io/maloja-plana/
Kontakt: sophie.stebler@gmail.com
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

const generateCSVBackup = (data, t) => {
  const m = (key) => t ? t('zipExport.manifest.' + key) : key;
  const rows = [
    [m('csvCategory'), m('csvField'), m('csvValue')],
    ...Object.entries(data).flatMap(([chapter, fields]) =>
      Object.entries(fields).map(([key, value]) => [
        chapter.toUpperCase(),
        key,
        String(value || '')
      ])
    )
  ];
  
  return rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
};

export const prepareDownloadFiles = (data, docs = [], t) => {
  return {
    manifest: {
      filename: 'MANIFEST.txt',
      content: generateZipManifest(prepareDataForExport(data, docs), t)
    },
    json: {
      filename: `backup_${(getFullName(data.basis) || 'export').replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.json`,
      content: createJSONBackup(data, docs)
    },
    csv: {
      filename: `data_export_${new Date().toISOString().split('T')[0]}.csv`,
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

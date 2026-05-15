// ZIP-Export für Datensicherung

export const prepareDataForExport = (data, docs = []) => {
  return {
    exportDate: new Date().toISOString(),
    version: '5.0',
    person: {
      name: data.basis?.fullName,
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

export const generateZipManifest = (data) => {
  return `ORDNUNG & RUHE — DATENSICHERUNG
═════════════════════════════════════════

Exportdatum: ${new Date().toLocaleDateString('de-CH')} ${new Date().toLocaleTimeString('de-CH')}
Version: 5.0
Person: ${data.person.name}

INHALT DER DATENSICHERUNG:
──────────────────────────

1. PERSÖNLICHE DATEN (basis)
   - Name: ${data.chapters.basis?.fullName || '—'}
   - Geburtsdatum: ${data.chapters.basis?.dateOfBirth || '—'}
   - AHV: ${data.chapters.basis?.ahv || '—'}
   - Telefon: ${data.chapters.basis?.phone || '—'}
   - E-Mail: ${data.chapters.basis?.email || '—'}

2. WOHNEN & LEBEN (wohnen)
   - Adresse: ${data.chapters.wohnen?.address || '—'}
   - Miete: CHF ${data.chapters.wohnen?.rentAmount || '0'}/Monat
   - Nebenkosten: CHF ${data.chapters.wohnen?.utilities || '0'}/Monat

3. FINANZEN (finanzen)
   - Monatseinkommen: CHF ${data.chapters.finanzen?.monthlyIncome || '0'}
   - Employer: ${data.chapters.finanzen?.employer || '—'}
   - 3. Säule A: CHF ${data.chapters.finanzen?.pension3a || '0'}/Jahr

4. VERSICHERUNGEN (versicherungen)
   - Krankenkasse: ${data.chapters.versicherungen?.kkInsurer || '—'}
   - Prämie: CHF ${data.chapters.versicherungen?.kkPremium || '0'}/Monat
   - Franchise: CHF ${data.chapters.versicherungen?.franchise || '0'}
   - BVG: CHF ${data.chapters.versicherungen?.bvgContribution || '0'}/Monat

5. AUSBILDUNG (ausbildung)
   - Beruf: ${data.chapters.ausbildung?.jobTitle || '—'}
   - Arbeitgeber: ${data.chapters.ausbildung?.employer || '—'}
   - Höchster Abschluss: ${data.chapters.ausbildung?.educationLevel || '—'}

6. BEHÖRDEN (behoerden)
   - Steuerkanton: ${data.chapters.behoerden?.cantoneOfTaxation || '—'}
   - Betreibungsstatus: ${data.chapters.behoerden?.betreibungsStatus || 'Unbekannt'}
   - Testament: ${data.chapters.behoerden?.willMade || 'Nein'}

7. NOTFALL (notfall)
   - Blutgruppe: ${data.chapters.notfall?.bloodType || '—'}
   - Notfall-Kontakt: ${data.chapters.notfall?.emergencyContact || '—'}
   - Allergien: ${data.chapters.notfall?.allergies || '—'}
   - Organspender: ${data.chapters.notfall?.organDonor || 'Unbekannt'}

DOKUMENTE (${data.documents.count} Dateien):
──────────────────────────────────────
${data.documents.list.map(d => `• ${d.type} — ${d.fileName} (${d.uploadDate})`).join('\n')}

SICHERHEITSHINWEISE:
────────────────────
- Diese Datei enthält vertrauliche persönliche Daten
- Lagern Sie die ZIP-Datei sicher (z.B. mit Passwort verschlüsselt)
- Speichern Sie mehrere Kopien an unterschiedlichen Orten
- Testen Sie regelmäßig die Wiederherstellung
- Datenschutz beachten (DSGVO/Swiss DPA)

WEITERE INFORMATIONEN:
──────────────────────
Webseite: https://malojaplana.ch
Kontakt: support@malojaplana.ch
Dokumentation: https://docs.malojaplana.ch

════════════════════════════════════════
© 2026 Maloja Plana — Alle Rechte vorbehalten
`;
};

export const createJSONBackup = (data, docs = []) => {
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

export const generateCSVBackup = (data) => {
  const rows = [
    ['Kategorie', 'Feld', 'Wert'],
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

export const prepareDownloadFiles = (data, docs = []) => {
  return {
    manifest: {
      filename: 'MANIFEST.txt',
      content: generateZipManifest(prepareDataForExport(data, docs))
    },
    json: {
      filename: `backup_${data.basis?.fullName?.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.json`,
      content: createJSONBackup(data, docs)
    },
    csv: {
      filename: `data_export_${new Date().toISOString().split('T')[0]}.csv`,
      content: generateCSVBackup(data)
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

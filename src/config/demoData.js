// Demo data: Maria Muster, 34, Zürich
// Static dataset that triggers all syntheses. Never written to localStorage.

export const DEMO_DATA = {
  basis: {
    firstName: 'Maria',
    middleName: '',
    lastName: 'Muster',
    dateOfBirth: '1992-03-15',
    gender: 'female',
    nationality: 'swiss',
    canton: 'ZH',
    phone: '+41 76 432 18 95',
    email: 'maria.muster@example.ch',
    ahv: '756.1234.5678.97',
    maritalStatus: 'single',
    dependents: '0',
    household: { adults: 1, children: [], isRetired: false },
  },
  wohnen: {
    address: 'Langstrasse 42',
    postalCode: '8004',
    city: 'Zürich',
    moveInDate: '2021-08-01',
    rentAmount: '1650',
    utilities: '180',
    // F7-K1-2 (27.10.2026): ohne Zimmerzahl verglich der Mietbarometer mit «angenommen 3 Zimmer».
    rooms: '2.5',
    landlord: 'Steiner Immobilien AG',
    landlordPhone: '+41 44 312 55 00',
    mortgageStatus: '',
    propertyValue: '',
    buildingsInsurance: '',
    residenceType: 'main',
  },
  finanzen: {
    monthlyIncome: '6200',
    // Netto, damit Steuern, Sozialhilfe und Armutsgrenze in der Demo rechnen; ALV/EO/Vorsorge
    // zeigen dafür den Brutto-Hinweis. Ohne Art füllte seit #357 kein Rechner mehr vor
    // (Entscheid Stebler Studios 25.09.2026).
    incomeType: 'netto',
    // Auffüllen (19.11.2026, Stebler Studios: «Beispiel soll alles anzeigen»): 13. Monatslohn und Arbeitskanton,
    // damit Lohn-Einordnung und Mindestlohn-Frage eine Antwort zeigen statt einer Rückfrage.
    dreizehnter: 'yes',
    workCanton: 'ZH',
    employer: 'Kantonsspital Zürich',
    employmentType: 'employed',
    startDate: '2019-04-01',
    familienzulagen: '',
    alimenteReceived: '',
    monthlyTax: '850',
    groceries: '450',
    communication: '85',
    mobility: '120',
    otherInsurance: '',
    debtPayments: '',
    alimentePaid: '',
    savingsGoal: '500',
    savingsAccount: '18500',
    bankName: 'ZKB',
    creditCard: 'one',
    // Beispielwerte, nicht belegt: eine Karte mit üblicher Limite und einem kleinen offenen Saldo,
    // damit Kredit-Abschnitt und offene Posten etwas zeigen.
    creditCardLimit: '5000',
    creditCardBalance: '420',
    loans: '',
    // Das Feld zählt pro Jahr («CHF/Jahr»). Bis 19.11.2026 stand hier 250, gemeint war 250 im Monat
    // (Stebler Studios, 19.11.2026: «Ja, auf 250/Mt.») → 3’000 im Jahr, unter dem 3a-Höchstbetrag mit Pensionskasse.
    pension3a: '3000',
    // Beispielwert, nicht belegt: passt zu 3’000 / Jahr seit Stellenantritt 2019 (rund sieben Einzahlungen, etwas Zins).
    pension3aBalance: '21800',
    pension3b: '',
    investmentFunds: '',
  },
  versicherungen: {
    kkInsurer: 'CSS',
    kkModel: 'standard',
    // CSS, ZH Region 1, Standardmodell, Franchise 1’500, ohne Unfall (UVG über Arbeitgeber), Prämien 2026
    // (BAG/priminfo, data/praemienDetail.js). Bis 25.10.2026 stand hier 385 — unter jeder Referenzprämie.
    // ⚠️ Mit den Prämien 2027 nachziehen.
    kkPremium: '540.30',
    // Beispielwerte, keine Offerte: damit der Zusatz im Schild mit Betrag zu sehen ist (F7-K3-6, 31.10.2026).
    kkZusatz: 'Spital halbprivat',
    kkZusatzPremium: '38.50',
    // E-4 (Stebler Studios 01.11.2026): keine Lebensversicherung, damit das Beispiel zeigt, wie ein leerer Teil im Netz-Schild
    // aussieht. Sie ist freiwillig, das Feld bleibt blass und zählt nicht als Lücke (data/netzSchild.js).
    lifeInsurance: '',
    lifeInsurancePremium: '',
    franchise: 'f1500',
    kkCardNumber: '80756 012345678',
    policyNumber: 'CSS-2024-7788991',
    kkBelege: [
      { id: 'demo1', datum: '2026-03-12', betrag: 240, status: 'bezahlt', frist: '', nichtGedeckt: 0, eingereicht: true },
      { id: 'demo2', datum: '2026-05-04', betrag: 180, status: 'offen', frist: '2026-06-30', nichtGedeckt: 0, eingereicht: false },
    ],
    bvgInsurer: 'BVK Personalvorsorge',
    bvgContribution: '420',
    bvgBalance: '45000',
    ktg: 'employer',
    uvg: 'employer',
    liabilityInsurance: 'yes',
    // Beispielwerte, nicht belegt (Fachprüfung 25.10.2026): übliche Versicherungssumme und eine Prämie
    // aus der Marktspanne für eine Person (etwa 80–150 / Jahr). Bis 25.10.2026 stand hier '35' als «Summe».
    liabilityAmount: '5000000',
    liabilityPremium: '120',
    householdInsurance: 'yes',
    // Beispielwert, nicht belegt: Hausrat für 3 Zimmer in der Stadt Zürich etwa 150–350 / Jahr (bis 25.10.2026: 22).
    householdInsuranceAmount: '240',
    travelInsurance: 'TCS',
    legalInsurance: 'yes',
    cyberInsurance: '',
    autoInsurance: '',
    autoInsuranceAmount: '',
    ahvContribution: '',
  },
  ausbildung: {
    schoolName: 'ZHAW',
    educationLevel: 'bachelor',
    efzNumber: '',
    certifications: 'CAS Notfallpflege',
    employer: 'Kantonsspital Zürich',
    jobTitle: 'Pflegefachfrau FH',
    branche: 'gesundheit',
    employmentStart: '2019-04-01',
    workPermit: 'swiss',
    workHoursPerWeek: '42',
    languages: 'Deutsch, Englisch, Französisch',
  },
  behoerden: {
    cantoneOfTaxation: 'ZH',
    taxId: 'ZH-2024-123456',
    // Steuererklärung 2026 im Kanton Zürich: einzureichen bis 31. März 2027 (Kantonales Steueramt Zürich,
    // ZStB Nr. 133.1 «Aufforderung zur Einreichung von Steuererklärungen … im Jahr 2027»,
    // https://www.zh.ch/content/dam/zhweb/bilder-dokumente/themen/steuern-finanzen/steuern/vertreter/steuerbuch/zstb-nr-133-1/ZStB-Nr-133-1_Aufforderung-2027.pdf).
    // Bis 25.10.2026 stand hier 30.09.2026 — im Beispiel schon vorbei. Die Erklärung 2025 ist eingereicht (0 offen).
    taxFilingDeadline: '2027-03-31',
    pendingTaxReturns: '0',
    registryOffice: 'Kreisbüro 4',
    betreibungsStatus: 'none',
    courtCases: 'no',
    legalRepresentative: '',
    representativePhone: '',
    willMade: 'no',
  },
  notfall: {
    emergencyContact: 'Peter Muster',
    emergencyPhone: '+41 79 654 32 10',
    bloodType: 'aPos',
    allergies: 'Penicillin',
    medications: '',
    // Ein Eintrag, damit das Beispiel kein leeres Feld zeigt und der SL-Preis sichtbar wird (F7-K6-2, 27.10.2026).
    medicationsList: [{ name: 'Euthyrox', substance: 'Levothyroxin', dose: '50', unit: 'µg', frequency: ['morgens'], notes: '' }],
    // Passt zum Euthyrox in der Medikamentenliste (Levothyroxin ist das übliche Mittel dagegen).
    chronicDiseases: 'Schilddrüsenunterfunktion (Hypothyreose)',
    // Hausarzt in der Liste, die das Kapitel zeigt (DoctorManager). Das alte Feld bleibt für Dossier,
    // Notfallkarte und Rucksack, die noch nur `doctor` lesen — ohne Liste erschien das Beispiel als
    // «Früherer Eintrag» unter einer leeren Liste (Seitenrundgang 27.09., K-F6).
    doctorsList: [{ name: 'Dr. med. Lisa Brunner', specialty: 'hausarzt', phone: '+41 44 242 80 00' }],
    doctor: 'Dr. med. Lisa Brunner',
    doctorPhone: '+41 44 242 80 00',
    hospital: 'UniversitätsSpital Zürich',
    organDonor: 'yes',
    patientenverfuegung: 'no',
    vorsorgeauftrag: 'no',
    bestattungswuensche: 'no',
  },
};

// Beispiel-Dokumente (19.11.2026): ohne sie war die Ablage im Beispiel leer. Gleiche Form wie ein
// Upload im Kapitel (ChapterView), Datei inline wie im Beispiel-Modus üblich (docBlobs.js, K24).
// Der Inhalt ist ein kurzer Text, keine echte Urkunde — darum .txt, nicht .pdf.
const beispielDatei = (titel) =>
  'data:text/plain;charset=utf-8,' + encodeURIComponent(`Beispieldokument: ${titel}\nMaria Muster, Beispiel-Modus von Maloja Plana.\nKeine echte Urkunde.`);
const dok = (id, chapter, type, fileName, titel, expiryDate) => ({
  id: 'demo-dok-' + id, chapter, type, fileName, fileSize: '0.1 KB',
  uploadDate: '01.10.2026', expiryDate, status: 'active', data: beispielDatei(titel),
});

// Ein Datum relativ zu heute, damit «Bald fällig» im Beispiel nicht mit der Zeit verschwindet.
// Ohne Ablaufdatum fiele ein Dokument in kein Fach (DocumentTresor.jsx imFach), darum hat jedes eins.
const inTagen = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

export const DEMO_DOCS = [
  // Läuft in 60 Tagen ab: zeigt das Fach «Bald fällig» (unter 90 Tagen).
  dok('id', 'basis', 'id', 'Identitaetskarte_Beispiel.txt', 'Identitätskarte', inTagen(60)),
  // Abgelaufen: zeigt das Archiv.
  dok('kk-alt', 'versicherungen', 'kkcard', 'Krankenkassenkarte_alt_Beispiel.txt', 'Alte Krankenkassenkarte', '2025-12-31'),
  dok('lease', 'wohnen', 'lease', 'Mietvertrag_Langstrasse_Beispiel.txt', 'Mietvertrag', '2031-07-31'),
  dok('tax', 'finanzen', 'tax_return', 'Steuererklaerung_2025_Beispiel.txt', 'Steuererklärung 2025', '2036-12-31'),
  dok('kk', 'versicherungen', 'kkcard', 'Krankenkassenkarte_CSS_Beispiel.txt', 'Krankenkassenkarte', '2028-12-31'),
  dok('bvg', 'versicherungen', 'bvg_cert', 'BVK_Vorsorgeausweis_2026_Beispiel.txt', 'Vorsorgeausweis 2026', '2027-12-31'),
  dok('diplom', 'ausbildung', 'diploma', 'Bachelor_Pflege_ZHAW_Beispiel.txt', 'Bachelor-Diplom', '2099-12-31'),
];

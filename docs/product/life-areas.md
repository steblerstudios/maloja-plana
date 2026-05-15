# Swiss Life Areas

Maloja Plana organizes real life into domains that reflect how people in Switzerland actually encounter administration, documents, and deadlines.

## 1. Arrival & Residence

**Current chapters**: basis, behoerden  
**Key documents**: residence permit (B/C/F/L/N), passport, ID, registration confirmation  
**Key deadlines**: permit renewal, registration within 14 days of moving  
**Key contacts**: Migrationsamt, Einwohnerkontrolle, Gemeinde  
**Future templates**: permit renewal application, registration form preparation  
**MVP scope**: document storage, expiry reminders, contact references

## 2. Health & Insurance

**Current chapters**: versicherungen, notfall  
**Key documents**: KK card, KVG policy, supplementary insurance, Patientenverfügung  
**Key deadlines**: franchise change (November), premium payment, policy renewal  
**Key contacts**: Krankenkasse, doctor, dentist, pharmacy, emergency contacts  
**Key calculations**: IPV eligibility, franchise optimization, premium comparison orientation  
**Future templates**: insurance change letter, IPV application preparation  
**MVP scope**: KK data entry, premium subsidy check, emergency info

## 3. Housing

**Current chapters**: wohnen  
**Key documents**: rental contract, Wohnungsabnahmeprotokoll, Nebenkostenabrechnung  
**Key deadlines**: rent payment, lease termination notice (3 months), Nebenkosten deadline  
**Key contacts**: landlord, Hausverwaltung, Mieterschutz  
**Key benefits**: Mietbeiträge (housing subsidies, expanding to 1-2 person households)  
**Future templates**: Kuendigung, Mietreduktionsbegehren, damage documentation  
**MVP scope**: rent and utilities tracking, landlord contact

## 4. Work & Unemployment

**Current chapters**: ausbildung, finanzen  
**Key documents**: Arbeitsvertrag, Lohnausweis, Arbeitsbescheinigung, RAV registration  
**Key deadlines**: probation period end, notice periods, RAV reporting dates  
**Key contacts**: employer, RAV, Arbeitslosenkasse, Berufsberatung  
**Key rules**: GAV/LGAV minimum wage by sector, notice periods by employment duration  
**Future templates**: resignation letter, RAV registration preparation, reference request  
**MVP scope**: employment data, income tracking

## 5. Taxes & Finances

**Current chapters**: finanzen, behoerden  
**Key documents**: Steuererklaerung, Lohnausweis, Veranlagungsverfuegung, Verlustscheine  
**Key deadlines**: tax filing (varies by canton), extension requests, payment deadlines  
**Key contacts**: Steueramt, Treuhaender, Betreibungsamt  
**Key complexity**: cantonal variation, Quellensteuer vs ordentliche Veranlagung, social support recipients may have simplified obligations  
**Future templates**: tax extension request, Ratenzahlung request, Einsprache  
**MVP scope**: basic tax estimation, debt tracking (SchuldenManager)

## 6. Family & Civil Status

**Current chapters**: basis  
**Key documents**: marriage certificate, birth certificates, Familienbuechlein, custody agreements  
**Key deadlines**: Kinderzulage application, school registration  
**Key contacts**: Zivilstandsamt, family doctor, school administration, KESB  
**Key benefits**: Familienzulagen, Kinderbetreuungszuschüsse  
**Future templates**: Kinderzulage application, civil status change notification  
**MVP scope**: dependents field, family contact references

## 7. Emergency & Future Planning

**Current chapters**: notfall  
**Key documents**: Patientenverfuegung, Vorsorgeauftrag, Bestattungsverordnung, organ donor card  
**Key deadlines**: document review (annually recommended), municipality registration  
**Key contacts**: emergency contacts, family doctor, KESB, Bestattungsamt  
**Key workflows**: create/upload Vorsorge documents, register with municipality, QR emergency card  
**MVP scope**: emergency hub, organ donation, QR code generation

## 8. Privacy & Trust

**Cross-cutting concern**, not a chapter  
**Key documents**: data export, encrypted backup, consent records  
**Key principles**: local-first, no cloud, no accounts, encrypted backup, user ownership  
**Key workflows**: regular backup reminders, data portability, pre-restore snapshots  
**MVP scope**: encrypted backup/export (Phase 5, done), data validation

## Domain-to-Chapter Mapping

| Domain | Primary Chapter(s) | Future Modules |
|--------|--------------------|----------------|
| Arrival & Residence | basis, behoerden | Templates |
| Health & Insurance | versicherungen, notfall | Protection Logic, KK Scanner |
| Housing | wohnen | Inventory, Mietbeitraege |
| Work & Unemployment | ausbildung, finanzen | Templates, GAV hints |
| Taxes & Finances | finanzen, behoerden | Budget Guidance, Tax Calc |
| Family & Civil Status | basis | Household Model |
| Emergency & Future Planning | notfall | Vorsorge workflows |
| Privacy & Trust | (cross-cutting) | Encryption, Data Validation |

# ADR-010 — OCR Engine Selection: Tesseract.js (Offline-First)

| Meta | Value |
|------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-17 |
| **Deciders** | Stebler Studios |
| **Relates to** | ADR-001 (Offline-First), GAP-09, GAP-10, DOC-002, DOC-003 |

---

## Context

The Krankenkassen-Scanner and document management features require OCR (Optical Character Recognition) to extract text from scanned documents, receipts, and health insurance forms. Key constraints:

- Must work offline (ADR-001)
- Zero new runtime dependencies in core bundle (build budget)
- Swiss document formats (multilingual: DE/FR/IT)
- Sensitive health and financial data (cannot send to cloud by default)
- Target accuracy: > 90% for printed text on standard forms

---

## Decision

**Tesseract.js v5 as lazy-loaded module** with the following architecture:

### Loading Strategy

```
Core Bundle (< 250KB gzip)
  → Does NOT include Tesseract
  → OCR feature shows "Download Scanner" button

User activates Scanner (first use):
  → Downloads Tesseract.js core (~300KB)
  → Downloads language data (per language, ~2-4MB each)
  → Cached in IndexedDB for offline reuse
  → All subsequent uses: instant from cache
```

### Why This Doesn't Violate Zero-Dependency Constraint

- Tesseract.js is **not** a build-time dependency
- It's loaded as a **user-initiated runtime asset** (like a font or image)
- Core app functions without it — it's an optional enhancement
- Cached locally after first download — works offline thereafter

### Implementation Architecture

```
┌─────────────────────────────────────────────┐
│           OCR Module (lazy-loaded)            │
├─────────────────────────────────────────────┤
│  Scanner UI        │  Tesseract.js Worker    │
│  - Camera capture  │  - Web Worker (off-main)│
│  - File upload     │  - Language models      │
│  - Crop/rotate     │  - Recognition engine   │
├─────────────────────────────────────────────┤
│           Post-Processing Pipeline           │
│  - Text cleanup    │  - Field extraction     │
│  - Swiss formats   │  - Confidence scoring   │
│  - Auto-tagging    │  - Budget linking       │
├─────────────────────────────────────────────┤
│           Storage (encrypted)                │
│  - Raw scan → ordnung-ruhe-documents        │
│  - Extracted data → structured fields       │
│  - Evidence → maloja-plana-audit            │
└─────────────────────────────────────────────┘
```

### Swiss Document Recognition

| Document Type | Fields to Extract | Format |
|---------------|-------------------|--------|
| KVG-Rechnung | Betrag, Datum, Leistungserbringer, Franchise | CHF, DD.MM.YYYY |
| Lohnauszug | Brutto, Netto, AHV-Nr, Abzüge | CHF, AHV-Format |
| Mietvertrag | Mietzins, Nebenkosten, Kündigungsfrist | CHF/Monat |
| Steuererklärung | Einkommen, Vermögen, Abzüge | CHF, Steuerjahr |
| Arztrechnung | Taxpunkte, Betrag, Diagnose-Code | TARMED |

### Post-Processing (Field Extraction)

```javascript
// Pattern matching for Swiss formats (zero-dependency)
const SWISS_PATTERNS = {
  amount: /CHF\s*[\d']+\.\d{2}/g,
  date: /\d{2}\.\d{2}\.\d{4}/g,
  ahv: /756\.\d{4}\.\d{4}\.\d{2}/g,
  phone: /(\+41|0)\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}/g,
  iban: /CH\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{1}/g
};
```

---

## Alternatives Considered

| Option | Accuracy | Offline | Size | Privacy | Verdict |
|--------|----------|---------|------|---------|---------|
| **Tesseract.js** | 85-95% (printed) | Yes (after cache) | ~4MB cached | Full (local) | **Selected** |
| **Google Cloud Vision** | 98%+ | No | 0 (API) | No (data leaves device) | Rejected (privacy) |
| **AWS Textract** | 97%+ | No | 0 (API) | No | Rejected (privacy + cost) |
| **Apple Vision (on-device)** | 95%+ | Yes | 0 (native) | Yes | iOS only, not web |
| **Custom ONNX model** | Variable | Yes | 5-20MB | Yes | Too much maintenance |
| **No OCR (manual input)** | N/A | Yes | 0 | Yes | Poor UX for target users |

---

## Accuracy Mitigation

Tesseract.js accuracy (85-95%) is lower than cloud services. Mitigation:

1. **Pre-processing pipeline** (Canvas API, zero deps):
   - Auto-crop whitespace
   - Deskew (rotation correction)
   - Binarization (Otsu's method)
   - Noise reduction (median filter)

2. **Confidence scoring**:
   - Each extracted field gets a confidence score (0-100)
   - Fields below 70% flagged for manual verification
   - User confirms/corrects via Approval Gate

3. **Template matching** (for known document types):
   - Swiss health insurance forms have predictable layouts
   - Region-of-interest extraction improves accuracy
   - Pre-defined field positions per document type

4. **User feedback loop**:
   - Corrections improve future recognition (stored locally)
   - No AI/ML training — pure pattern matching improvement

---

## Consequences

### Positive
- Full privacy — documents never leave device
- Works offline after initial language download
- No recurring API costs
- Swiss format recognition built-in
- User maintains full control (Approval Gate for extracted data)

### Negative
- Lower accuracy than cloud services (mitigated by verification flow)
- Initial download required (~4MB per language)
- Handwritten text recognition is poor (acknowledged limitation)
- Processing time: 2-5 seconds per page (acceptable for target use case)

### Risks
- Tesseract.js maintenance/abandonment (mitigated: it's the most popular OSS OCR, active community)
- Complex document layouts may fail (mitigated: template-based extraction for common Swiss forms)
- Storage growth from cached scans (mitigated: retention policy, user-managed cleanup)

---

## Compliance

| Standard | Requirement | How Met |
|----------|------------|---------|
| ISO 27001 A.18 | Data residency | All processing local, no data transfer |
| DSGVO Art. 5 | Data minimization | Only extract needed fields, user confirms |
| DSG (Schweiz) | Sensitive data protection | Health data never leaves device |
| EU AI Act Art. 13 | Transparency | Confidence scores visible, no hidden automation |
| EU AI Act Art. 14 | Human oversight | Approval Gate before any extracted data is saved |

---

## Action Items

1. Create `OcrModule` with lazy-loading wrapper
2. Implement pre-processing pipeline (Canvas API)
3. Build Swiss document template library (KVG, Lohn, Miete)
4. Design confidence UI with clear "verify" interaction
5. Implement IndexedDB cache for Tesseract worker + language data
6. Add language data download progress indicator
7. Create fallback UI for browsers without Web Worker support

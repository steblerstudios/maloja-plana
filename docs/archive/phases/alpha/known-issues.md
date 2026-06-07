# Known Issues

## Critical

### KI-001: SKOS Household Composition Bug
- **Location**: `src/config/cantonalData.js` line 192
- **Description**: `householdSize = 1 + Number(dependents)` treats all dependents as adults. SKOS tables have different rates for different compositions.
- **Impact**: Social support calculation is incorrect for households with children.
- **Workaround**: None — users must manually look up correct SKOS rates.
- **Fix**: Phase 9 (Household Model) + Phase 14

### KI-002: BVG Double Deduction — RESOLVED
- **Location**: `src/budgetSync.js`, `src/BudgetSync.jsx`, `src/TaxCalculator.jsx`
- **Description**: If user enters net salary (after BVG deduction), the app subtracted BVG again as a separate expense.
- **Impact**: Budget calculations understated available income.
- **Resolution**: BVG/AHV moved to `budget.reference` (not counted in `totalExpenses`). Field hints added. TaxCalculator label corrected. Commit `4cb226f`.
- **Status**: Fixed (2026-05-16)

## Important

### KI-003: AHV Number Duplication — PARTIALLY RESOLVED
- **Location**: `src/KKScanner.jsx`, `src/main.jsx`
- **Description**: KK Scanner duplicated entry for AHV, franchise, insurer, card number, and model. Only insurer was persisted; all other scanner fields were lost on navigation.
- **Resolution**: Scanner now autofills from canonical chapter data and persists all fields back on save. AHV writes to `basis.ahv` only if empty (privacy rule). Commit `ae1184f`.
- **Remaining**: Conflict warnings when scanned values differ from existing data, AHV display masking (future Slice C).
- **Status**: Partially fixed (2026-05-16)

### KI-004: Hardcoded German in cantonalData.js
- **Location**: `src/config/cantonalData.js`
- **Description**: Return values contain German strings that bypass the i18n system.
- **Impact**: Non-German speakers see German in calculation results.
- **Workaround**: None.
- **Fix**: Phase 6 (i18n implementation)

### KI-005: QR Code External CDN Dependency
- **Location**: QR code generation in EmergencyHub/OrganDonation
- **Description**: Loads `qrcodejs` from cdnjs.cloudflare.com — the only external runtime dependency.
- **Impact**: QR generation fails offline; minor privacy concern (CDN request).
- **Workaround**: Generate QR codes while online.
- **Fix**: Phase 15 (vendor the library)

### KI-006: Single SKOS Table (National Only)
- **Location**: `src/config/cantonalData.js`
- **Description**: Only national SKOS values are modeled. Canton-specific values (e.g., Basel-Stadt CHF 1061 vs national CHF 1031) are not supported.
- **Impact**: Calculations may be inaccurate for cantons with different rates.
- **Workaround**: Users should verify with their cantonal social services.
- **Fix**: Phase 13 (Canton-specific values)

## Minor

### KI-007: No Web Crypto Fallback
- **Location**: `src/utils/backupCrypto.js`
- **Description**: Encrypted export is disabled if `window.crypto.subtle` is unavailable (very old browsers, non-HTTPS).
- **Impact**: Users on unsupported browsers cannot use encrypted export. Plaintext export remains available.
- **Workaround**: Use a modern browser or HTTPS.
- **Fix**: Low priority — affected browsers are rare.

### KI-008: Auto-save 5-Second Interval
- **Location**: `src/main.jsx`
- **Description**: Auto-save writes to localStorage every 5 seconds regardless of whether data changed.
- **Impact**: Minor performance concern on very low-end devices. No data risk.
- **Workaround**: None needed.
- **Fix**: Phase 15 (dirty-flag optimization)

# Known Issues

## Critical

### KI-001: SKOS Household Composition Bug
- **Location**: `src/config/cantonalData.js` line 192
- **Description**: `householdSize = 1 + Number(dependents)` treats all dependents as adults. SKOS tables have different rates for different compositions.
- **Impact**: Social support calculation is incorrect for households with children.
- **Workaround**: None — users must manually look up correct SKOS rates.
- **Fix**: Phase 9 (Household Model) + Phase 14

### KI-002: BVG Double Deduction
- **Location**: Income calculation logic
- **Description**: If user enters net salary (after BVG deduction), the app may subtract BVG again as a separate field.
- **Impact**: Budget calculations understate available income.
- **Workaround**: Users should be aware that net salary already includes BVG deduction.
- **Fix**: Phase 14 (Gross/Net salary distinction)

## Important

### KI-003: AHV Number Duplication
- **Location**: `src/config/constants.js` (basis.ahv), `src/KKScanner.jsx` (form state)
- **Description**: AHV number stored at `basis.ahv` but also requested in KK Scanner. Scanner form data is component state (lost on navigation). Only `kkInsurer` is written back.
- **Impact**: User enters AHV twice; scanner copy is ephemeral.
- **Workaround**: None needed currently — scanner AHV is not persisted.
- **Fix**: Phase 7 or 14 (auto-fill from existing data)

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

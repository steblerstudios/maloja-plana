# Manual QA — Core Input Trust

## Goal
Verify that the input trust slice is safe, calm, and store-foundation ready.

## Test setup
- Use local dev build.
- Test with empty data first.
- Test again with existing saved data.
- Do not delete existing storage unless explicitly testing reset behavior.

## Date reset
- Select a date.
- Save or leave the field.
- Clear/reset the date.
- Expected: no old date remains visually visible.
- Expected: stored value and visible value match.

## Email
Test:
- ` TEST@EXAMPLE.COM `
- `sophie+test@example.ch`
- `wrong-email`
- empty value

Expected:
- valid email is trimmed and normalized where safe.
- invalid email gives calm feedback.
- empty optional email does not create alarming error.

## Phone
Test:
- `0791234567`
- `+41791234567`
- `0041791234567`
- `+49 151 23456789`
- invalid short number

Expected:
- country code is accepted.
- Swiss numbers are displayed cleanly.
- non-Swiss numbers are not corrupted.
- invalid values get calm feedback.

## AHV
Test:
- `7561234567897`
- `756.1234.5678.97`
- invalid length
- letters mixed in

Expected:
- AHV is formatted consistently.
- invalid AHV is not silently accepted.
- no legal/official certainty claim is made.

## Address
- Existing address behavior still works.
- No regression in postal code/city/canton behavior.

## Regression checks
- npm run build passes.
- Existing saved data still loads.
- Mobile layout remains usable.
- No new runtime dependencies unless justified.
- No backend/cloud/network behavior added.

## Pass condition
This slice passes only if inputs feel safer without making the app more stressful.

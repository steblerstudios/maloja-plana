# Claude Done Check

Before commit, verify:

- Only intended files changed
- No docs added unless necessary
- No dependency added
- No migration added
- No localStorage key changed
- Date clear/reset visually empties the field
- Email trims and lowercases safely
- Phone accepts +41 and common Swiss spacing
- AHV displays as 756.XXXX.XXXX.XX
- Invalid values show existing i18n validation messages
- npm run build passes

Then commit exactly:

feat: improve trust and validation for core inputs

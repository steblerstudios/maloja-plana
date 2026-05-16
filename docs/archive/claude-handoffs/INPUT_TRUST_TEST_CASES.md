# Input Trust Test Cases

## Date reset bug
- Set a date in any date field.
- Save/leave field.
- Clear/reset the date.
- Expected: the visible date disappears.
- Expected: saved value is empty/null.
- Must not show previous selected date.

## Email
Test inputs:
- ` SOPHIE@EXAMPLE.COM `
- `test.user+demo@gmail.com`
- `not-an-email`
- empty field

Expected:
- trim whitespace
- lowercase email
- accept valid emails
- gently flag invalid email
- empty remains allowed if field is optional

## Phone
Test inputs:
- `0791234567`
- `+41791234567`
- `0041791234567`
- `+49 171 1234567`
- `abc123`

Expected:
- allow country code
- clean spacing
- do not destroy user input while typing
- invalid letters should be handled calmly

## AHV
Test inputs:
- `7561234567897`
- `756.1234.5678.97`
- `123`
- empty field

Expected:
- Swiss AHV display format if possible
- preserve digits safely
- gently flag impossible format
- no legal certainty claims

## Regression
- Address fields still behave as before.
- Existing stored data still loads.
- Build passes.

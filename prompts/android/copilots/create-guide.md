---
title: Goally Guide creation journeys
feature: copilots
journey: create-guide
platform: android
generated_test: generated-tests/android/copilots/create-guide.e2e.js
page_objects:
  - welcome.page
  - provider-selection.page
  - email-login.page
  - otp-verification.page
  - home.page
  - copilots.page
  - guide-template-search.page
  - copilot-copied-modal.page
tags:
  - copilots
  - create-guide
  - otp
---

## Shared Context

- This spec covers creating a Goally Guide after the owner has logged in to the Goally Parent Android app.
- Generated tests are artifacts and should be regenerated from this file instead of hand-edited.

## Shared Rules

- Keep assertions in the generated spec and keep screen actions in page objects.
- Reuse `tests/utils/otp.prompt.js` for manual OTP entry.
- Do not fetch OTP automatically.
- Prompt with the exact text `Please enter the OTP from email: `.
- Keep the flow fast by relying on stable waits rather than fixed sleeps.

## Shared Test Data

- Owner email: `usama@goally.co`
- App package: `com.mygoally.mygoally`
- Guide search term: `clothes`
- Guide customization: `Customize for Bully`
- Confirmation button: `Okay`

## Scenario: Create a Goally Guide after owner login

### Goal

- Confirm an account owner can log in with an emailed OTP and create a Goally Guide from the CoPilots area.

### Steps

1. Complete the owner manual OTP login journey.
2. Open the CoPilots area from the home screen.
3. Start the create flow and choose the customize guide option.
4. Search for the target guide and continue into the customization screen.
5. Confirm the copied modal and dismiss it.

### Assertions

- The home screen is visible after login.
- The CoPilots screen exposes the Create entry point.
- The copied confirmation modal appears and can be dismissed.

### Notes

- flow: owner_manual_otp_login
- flow: open_copilots_from_home
- flow: create_guide_from_copilots

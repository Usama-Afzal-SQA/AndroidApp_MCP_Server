---
title: Goally owner login journeys
feature: auth
journey: login
platform: android
generated_test: generated-tests/android/auth/login.e2e.js
page_objects:
  - welcome.page
  - provider-selection.page
  - email-login.page
  - otp-verification.page
  - home.page
  - copilots.page
tags:
  - auth
  - login
  - otp
---

## Shared Context

- This spec covers owner email login journeys for the Goally Parent Android app.
- Generated tests are artifacts and should be regenerated from this file instead of hand-edited.

## Shared Rules

- Keep assertions in the generated spec and keep screen actions in page objects.
- Reuse `tests/utils/otp.prompt.js` for manual OTP entry.
- Do not fetch OTP automatically.
- Prompt with the exact text `Please enter the OTP from email: `.
- Wait for the splash transition by waiting for the next stable screen instead of fixed sleeps.

## Shared Test Data

- Owner email: `usama@goally.co`
- App package: `com.mygoally.mygoally`

## Scenario: Manual OTP login reaches the home screen

### Goal

- Confirm an account owner can log in with an emailed OTP and land on the home screen.

### Steps

1. Launch the installed Android app from a clean state.
2. Continue through the owner and provider selection screens.
3. Submit the owner email address.
4. Enter the OTP manually when prompted in the terminal.
5. Wait for the first stable home screen element.

### Assertions

- The home screen is visible after the OTP is submitted.

### Notes

- flow: owner_manual_otp_login

## Scenario: Manual OTP login opens the CoPilots area

### Goal

- Confirm the same owner login journey can continue into the CoPilots area after reaching the home screen.

### Steps

1. Complete the owner manual OTP login journey.
2. Open the CoPilots entry point from the home screen.
3. Wait for the CoPilots screen to load.

### Assertions

- The home screen is visible after login.
- The CoPilots screen exposes the Create entry point.

### Notes

- flow: owner_manual_otp_login
- flow: open_copilots_from_home

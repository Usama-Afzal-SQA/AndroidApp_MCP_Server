---
title: Behaviour recording journeys
feature: rules
journey: record-behaviour
platform: android
generated_test: generated-tests/android/rules/record-behaviour.e2e.js
page_objects:
  - welcome.page
  - provider-selection.page
  - email-login.page
  - otp-verification.page
  - home.page
  - rules.page
  - record-behaviour.page
tags:
  - rules
  - behaviour
  - record-behaviour
  - otp
---

## Shared Context

- This spec covers recording a child's behaviour from the Rules area in the Goally Parent Android app.
- The flow should start from a logged-in owner session and continue only after the post-login survey modal is no longer blocking the home screen.
- Generated tests are artifacts and should be regenerated from this file instead of hand-edited.

## Shared Rules

- Keep assertions in the generated spec and keep screen actions in page objects.
- Reuse `tests/utils/otp.prompt.js` for manual OTP entry.
- Do not fetch OTP automatically.
- Prompt with the exact text `Please enter the OTP from email: `.
- Match the exact visible button texts `Rules` and `Confirm`.
- Treat the bottom sheet as the confirmation step for recording behaviour.

## Shared Test Data

- Owner email: `usama@goally.co`
- App package: `com.mygoally.mygoally`
- Rules entry label: `Rules`
- Confirmation button: `Confirm`

## Scenario: Record behaviour from the Rules section

### Goal

- Confirm an account owner can navigate to the Rules area and record a behaviour for their child.

### Steps

1. Complete the owner manual OTP login journey and land on the home screen.
2. Dismiss the survey modal if it is visible so the home screen is fully interactive.
3. Scroll down until the Rules section is visible.
4. Open the Rules area by tapping the button labeled `Rules`.
5. On the Rules screen, tap the `rec` button shown to the left of the first tile.
6. Wait for the confirmation dialog to appear from the bottom of the screen.
7. Tap the `Confirm` button in that dialog.

### Assertions

- The owner reaches the home screen successfully after login.
- The Rules entry point is visible and can be opened.
- The Rules screen exposes the `rec` action for the first tile.
- The confirmation dialog appears after tapping `rec`.
- The behaviour is recorded after confirming the dialog.

### Notes

- flow: owner_manual_otp_login
- flow: open_rules_from_home
- flow: record_behaviour_from_rules
- Reuse the existing owner manual OTP login flow before starting the Rules interaction.
- Prefer stable visible text and accessibility selectors over XPath where possible.
- Identify the first visible rule tile and target its left-side `rec` action.

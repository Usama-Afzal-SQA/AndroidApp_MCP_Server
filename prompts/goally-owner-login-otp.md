# Codex MCP prompt: Goally owner login with manual OTP

Use the Appium MCP server to inspect the live Android UI on my connected real device and generate a Page Object Model based end-to-end test for the Goally Parent app.

Repository rules:

- Use CommonJS.
- Put page objects in `tests/pageobjects`.
- Put the spec in `tests/specs`.
- Reuse `tests/utils/otp.prompt.js` for the OTP entry step.
- Do not fetch OTP automatically.
- Prompt in the terminal with the exact text `Please enter the OTP from email: ` and wait for manual input.
- Prefer stable selectors first. When I specify exact visible button text, match that exact text.
- Keep assertions in the spec and screen actions in the page objects.

Execution target:

- Start an Appium session on Android.
- Use the connected real device.
- Launch package `com.mygoally.mygoally`.

Flow to automate:

1. Start an Appium session on my real Android device and launch the Goally Parent app.
2. Wait for the splash screen to disappear automatically and wait until the first post-splash screen is visible.
3. On the first screen, tap the button with exact visible text `Goally account owner`.
4. On the next screen, tap the button with exact visible text `Getgoally.com`.
5. On the email screen, tap the email input field, enter `usama@goally.co`, and tap the button with exact visible text `Continue`.
6. On the OTP screen, wait until the OTP input UI is visible, then use `promptForOtp` from `tests/utils/otp.prompt.js` to ask `Please enter the OTP from email: `, enter the OTP, and submit it.
7. Verify login success by asserting the main or home screen is visible using one stable post-login element.

Output requirements:

- Create or update the required page objects.
- Create a single end-to-end spec for this flow.
- Use clear method names that reflect each screen.
- If the screen structure suggests it, split the flow across multiple page objects rather than forcing everything into one file.

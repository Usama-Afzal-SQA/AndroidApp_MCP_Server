# Codex Project Instructions

Use the `appium` MCP server when the task requires live mobile UI inspection, locator discovery, or step-by-step interaction with the Goally Parent app.

Project rules:

- Use CommonJS modules.
- Follow the Page Object Model.
- Put page objects in `tests/pageobjects/*.page.js`.
- Put end-to-end specs in `tests/specs/*.e2e.js`.
- Put reusable helpers in `tests/utils/*.js`.
- Reuse `tests/utils/otp.prompt.js` for any manual OTP step.
- Do not fetch OTP automatically.
- Keep assertions in specs and screen actions in page objects.
- Prefer accessibility id, resource id, content-desc, exact visible text, and platform-native selectors before XPath.
- When the request specifies exact visible button text, match that exact text.
- Avoid `browser.pause()` unless debugging is explicitly requested.

App defaults:

- Android package: `com.mygoally.mygoally`
- Android activity: `.MainActivity`
- Appium server: `http://127.0.0.1:4723/`

For login and onboarding flows:

- Wait for the splash screen to disappear by waiting for the next stable screen, not by fixed sleeps.
- For OTP, prompt with the exact text `Please enter the OTP from email: ` and wait for terminal input.
- Use one stable post-login element to verify the home screen.

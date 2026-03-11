# Goally Parent mobile automation instructions

Use the Appium MCP server for UI inspection before writing selectors.

Project rules:

- Follow the Page Object Model.
- Put page objects in `tests/pageobjects/*.page.js`.
- Put end-to-end specs in `tests/specs/*.e2e.js`.
- Put reusable terminal or test helpers in `tests/utils/*.js`.
- Extend `BasePage` where shared helpers are useful.
- Prefer accessibility id, resource id, content-desc, text, and platform-native selectors before XPath.
- Add clear assertions for every business-relevant step.
- Avoid `browser.pause()` unless debugging is explicitly requested.
- Use `waitForDisplayed` or `waitUntil` around state transitions.
- Keep page objects focused on screen actions and queries, not test assertions.
- If a flow requires OTP or another one-time code, do not fetch it automatically. Use the shared helper at `tests/utils/otp.prompt.js` to prompt in the terminal with the exact requested text.
- When a prompt specifies exact visible text for a button, prefer selectors that match that exact text.

Android defaults in this workspace:

- Package: `com.mygoally.mygoally`
- Main activity: `.MainActivity`

Code style:

- Use CommonJS modules to match the existing project config.
- Export a single page object instance from each page object file.
- Keep selectors grouped at the top of each page object.
- Name specs with the `.e2e.js` suffix.

Expected output shape:

```js
// tests/pageobjects/example.page.js
const BasePage = require('./base.page');

class ExamplePage extends BasePage {
  get primaryButton() {
    return $('~primary-button');
  }

  async tapPrimaryButton() {
    await this.tap(this.primaryButton);
  }
}

module.exports = new ExamplePage();
```

```js
// tests/specs/example.e2e.js
const ExamplePage = require('../pageobjects/example.page');

describe('Example flow', () => {
  it('completes the user journey', async () => {
    await ExamplePage.tapPrimaryButton();
    await expect(ExamplePage.primaryButton).toBeDisplayed();
  });
});
```

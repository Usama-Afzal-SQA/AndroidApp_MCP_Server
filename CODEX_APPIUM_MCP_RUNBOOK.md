# Codex + Appium MCP Runbook

This project is set up to use:

- Codex in VS Code as the AI client
- Appium as the mobile automation server
- `@gavrix/appium-mcp` as the MCP server
- WebdriverIO for test execution

## Prerequisites

- Android device connected and visible in `adb devices`
- Appium installed on this machine
- VS Code with Codex chat available
- This workspace opened in VS Code

## One-time setup

The project already contains:

- Codex project instructions in `AGENTS.md`
- Codex MCP wiring in `~/.codex/config.toml`
- Android app config in `.env`
- Manual OTP helper in `tests/utils/otp.prompt.js`

## Start Appium

Run this in the project root:

```bash
npm run appium
```

Keep it running while using Codex or executing tests.

## Use Codex with MCP in VS Code

Open Codex chat in VS Code and ask it to use the `appium` MCP server.

Example prompt:

```text
Use the appium MCP server for this workspace.
Inspect the connected Android device and generate or update the login flow test for the Goally Parent app using the Page Object Model.
Keep files under tests/pageobjects and tests/specs.
Use the existing OTP helper in tests/utils/otp.prompt.js for manual OTP entry.
```

For the existing owner login flow, you can also use:

- `prompts/goally-owner-login-otp.md`

## Run the login test

```bash
npm run test:android -- --spec ./tests/specs/goally-owner-login-manual-otp.e2e.js
```

## OTP behavior

When the test reaches the OTP screen, it should prompt in the terminal:

```text
Please enter the OTP from email:
```

Enter the 6-digit OTP manually and press Enter.

## Fast execution behavior

The current setup is optimized to be faster by default:

- launches the installed Android app by package/activity
- does not reinstall the APK unless explicitly requested
- uses faster UiAutomator2 settings
- uses gesture-based clicks where possible

If you explicitly want APK reinstall behavior, set this in `.env`:

```bash
ANDROID_REINSTALL_APP=true
```

## Common commands

Start Appium:

```bash
npm run appium
```

Run all Android specs:

```bash
npm run test:android
```

Run only the login spec:

```bash
npm run test:android -- --spec ./tests/specs/goally-owner-login-manual-otp.e2e.js
```

Start the MCP server manually for debugging:

```bash
npm run mcp
```

## Important files

- `AGENTS.md`
- `.env`
- `config/wdio.shared.conf.js`
- `config/env.js`
- `tests/specs/goally-owner-login-manual-otp.e2e.js`
- `tests/utils/otp.prompt.js`
- `prompts/goally-owner-login-otp.md`

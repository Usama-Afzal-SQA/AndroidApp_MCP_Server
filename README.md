# Goally Parent Mobile Automation

This repository is set up for:

- WebdriverIO test execution
- Appium-driven Android and iOS sessions
- The Gavrix Appium MCP server for inspection and script generation
- Structured Markdown prompt specs grouped by feature area
- Page Object Model based test organization
- Codex in VS Code using the shared Codex MCP config

## Current local status

- Appium `2.15.0` is installed and available on this machine
- `uiautomator2` is already installed for Android
- A connected Android device was detected: `QV72399V54`
- An installed Goally package was detected on that device: `com.mygoally.mygoally`
- iOS is not ready yet because the Xcode license is not accepted on this Mac

## Project layout

- `config/` contains shared, Android, and iOS WDIO configs
- `prompts/android/` contains feature-organized Markdown prompt specs
- `generated-tests/` contains generated test artifacts that are not executed by default
- `tools/spec-generator.js` generates deterministic test artifacts from prompt specs
- `tests/pageobjects/` contains page objects
- `tests/specs/` contains end-to-end specs
- `tests/utils/` contains reusable test helpers such as terminal OTP input
- `apps/` is where local mobile binaries can be dropped if you want Appium to install them
- `AGENTS.md` gives Codex project-specific rules for Appium MCP usage
- `.vscode/mcp.json` is available for editor-side MCP tooling
- `.github/copilot-instructions.md` guides Copilot to generate POM-based tests in this repo

## Install

```bash
npm install
```

## Runtime configuration

Create a local `.env` from `.env.example` and adjust values only if needed.

For Android, you can run in either mode:

- Installed app mode: keep `ANDROID_APP_PACKAGE` and `ANDROID_APP_ACTIVITY`
- Binary install mode: set `ANDROID_APP_PATH` to an APK path, such as `apps/android/goally-parent.apk`

For iOS, set either:

- `IOS_APP_PATH` to a simulator-compatible `.app`
- `IOS_BUNDLE_ID` for an app already installed on the simulator

## Start the tooling

Start Appium in one terminal:

```bash
npm run appium
```

This script uses the working Homebrew Appium binary on this Mac. If your Appium binary lives elsewhere later, update the script in `package.json`.

## Codex in VS Code

Codex CLI and the Codex VS Code client share MCP server settings from:

```bash
~/.codex/config.toml
```

The Appium MCP server has been registered there as:

```bash
appium
```

It is configured to launch this project's local MCP binary from this workspace, so Codex in VS Code can use it directly for this repository.

You generally do not need to start the MCP server manually when using Codex in VS Code. Codex will spawn it when needed.

If you want to run the MCP server manually for debugging, use:

```bash
npm run mcp
```

## Example Codex MCP prompt

Use a prompt like this in Codex chat in VS Code after Appium is running:

```text
Use the appium MCP server to start an Android session on the connected device and launch the Goally Parent app package com.mygoally.mygoally.
Inspect the current screen and create a new end-to-end test using the Page Object Model.
Place the page object in tests/pageobjects and the spec in tests/specs.
Use stable accessibility selectors where possible and avoid brittle XPath unless there is no better option.
```

## Prompt specs and generated artifacts

Use `prompts/android/<feature>/<journey>.md` as the authoring layer for reusable prompt specs. Each journey spec can contain multiple scenarios and maps to one stable generated artifact path under `generated-tests/`.

Generate one artifact:

```bash
npm run spec:generate -- prompts/android/auth/login.md
```

Generate all artifacts:

```bash
npm run spec:generate:all
```

The current executable WDIO suite still runs from `tests/specs/`, so adding generated artifacts does not change the existing test execution flow.

## Run tests

```bash
npm run test:android
```

When iOS is ready:

```bash
npm run test:ios
```

## iOS prerequisites still missing on this Mac

Run the Xcode license acceptance flow in a local terminal:

```bash
sudo xcodebuild -license
```

Then ensure the xcuitest driver is installed:

```bash
appium driver install xcuitest
```

# Codex MCP prompt: Extend flow after OTP login to create a Goally Guide

Use the `appium` MCP server for this workspace and extend the existing Android flow after the current OTP login flow succeeds.

Repository rules:

- Do not change the existing login flow behavior.
- Reuse the current login flow and continue only after the user has reached the home screen.
- Use CommonJS.
- Follow the Page Object Model.
- Put page objects in `tests/pageobjects`.
- Put the spec in `tests/specs`.
- Keep assertions in the spec and screen actions in the page objects.
- Prefer stable selectors first: accessibility id, resource id, content-desc, exact visible text, and platform-native selectors before XPath.
- When a prompt specifies exact visible text, match that exact text.
- Do not introduce unrelated refactors or changes to already working steps.
- Keep the execution fast. Do not add long waits, broad retry loops, or unnecessary pauses.
- Use the existing fast interaction style in this repository.
- Only wait when the UI actually requires it, and keep those waits minimal and targeted.

Execution target:

- Android
- Connected real device
- App package: `com.mygoally.mygoally`

Flow to automate after the existing login flow completes and the home screen is visible:

1. On the home screen, tap the button with visible text `CoPilots`. This button also has a right arrow icon.
2. On the next screen, tap the `Create` button in the bottom menu. This button also has a `+` icon.
3. When the bottom sheet menu appears, select `customize goally guide`. This is the first option in the menu.
4. On the search screen, tap the search bar to focus it.
5. Type `clothes` in the search bar.
6. Tap the `Search` button.
7. Wait for 1 second.
8. On the results screen, select `wash clothes` from the list. It is the first item in the list.
9. On the next screen, tap the `customize for bully` tile. It is the first tile on the screen.
10. Wait for 2 seconds.
11. When the bottom modal appears, tap the `okay` button at the bottom.

Output requirements:

- Extend the existing end-to-end flow instead of replacing it.
- Add or update page objects only as needed for the new screens.
- Keep the existing OTP prompt behavior unchanged.
- Keep the existing fast execution behavior unchanged.
- Use clear method names for the new screen actions.
- Add assertions only where there is a stable post-action element to verify.

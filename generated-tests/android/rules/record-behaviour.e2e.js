/**
 * AUTO-GENERATED. REGENERATE FROM PROMPT SPEC.
 * Source: prompts/android/rules/record-behaviour.md
 */

const assert = require('node:assert/strict');

const welcomePage = require('../../../tests/pageobjects/welcome.page');
const providerSelectionPage = require('../../../tests/pageobjects/provider-selection.page');
const emailLoginPage = require('../../../tests/pageobjects/email-login.page');
const otpVerificationPage = require('../../../tests/pageobjects/otp-verification.page');
const homePage = require('../../../tests/pageobjects/home.page');
const rulesPage = require('../../../tests/pageobjects/rules.page');
const recordBehaviourPage = require('../../../tests/pageobjects/record-behaviour.page');

const { launchFromCleanState } = require('../../../tests/utils/android.app');
const { promptForOtp } = require('../../../tests/utils/otp.prompt');

const GOALLY_PACKAGE = 'com.mygoally.mygoally';
const CONFIRMATION_BUTTON = 'Confirm';
const OWNER_EMAIL = 'usama@goally.co';
const RULES_ENTRY_LABEL = 'Rules';

describe('Behaviour recording journeys', () => {
  it('Record behaviour from the Rules section', async function () {
    this.timeout(300000);

    await launchFromCleanState(GOALLY_PACKAGE);
    await welcomePage.waitForLoaded();
    await welcomePage.tapGoallyAccountOwner();
    await providerSelectionPage.waitForLoaded();
    await providerSelectionPage.tapGetGoally();
    await emailLoginPage.waitForLoaded();
    await emailLoginPage.enterEmail(OWNER_EMAIL);
    await emailLoginPage.tapContinue();
    await otpVerificationPage.waitForLoaded();
    const otp = await promptForOtp('Please enter the OTP from email: ');
    await otpVerificationPage.enterOtp(otp);
    await homePage.waitForLoaded();
    assert.ok(
      await homePage.isLoaded(3000),
      'Expected the post-login home screen to be visible.'
    );

    await homePage.scrollToRulesButton();
    assert.ok(
      await homePage.isRulesEntryVisible(3000),
      'Expected the Rules entry point to be visible on the home screen.'
    );
    assert.equal(
      await homePage.getRulesButtonLabel(),
      RULES_ENTRY_LABEL
    );
    await homePage.tapRulesButton();
    await rulesPage.waitForLoaded();
    assert.ok(
      await rulesPage.isLoaded(3000),
      'Expected the Rules screen to be visible.'
    );

    assert.ok(
      await rulesPage.firstRecButton.isDisplayed(),
      'Expected the Rules screen to expose the rec action for the first tile.'
    );
    await rulesPage.tapFirstRec();
    await recordBehaviourPage.waitForConfirmationSheet();
    assert.equal(
      await recordBehaviourPage.getConfirmButtonLabel(),
      CONFIRMATION_BUTTON
    );
    await recordBehaviourPage.tapConfirm();
    await recordBehaviourPage.waitForConfirmationSheetToClose();
    assert.ok(
      await rulesPage.isLoaded(3000),
      'Expected to return to the Rules screen after confirming the behaviour.'
    );
  });

});

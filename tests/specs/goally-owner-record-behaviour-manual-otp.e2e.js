const assert = require('node:assert/strict');

const welcomePage = require('../pageobjects/welcome.page');
const providerSelectionPage = require('../pageobjects/provider-selection.page');
const emailLoginPage = require('../pageobjects/email-login.page');
const otpVerificationPage = require('../pageobjects/otp-verification.page');
const homePage = require('../pageobjects/home.page');
const rulesPage = require('../pageobjects/rules.page');
const recordBehaviourPage = require('../pageobjects/record-behaviour.page');
const { launchFromCleanState } = require('../utils/android.app');
const { promptForOtp } = require('../utils/otp.prompt');

const OWNER_EMAIL = 'usama@goally.co';
const GOALLY_PACKAGE = 'com.mygoally.mygoally';
const RULES_ENTRY_LABEL = 'Rules';
const CONFIRMATION_BUTTON = 'Confirm';

describe('Goally Rules journeys', () => {
  it('records behaviour from the Rules section after owner login', async function () {
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

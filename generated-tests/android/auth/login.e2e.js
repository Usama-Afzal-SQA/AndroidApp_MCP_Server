/**
 * AUTO-GENERATED. REGENERATE FROM PROMPT SPEC.
 * Source: prompts/android/auth/login.md
 */

const assert = require('node:assert/strict');

const welcomePage = require('../../../tests/pageobjects/welcome.page');
const providerSelectionPage = require('../../../tests/pageobjects/provider-selection.page');
const emailLoginPage = require('../../../tests/pageobjects/email-login.page');
const otpVerificationPage = require('../../../tests/pageobjects/otp-verification.page');
const homePage = require('../../../tests/pageobjects/home.page');
const copilotsPage = require('../../../tests/pageobjects/copilots.page');

const { launchFromCleanState } = require('../../../tests/utils/android.app');
const { promptForOtp } = require('../../../tests/utils/otp.prompt');

const GOALLY_PACKAGE = 'com.mygoally.mygoally';
const OWNER_EMAIL = 'usama@goally.co';

describe('Goally owner login journeys', () => {
  it('Manual OTP login reaches the home screen', async function () {
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
  });

  it('Manual OTP login opens the CoPilots area', async function () {
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

    await homePage.tapCoPilotsButton();
    await copilotsPage.waitForLoaded();
    assert.ok(
      await copilotsPage.createButton.isExisting(),
      'Expected the CoPilots screen to expose the Create entry point.'
    );
  });

});

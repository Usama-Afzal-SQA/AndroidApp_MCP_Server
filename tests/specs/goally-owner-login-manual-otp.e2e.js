const assert = require('node:assert/strict');

const welcomePage = require('../pageobjects/welcome.page');
const providerSelectionPage = require('../pageobjects/provider-selection.page');
const emailLoginPage = require('../pageobjects/email-login.page');
const otpVerificationPage = require('../pageobjects/otp-verification.page');
const homePage = require('../pageobjects/home.page');
const { launchFromCleanState } = require('../utils/android.app');
const { promptForOtp } = require('../utils/otp.prompt');

const OWNER_EMAIL = 'usama@goally.co';
const GOALLY_PACKAGE = 'com.mygoally.mygoally';

describe('Goally owner login', () => {
  it('logs in with a manual email OTP', async function () {
    this.timeout(180000);

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

    assert.ok(
      await homePage.isLoaded(),
      'Expected the post-login home screen to be visible.'
    );
  });
});

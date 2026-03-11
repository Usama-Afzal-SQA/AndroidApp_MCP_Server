const assert = require('node:assert/strict');

const welcomePage = require('../pageobjects/welcome.page');
const providerSelectionPage = require('../pageobjects/provider-selection.page');
const emailLoginPage = require('../pageobjects/email-login.page');
const otpVerificationPage = require('../pageobjects/otp-verification.page');
const homePage = require('../pageobjects/home.page');
const copilotsPage = require('../pageobjects/copilots.page');
const guideTemplateSearchPage = require('../pageobjects/guide-template-search.page');
const copilotCopiedModalPage = require('../pageobjects/copilot-copied-modal.page');
const { launchFromCleanState } = require('../utils/android.app');
const { promptForOtp } = require('../utils/otp.prompt');

const OWNER_EMAIL = 'usama@goally.co';
const GOALLY_PACKAGE = 'com.mygoally.mygoally';

describe('Goally owner login', () => {
  it('logs in with a manual email OTP and creates a Goally Guide', async function () {
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
    await browser.pause(2000);

    assert.ok(
      await homePage.isLoaded(3000),
      'Expected the post-login home screen to be visible.'
    );

    await homePage.tapCoPilotsButton();

    await copilotsPage.waitForLoaded();
    await copilotsPage.tapCreate();
    await copilotsPage.waitForCreateMenu();

    assert.equal(
      await copilotsPage.customizeGoallyGuideOption.getText(),
      'Customize Goally Guide'
    );

    await copilotsPage.tapCustomizeGoallyGuide();

    await guideTemplateSearchPage.waitForLoaded();
    await guideTemplateSearchPage.searchFor('clothes');

    await browser.pause(1000);

    await guideTemplateSearchPage.selectWashClothesIfVisible();
    await guideTemplateSearchPage.waitForCustomizeForBully();

    assert.equal(
      await guideTemplateSearchPage.getCustomizeForBullyText(),
      'Customize for Bully'
    );

    await guideTemplateSearchPage.tapCustomizeForBully();

    await browser.pause(2000);
    await copilotCopiedModalPage.waitForLoaded();

    assert.equal(
      await copilotCopiedModalPage.okayButton.getText(),
      'Okay'
    );

    await copilotCopiedModalPage.tapOkay();
  });
});

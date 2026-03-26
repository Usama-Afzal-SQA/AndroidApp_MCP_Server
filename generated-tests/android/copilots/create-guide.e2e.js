/**
 * AUTO-GENERATED. REGENERATE FROM PROMPT SPEC.
 * Source: prompts/android/copilots/create-guide.md
 */

const assert = require('node:assert/strict');

const welcomePage = require('../../../tests/pageobjects/welcome.page');
const providerSelectionPage = require('../../../tests/pageobjects/provider-selection.page');
const emailLoginPage = require('../../../tests/pageobjects/email-login.page');
const otpVerificationPage = require('../../../tests/pageobjects/otp-verification.page');
const homePage = require('../../../tests/pageobjects/home.page');
const copilotsPage = require('../../../tests/pageobjects/copilots.page');
const guideTemplateSearchPage = require('../../../tests/pageobjects/guide-template-search.page');
const copilotCopiedModalPage = require('../../../tests/pageobjects/copilot-copied-modal.page');

const { launchFromCleanState } = require('../../../tests/utils/android.app');
const { promptForOtp } = require('../../../tests/utils/otp.prompt');

const GOALLY_PACKAGE = 'com.mygoally.mygoally';
const CONFIRMATION_BUTTON = 'Okay';
const GUIDE_CUSTOMIZATION = 'Customize for Bully';
const GUIDE_SEARCH_TERM = 'clothes';
const OWNER_EMAIL = 'usama@goally.co';

describe('Goally Guide creation journeys', () => {
  it('Create a Goally Guide after owner login', async function () {
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

    await copilotsPage.tapCreate();
    await copilotsPage.waitForCreateMenu();
    assert.equal(
      await copilotsPage.customizeGoallyGuideOption.getText(),
      'Customize Goally Guide'
    );
    await copilotsPage.tapCustomizeGoallyGuide();
    await guideTemplateSearchPage.waitForLoaded();
    await guideTemplateSearchPage.searchFor(GUIDE_SEARCH_TERM);
    await guideTemplateSearchPage.selectWashClothesIfVisible(5000);
    await guideTemplateSearchPage.waitForCustomizeForBully();
    assert.equal(
      await guideTemplateSearchPage.getCustomizeForBullyText(),
      GUIDE_CUSTOMIZATION
    );
    await guideTemplateSearchPage.tapCustomizeForBully();
    await copilotCopiedModalPage.waitForLoaded();
    assert.equal(
      await copilotCopiedModalPage.okayButton.getText(),
      CONFIRMATION_BUTTON
    );
    await copilotCopiedModalPage.tapOkay();
  });

});

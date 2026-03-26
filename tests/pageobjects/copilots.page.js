const BasePage = require('./base.page');

class CopilotsPage extends BasePage {
  get createButton() {
    return $('android=new UiSelector().description("Create")');
  }

  get customizeGoallyGuideOption() {
    return $('android=new UiSelector().text("Customize Goally Guide")');
  }

  get surveyDismissButton() {
    return $('android=new UiSelector().description("No")');
  }

  async dismissSurveyIfVisible(timeout = 3000) {
    try {
      await this.surveyDismissButton.waitForExist({ timeout });
      await this.tap(this.surveyDismissButton);
      await this.surveyDismissButton.waitForExist({ timeout, reverse: true });
    } catch (error) {
      // The survey modal is optional and should not block the CoPilots flow when absent.
    }
  }

  async waitForLoaded(timeout = 12000) {
    await this.dismissSurveyIfVisible(Math.min(timeout, 3000));
    await this.waitFor(this.createButton, timeout);
  }

  async tapCreate() {
    await this.dismissSurveyIfVisible();
    await this.tap(this.createButton);
  }

  async waitForCreateMenu(timeout = 12000) {
    await this.waitFor(this.customizeGoallyGuideOption, timeout);
  }

  async tapCustomizeGoallyGuide() {
    await this.tap(this.customizeGoallyGuideOption);
  }
}

module.exports = new CopilotsPage();

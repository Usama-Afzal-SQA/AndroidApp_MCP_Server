const BasePage = require('./base.page');

class HomePage extends BasePage {
  get coPilotsTitle() {
    return $('android=new UiSelector().text("CoPilots")');
  }

  get coPilotsButton() {
    return $('android=new UiSelector().description("CoPilots")');
  }

  get surveyDismissButton() {
    return $('android=new UiSelector().description("No")');
  }

  async waitForLoaded(timeout = 15000) {
    await this.waitFor(this.coPilotsTitle, timeout);
    await this.dismissSurveyIfVisible(Math.min(timeout, 3000));
  }

  async isLoaded(timeout = 15000) {
    try {
      await this.waitFor(this.coPilotsTitle, timeout);
      return true;
    } catch (error) {
      return false;
    }
  }

  async dismissSurveyIfVisible(timeout = 2000) {
    try {
      await this.surveyDismissButton.waitForExist({ timeout });
      await this.tap(this.surveyDismissButton);
      await this.surveyDismissButton.waitForExist({ timeout, reverse: true });
    } catch (error) {
      // Survey modal is optional.
    }
  }

  async tapCoPilotsButton() {
    await this.dismissSurveyIfVisible();
    await this.tap(this.coPilotsButton);
  }
}

module.exports = new HomePage();

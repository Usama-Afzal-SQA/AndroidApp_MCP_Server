const BasePage = require('./base.page');

class CopilotsPage extends BasePage {
  get createButton() {
    return $('//android.widget.TextView[@text="Create"]/ancestor::android.widget.Button[1]');
  }

  get customizeGoallyGuideOption() {
    return $('android=new UiSelector().text("Customize Goally Guide")');
  }

  async waitForLoaded(timeout = 12000) {
    await this.waitFor(this.createButton, timeout);
  }

  async tapCreate() {
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

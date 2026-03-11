const BasePage = require('./base.page');

class ProviderSelectionPage extends BasePage {
  get getGoallyButton() {
    return $('android=new UiSelector().text("GetGoally.com")');
  }

  async waitForLoaded(timeout = 10000) {
    await this.waitFor(this.getGoallyButton, timeout);
  }

  async tapGetGoally() {
    await this.tap(this.getGoallyButton);
  }
}

module.exports = new ProviderSelectionPage();

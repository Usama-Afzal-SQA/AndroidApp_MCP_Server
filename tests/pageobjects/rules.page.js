const BasePage = require('./base.page');

class RulesPage extends BasePage {
  get positiveRulesHeading() {
    return $('android=new UiSelector().text("Positive Rules")');
  }

  get firstRecButton() {
    return $('android=new UiSelector().description("Rec").instance(0)');
  }

  async waitForLoaded(timeout = 15000) {
    await this.waitFor(this.positiveRulesHeading, timeout);
    await this.waitFor(this.firstRecButton, timeout);
  }

  async isLoaded(timeout = 15000) {
    try {
      await this.waitForLoaded(timeout);
      return true;
    } catch (error) {
      return false;
    }
  }

  async tapFirstRec() {
    await this.tap(this.firstRecButton);
  }
}

module.exports = new RulesPage();

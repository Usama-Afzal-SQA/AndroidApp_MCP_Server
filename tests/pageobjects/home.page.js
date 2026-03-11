const BasePage = require('./base.page');

class HomePage extends BasePage {
  get homeTab() {
    return $('android=new UiSelector().text("Home")');
  }

  async waitForLoaded(timeout = 15000) {
    await this.waitFor(this.homeTab, timeout);
  }

  async isLoaded(timeout = 15000) {
    try {
      await this.waitFor(this.homeTab, timeout);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new HomePage();

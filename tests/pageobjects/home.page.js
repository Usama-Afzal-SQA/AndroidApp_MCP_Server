const BasePage = require('./base.page');

class HomePage extends BasePage {
  get homeTab() {
    return $('android=new UiSelector().text("Home")');
  }

  get coPilotsButton() {
    return $('//android.widget.TextView[@text="CoPilots"]/ancestor::android.widget.Button[1]');
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

  async tapCoPilotsButton() {
    await this.tap(this.coPilotsButton);
  }
}

module.exports = new HomePage();

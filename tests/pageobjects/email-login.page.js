const BasePage = require('./base.page');

class EmailLoginPage extends BasePage {
  get emailInput() {
    return $('android=new UiSelector().className("android.widget.EditText").instance(0)');
  }

  get continueButton() {
    return $('android=new UiSelector().text("Continue")');
  }

  async waitForLoaded(timeout = 10000) {
    await this.waitFor(this.emailInput, timeout);
  }

  async enterEmail(email) {
    await this.type(this.emailInput, email);
  }

  async tapContinue() {
    await this.tap(this.continueButton);
  }
}

module.exports = new EmailLoginPage();

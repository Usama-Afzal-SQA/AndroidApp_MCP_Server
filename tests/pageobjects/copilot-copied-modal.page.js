const BasePage = require('./base.page');

class CopilotCopiedModalPage extends BasePage {
  get title() {
    return $('android=new UiSelector().text("CoPilot Copied")');
  }

  get okayButton() {
    return $('android=new UiSelector().text("Okay")');
  }

  async waitForLoaded(timeout = 12000) {
    await this.waitFor(this.title, timeout);
    await this.waitFor(this.okayButton, timeout);
  }

  async tapOkay() {
    await this.tap(this.okayButton);
  }
}

module.exports = new CopilotCopiedModalPage();

const BasePage = require('./base.page');

class RecordBehaviourPage extends BasePage {
  get confirmButton() {
    return $('~Confirm');
  }

  async waitForConfirmationSheet(timeout = 10000) {
    await this.waitFor(this.confirmButton, timeout);
  }

  async getConfirmButtonLabel(timeout = 10000) {
    await this.waitForConfirmationSheet(timeout);
    return this.confirmButton.getAttribute('contentDescription');
  }

  async tapConfirm() {
    await this.tap(this.confirmButton);
  }

  async waitForConfirmationSheetToClose(timeout = 10000) {
    await this.confirmButton.waitForExist({
      timeout,
      reverse: true
    });
  }
}

module.exports = new RecordBehaviourPage();

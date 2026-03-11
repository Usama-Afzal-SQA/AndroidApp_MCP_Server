const BasePage = require('./base.page');

class WelcomePage extends BasePage {
  get goallyAccountOwnerButton() {
    return $('~Goally account owner');
  }

  async waitForLoaded(timeout = 30000) {
    await this.waitFor(this.goallyAccountOwnerButton, timeout);
  }

  async tapGoallyAccountOwner() {
    await this.tap(this.goallyAccountOwnerButton);
  }
}

module.exports = new WelcomePage();

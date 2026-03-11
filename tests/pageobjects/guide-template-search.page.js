const BasePage = require('./base.page');

class GuideTemplateSearchPage extends BasePage {
  get searchInput() {
    return $('//android.widget.EditText');
  }

  get searchButton() {
    return $('//android.widget.TextView[@text="Search"]/ancestor::android.widget.Button[1]');
  }

  get washClothesResult() {
    return $('android=new UiSelector().text("Wash Clothes")');
  }

  get customizeForBullyButton() {
    return $('//android.widget.TextView[@text="Customize for Bully"]/ancestor::android.widget.Button[1]');
  }

  get customizeForBullyLabel() {
    return $('android=new UiSelector().text("Customize for Bully")');
  }

  async waitForLoaded(timeout = 12000) {
    await this.waitFor(this.searchInput, timeout);
  }

  async searchFor(query) {
    const input = await this.waitFor(this.searchInput);

    await this.click(input);
    await input.clearValue();
    await input.setValue(query);
    await this.tap(this.searchButton);
  }

  async selectWashClothesIfVisible(timeout = 3000) {
    try {
      await this.waitFor(this.washClothesResult, timeout);
      await this.tap(this.washClothesResult, timeout);
    } catch (error) {
      // Some builds navigate directly to the template details screen after searching.
    }
  }

  async waitForCustomizeForBully(timeout = 12000) {
    await this.waitFor(this.customizeForBullyLabel, timeout);
    await this.waitFor(this.customizeForBullyButton, timeout);
  }

  async tapCustomizeForBully() {
    await this.tap(this.customizeForBullyButton);
  }

  async getCustomizeForBullyText() {
    const label = await this.waitFor(this.customizeForBullyLabel, 3000);

    return label.getText();
  }
}

module.exports = new GuideTemplateSearchPage();

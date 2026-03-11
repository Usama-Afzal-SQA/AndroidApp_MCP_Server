class BasePage {
  async waitFor(element, timeout = 12000) {
    await element.waitForExist({
      timeout,
      interval: 250
    });
    return element;
  }

  async tap(element, timeout = 12000) {
    const target = await this.waitFor(element, timeout);
    await this.click(target);
  }

  async click(element) {
    try {
      await browser.execute('mobile: clickGesture', {
        elementId: element.elementId
      });
    } catch (error) {
      await element.click();
    }
  }

  async type(element, value, timeout = 12000) {
    const target = await this.waitFor(element, timeout);
    await this.click(target);
    await target.setValue(value);
  }

  async readText(element, timeout = 12000) {
    const target = await this.waitFor(element, timeout);
    return target.getText();
  }
}

module.exports = BasePage;

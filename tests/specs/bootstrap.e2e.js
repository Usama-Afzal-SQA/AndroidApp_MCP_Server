const assert = require('node:assert/strict');

describe('Goally app bootstrap', () => {
  it('starts an Appium session and returns a native page source', async () => {
    const pageSource = await browser.getPageSource();

    assert.ok(
      pageSource.includes('<hierarchy') || pageSource.includes('XCUIElementType'),
      'Expected a native mobile page source after launching the app.'
    );
  });
});

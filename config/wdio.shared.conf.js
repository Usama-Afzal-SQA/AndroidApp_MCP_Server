const fs = require('node:fs');
const path = require('node:path');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function ensureDirectory(targetPath) {
  fs.mkdirSync(targetPath, { recursive: true });
}

exports.config = {
  runner: 'local',
  hostname: process.env.APPIUM_HOST || '127.0.0.1',
  port: Number(process.env.APPIUM_PORT || 4723),
  path: process.env.APPIUM_PATH || '/',
  specs: ['../tests/specs/**/*.e2e.js'],
  maxInstances: 1,
  logLevel: process.env.WDIO_LOG_LEVEL || 'info',
  bail: 0,
  waitforTimeout: 12000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 1,
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000
  },
  outputDir: path.join(process.cwd(), 'artifacts', 'logs'),
  beforeSession: function () {
    ensureDirectory(path.join(process.cwd(), 'artifacts', 'logs'));
    ensureDirectory(path.join(process.cwd(), 'artifacts', 'screenshots'));
  },
  before: async function () {
    await browser.setTimeout({
      implicit: 0
    });

    if (String(browser.capabilities.platformName).toLowerCase() !== 'android') {
      return;
    }

    try {
      await browser.updateSettings({
        waitForIdleTimeout: 100,
        waitForSelectorTimeout: 3000,
        actionAcknowledgmentTimeout: 0,
        scrollAcknowledgmentTimeout: 0,
        keyInjectionDelay: 0
      });
    } catch (error) {
      console.warn(`Unable to apply fast Android driver settings: ${error.message}`);
    }
  },
  afterTest: async function (test, _context, { error }) {
    if (!error) {
      return;
    }

    const fileName = `${slugify(test.parent)}__${slugify(test.title)}.png`;
    const screenshotPath = path.join(process.cwd(), 'artifacts', 'screenshots', fileName);
    await browser.saveScreenshot(screenshotPath);
  }
};

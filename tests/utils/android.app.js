const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_ANDROID_APP_CANDIDATES = [
  process.env.ANDROID_APP_PATH,
  'apps/android/goally-parent.apk',
  'apps/android/app.apk'
];

function toBoolean(value, defaultValue) {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  return String(value).toLowerCase() === 'true';
}

function normalizePath(inputPath) {
  if (!inputPath) {
    return null;
  }

  if (inputPath.startsWith('~/')) {
    return path.join(os.homedir(), inputPath.slice(2));
  }

  return path.isAbsolute(inputPath)
    ? inputPath
    : path.resolve(PROJECT_ROOT, inputPath);
}

function resolveAndroidAppPath() {
  for (const candidate of DEFAULT_ANDROID_APP_CANDIDATES) {
    const normalized = normalizePath(candidate);

    if (normalized && fs.existsSync(normalized)) {
      return normalized;
    }
  }

  return null;
}

async function launchFromCleanState(appPackage) {
  const shouldReinstallApp = toBoolean(process.env.ANDROID_REINSTALL_APP, false);
  const appPath = shouldReinstallApp ? resolveAndroidAppPath() : null;

  if (appPath && shouldReinstallApp) {
    await browser.removeApp(appPackage).catch(() => {});
    await browser.installApp(appPath);
    await browser.activateApp(appPackage);
    return;
  }

  await browser.terminateApp(appPackage).catch(() => {});
  await browser.activateApp(appPackage);
}

module.exports = {
  launchFromCleanState,
  resolveAndroidAppPath
};

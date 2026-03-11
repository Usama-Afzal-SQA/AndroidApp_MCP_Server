const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const projectRoot = path.resolve(__dirname, '..');

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
    : path.resolve(projectRoot, inputPath);
}

function findExistingPath(candidates) {
  for (const candidate of candidates) {
    const normalized = normalizePath(candidate);
    if (normalized && fs.existsSync(normalized)) {
      return normalized;
    }
  }

  return null;
}

function compact(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );
}

function getAndroidCapabilities() {
  const detectedAppPath = findExistingPath([
    process.env.ANDROID_APP_PATH
  ]);

  if (!detectedAppPath && (!process.env.ANDROID_APP_PACKAGE || !process.env.ANDROID_APP_ACTIVITY)) {
    throw new Error(
      'Android configuration is incomplete. Set ANDROID_APP_PATH or set both ANDROID_APP_PACKAGE and ANDROID_APP_ACTIVITY in .env.'
    );
  }

  return compact({
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Android Device',
    'appium:udid': process.env.ANDROID_UDID || undefined,
    'appium:newCommandTimeout': 240,
    'appium:autoGrantPermissions': true,
    'appium:disableWindowAnimation': true,
    'appium:noReset': toBoolean(process.env.ANDROID_NO_RESET, true),
    'appium:fullReset': toBoolean(process.env.ANDROID_FULL_RESET, false),
    'appium:app': detectedAppPath || undefined,
    'appium:appPackage': detectedAppPath ? undefined : process.env.ANDROID_APP_PACKAGE,
    'appium:appActivity': detectedAppPath ? undefined : process.env.ANDROID_APP_ACTIVITY,
    'appium:appWaitActivity': process.env.ANDROID_APP_WAIT_ACTIVITY || undefined
  });
}

function getIOSCapabilities() {
  const detectedAppPath = findExistingPath([
    process.env.IOS_APP_PATH
  ]);

  if (!detectedAppPath && !process.env.IOS_BUNDLE_ID) {
    throw new Error(
      'iOS configuration is incomplete. Set IOS_APP_PATH or IOS_BUNDLE_ID in .env.'
    );
  }

  return compact({
    platformName: 'iOS',
    'appium:automationName': 'XCUITest',
    'appium:deviceName': process.env.IOS_DEVICE_NAME || 'iPhone',
    'appium:udid': process.env.IOS_UDID || undefined,
    'appium:platformVersion': process.env.IOS_PLATFORM_VERSION || undefined,
    'appium:newCommandTimeout': 240,
    'appium:noReset': toBoolean(process.env.IOS_NO_RESET, true),
    'appium:app': detectedAppPath || undefined,
    'appium:bundleId': process.env.IOS_BUNDLE_ID || undefined
  });
}

module.exports = {
  getAndroidCapabilities,
  getIOSCapabilities
};

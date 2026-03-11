const { config: sharedConfig } = require('./wdio.shared.conf');
const { getAndroidCapabilities } = require('./env');

exports.config = {
  ...sharedConfig,
  capabilities: [getAndroidCapabilities()]
};

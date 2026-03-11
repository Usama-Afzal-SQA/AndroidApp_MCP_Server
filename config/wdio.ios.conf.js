const { config: sharedConfig } = require('./wdio.shared.conf');
const { getIOSCapabilities } = require('./env');

exports.config = {
  ...sharedConfig,
  capabilities: [getIOSCapabilities()]
};

const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
  },
  watchFolders: [path.resolve(__dirname, '..', 'common')],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

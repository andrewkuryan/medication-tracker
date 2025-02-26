const path = require('node:path');

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '^@common/(.+)': '../common/src/\\1',
          '^@store/(.+)': './src/store/\\1',
          '^@components/(.+)': './src/components/\\1',
          '^@icons/(.+)': './src/icons/\\1',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        path: path.resolve('..', '.env'),
      },
    ],
    'react-native-reanimated/plugin',
  ],
};

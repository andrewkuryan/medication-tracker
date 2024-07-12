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
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        path: path.resolve('..', '.env'),
      },
    ],
  ],
};

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
  ],
};

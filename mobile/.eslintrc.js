module.exports = {
  extends: [
    '../.eslintrc.js',
    'plugin:react/recommended',
    'plugin:react-native/all',
  ],
  plugins: [
    'react',
    'react-native',
  ],
  env: {
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    ecmaFeatures: {
      jsx: true,
    },
  },
};

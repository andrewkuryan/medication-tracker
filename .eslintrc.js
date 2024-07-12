module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  extends: [
    'airbnb-base',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'import/extensions': [
      'warn',
      { ts: 'never' },
    ],
    'import/no-extraneous-dependencies': 'off',
    'max-classes-per-file': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};

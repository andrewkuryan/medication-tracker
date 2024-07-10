module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
};

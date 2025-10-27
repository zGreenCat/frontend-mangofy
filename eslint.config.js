// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    rules: {
      'prettier/prettier': 'error',
    },
    extends: ["expo","plugin:prettier/recommended"],
    plugins: ["prettier"],
  },
]);

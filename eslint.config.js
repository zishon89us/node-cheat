import js from '@eslint/js';
import globals from 'globals';
import security from 'eslint-plugin-security';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['**/node_modules/**', '**/*.min.js', 'coverage/**'],
  },
  js.configs.recommended,
  security.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
      'no-console': 'off',
      // Examples intentionally index objects and read paths from variables.
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-fs-filename': 'off',
    },
  },
  {
    files: ['**/public/**/*.js', '**/views/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: { ...globals.browser, io: 'readonly' },
    },
  },
  {
    files: ['realtime/webrtc/**/public/**/*.js'],
    languageOptions: { sourceType: 'module' },
  },
  prettier,
];

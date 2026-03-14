import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // real errors stay red
      'no-undef': 'error',           // undefined variables
      'no-redeclare': 'error',       // duplicate declarations

      // unused variables are just warnings (yellow line) or ignored
      'no-unused-vars': [
        'off',                      // can use 'off' to fully disable
        {
          varsIgnorePattern: '^[A-Z_]', // ignore vars like React, constants
          argsIgnorePattern: '^_',      // ignore unused function arguments starting with _
          caughtErrorsIgnorePattern: '^_', // ignore catch blocks starting with _
        },
      ],

      // React specific
      'react/react-in-jsx-scope': 'off', // React 17+ doesn’t require import React
    },
  },
]);

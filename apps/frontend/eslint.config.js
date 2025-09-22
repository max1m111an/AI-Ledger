import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import react from 'eslint-plugin-react'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
      plugins: {
          react, // ← добавляем плагин как объект
      },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
      settings: {
          react: {
              version: 'detect',
          },
      },
      rules: {
          '@typescript-eslint/no-unused-vars': 'error',
          'semi': ['error', 'always'],
          'comma-dangle': ['error', 'always-multiline'],
          'indent': ['error', 4],
          'quotes': ['error', 'double', { avoidEscape: true }],
          'object-curly-spacing': ['error', 'always'],
          'array-bracket-spacing': ['error', 'always'],
          'comma-style': ['error', 'last'],

          'react/react-in-jsx-scope': 'off',
          'react/jsx-indent': ['error', 4],
          'react/jsx-tag-spacing': ['error', {
              closingSlash: 'never',
              beforeSelfClosing: 'always',
              afterOpening: 'never',
              beforeClosing: 'allow',
          }],
          'react/jsx-curly-spacing': ['error', { when: 'always' }],
      }
  },
])

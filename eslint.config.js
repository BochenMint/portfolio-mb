import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Polish typography puts a hard space (U+00A0) after one-letter words
      // so a line never ends on "w" or "i", and the copy for every landing
      // lives in template literals in this repo. The rule already skips
      // ordinary strings by default; skipping templates keeps the check
      // where it belongs — stray invisible characters in actual code —
      // instead of flagging deliberate typography 39 times per landing.
      'no-irregular-whitespace': ['error', { skipTemplates: true }],
    },
  },
])

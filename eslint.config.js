import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'
import preferTopLevelFunctionDeclarations from './eslint-rules/prefer-top-level-function-declarations.js'

export default tseslint.config([
  globalIgnores(['dist', 'convex/_generated']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      local: {
        rules: {
          "prefer-top-level-function-declarations": preferTopLevelFunctionDeclarations,
        },
      },
    },
    rules: {
      "prefer-arrow-callback": "off",
      "local/prefer-top-level-function-declarations": "error",
    },
  },
])

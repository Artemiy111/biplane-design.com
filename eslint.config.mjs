// import antfu from '@antfu/eslint-config'
import oxlint from 'eslint-plugin-oxlint'
// import perfectionist from 'eslint-plugin-perfectionist'

import { withNuxt } from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // perfectionist.configs['recommended-alphabetical'],
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
      'import/order': 'off',
      'perfectionist/sort-vue-attributes': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
).prepend(oxlint.configs['flat/recommended'])

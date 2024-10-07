// import antfu from '@antfu/eslint-config'
import oxlint from 'eslint-plugin-oxlint'
import { withNuxt } from './.nuxt/eslint.config.mjs'

export default withNuxt(
  oxlint.configs['flat/recommended'],
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
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
).prepend()

/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-recommended-vue',
    'stylelint-config-clean-order',
  ],
  reportDescriptionlessDisables: true,
  reportInvalidScopeDisables: true,
  reportNeedlessDisables: true,
  rules: {
    'function-disallowed-list': ['rgba', 'hsla', 'rgb', 'hsl', 'hwd'],
    'color-function-notation': 'modern',
  },
}

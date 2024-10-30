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
    // "selector-class-pattern": null, // have some-selector_modifier notation
    // "custom-property-pattern": null, // have kebab_case --variables in @seenday/ui
    // "value-keyword-case": null // incorrect work with css v-bind
    'function-disallowed-list': ['rgba', 'hsla', 'rgb', 'hsl', 'hwd'],
    'color-function-notation': 'modern',
    'color-no-hex': true,
  },
}

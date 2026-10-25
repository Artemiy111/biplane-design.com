const NON_LATIN_LETTER = /(?!\p{Script=Latin})\p{L}/u

export default {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'header-latin-only': ({ header = '' }) => {
          const found = header.match(NON_LATIN_LETTER)
          return [
            found === null,
            `header must be written in English: "${found?.[0] ?? ''}" is not a Latin letter`,
          ]
        },
      },
    },
  ],
  rules: {
    'body-empty': [2, 'always'],
    'body-max-line-length': [0],
    'header-latin-only': [2, 'always'],
    'header-max-length': [2, 'always', 70],
    'subject-case': [2, 'never', ['upper-case', 'pascal-case', 'start-case']],
  },
}

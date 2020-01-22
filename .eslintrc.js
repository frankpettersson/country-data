module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    '@nuxtjs/eslint-config-typescript'
  ],
  plugins: ['vue'],
  rules: {
    semi: [2, 'always'],
    'space-before-function-paren': 'off',
    'no-console': 'off',
    'vue/max-attributes-per-line': 'off',
    'prettier/prettier': [
      'error',
      {
        semi: true,
        singleQuote: true
      }
    ]
  }
};

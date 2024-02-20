module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:vue/vue3-recommended',
    'plugin:nuxt/recommended',
    'prettier',
    'plugin:storybook/recommended',
  ],
  plugins: ['prettier', 'no-relative-import-paths'],
  rules: {
    curly: 'error',
    'vue/multi-word-component-names': 0,
    'prettier/prettier': 'error',
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error'],
      },
    ],
  },
}

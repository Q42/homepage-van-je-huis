import '@/assets/css/main.less'
import './main.less'
import { createI18n } from 'vue-i18n'
import { translations } from '../translations'
import { setup } from '@storybook/vue3'

const i18n = createI18n({
  allowComposition: true,
  locale: 'nl',
  globalInjection: true,
  messages: translations,
  availableLocales: Object.keys(translations),
})

setup((app) => {
  app.use(i18n)
})

/** @type { import('@storybook/vue3').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview

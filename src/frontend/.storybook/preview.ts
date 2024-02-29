import '@/assets/css/main.less'
import './main.less'
import { createI18n } from 'vue-i18n'
import { translations } from '../translations'
import { setup } from '@storybook/vue3'
import { createPinia } from 'pinia'
import { slugToAddress, slugifyStreetName } from '../utils/slugifyAdress'

const i18n = createI18n({
  allowComposition: true,
  locale: 'nl',
  globalInjection: true,
  messages: translations,
  availableLocales: Object.keys(translations),
})

const pinia = createPinia()

setup((app) => {
  app.use(i18n)
  app.use(pinia)
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

import path from 'path'
import svgLoader from 'vite-svg-loader'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n', '@nuxtjs/robots', '@pinia/nuxt'],
  i18n: {
    locales: [{ code: 'nl', name: 'Dutch' }],
    defaultLocale: 'nl',
    strategy: 'prefix',
    vueI18n: './i18n.config.ts',
  },
  ssr: false,
  devtools: { enabled: true },
  css: ['@/assets/css/main.less'],
  robots: {
    configPath: './robots.config.ts',
  },
  vite: {
    plugins: [svgLoader()],
    css: {
      preprocessorOptions: {
        less: {
          additionalData: `
          @import "${path.resolve(__dirname, './assets/css/vars.less')}";
          @import "${path.resolve(__dirname, './assets/css/typography.less')}";
          `,
          math: 'always',
        },
      },
    },
  },
})

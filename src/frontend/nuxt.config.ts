import path from 'path'
import svgLoader from 'vite-svg-loader'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  css: ['@/assets/css/main.less'],

  vite: {
    plugins: [svgLoader()],
    css: {
      preprocessorOptions: {
        less: {
          additionalData: `
          @import "${path.resolve(__dirname, './assets/css/vars.less')}";
          `,
          math: 'always',
        },
      },
    },
  },
})

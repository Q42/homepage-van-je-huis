import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { mergeConfig } from 'vite'
import svgLoader from 'vite-svg-loader'

/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  staticDirs: ['./public'],
  stories: ['../components/**/**/*.stories.ts'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      assetsInclude: ['/sb-preview/runtime.js'], // See issue: https://github.com/storybookjs/storybook/issues/25256#issuecomment-1866441206
      css: {
        preprocessorOptions: {
          less: {
            additionalData: `
              @import "${path.resolve(__dirname, '../assets/css/vars.less')}";
            `,
            math: 'always',
          },
        },
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './..'),
        },
      },
      plugins: [
        svgLoader(),
        AutoImport({
          imports: ['vue', 'vue-router'],
          dts: '.nuxt/auto-imports.d.ts',
          dirs: ['.storybook/composables'],
          vueTemplate: true,
        }),
        Components({
          dirs: ['components'],
          dts: '.nuxt/components.d.ts',
          directoryAsNamespace: true,
        }),
      ],
    })
  },
}
export default config

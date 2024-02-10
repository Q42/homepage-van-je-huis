import type { Meta, StoryFn } from '@storybook/vue3'

import Icon, { IconProps } from './index.vue'

export default {
  title: 'Shared/Icons',
  component: Icon,
  tags: ['autodocs'],
} as Meta<typeof Icon>

const Template: StoryFn<typeof Icon> = (args: IconProps) => ({
  components: { Icon },
  setup() {
    return { args }
  },
  template: '<Icon v-bind="args"/>',
})

export const Logo = Template.bind({})
Logo.args = {
  type: 'logo',
}

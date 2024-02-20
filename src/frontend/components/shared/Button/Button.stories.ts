import type { Meta, StoryFn } from '@storybook/vue3'

import Button, { ButtonProps } from './index.vue'

export default {
  title: 'Shared/Button',
  component: Button,
} as Meta<typeof Button>

const Template: StoryFn<typeof Button> = (args: ButtonProps) => ({
  components: { Button },
  setup() {
    return { args }
  },
  template: '<Button v-bind="args" />',
})

export const ButtonStory = Template.bind({})
ButtonStory.args = {
  label: 'Een knop',
}

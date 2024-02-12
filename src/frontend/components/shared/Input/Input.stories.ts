import type { Meta, StoryFn } from '@storybook/vue3'

import Input, { InputProps } from './index.vue'

export default {
  title: 'Shared/Input',
  component: Input,
} as Meta<typeof Input>

const Template: StoryFn<typeof Input> = (args: InputProps) => ({
  components: { Input },
  setup() {
    return { args }
  },
  template: '<Input v-bind="args" />',
})

export const InputStory = Template.bind({})
InputStory.args = {
  placeholder: 'Zoek een adres',
  icon: 'search',
}

import type { Meta, StoryFn } from '@storybook/vue3'

import Header from './index.vue'

export default {
  title: 'UI/Header',
  component: Header,
} as Meta<typeof Header>

const Template: StoryFn<typeof Header> = (args) => ({
  components: { Header },
  setup() {
    return { args }
  },
  template: '<Header v-bind="args" />',
})

export const HeaderStory = Template.bind({})
HeaderStory.args = {}

import type { Meta, StoryFn } from '@storybook/vue3'

import IconButton, { IconButtonProps } from './index.vue'

export default {
  title: 'Shared/IconButton',
  component: IconButton,
} as Meta<typeof IconButton>

const Template: StoryFn<typeof IconButton> = (args: IconButtonProps) => ({
  components: { IconButton },
  setup() {
    return { args }
  },
  template: '<IconButton v-bind="args" />',
})

export const IconCloseButtonStory = Template.bind({})
IconCloseButtonStory.args = {
  icon: 'close',
}

export const IconStoriesButtonStory = Template.bind({})
IconStoriesButtonStory.args = {
  icon: 'stories',
}

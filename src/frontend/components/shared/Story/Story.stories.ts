import type { Meta, StoryFn } from '@storybook/vue3'

import Story, { StoryProps } from './index.vue'

export default {
  title: 'Shared/Shared/Story',
  component: Story,
} as Meta<typeof Story>

const Template: StoryFn<typeof Story> = (args: StoryProps) => ({
  components: { Story },
  setup() {
    return { args }
  },
  template: '<Story v-bind="args" />',
})

export const StoryStory = Template.bind({})
StoryStory.args = {}

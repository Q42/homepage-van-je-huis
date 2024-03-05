import type { Meta, StoryFn } from '@storybook/vue3'

import StartAnimation, { StartAnimationProps } from './index.vue'

export default {
  title: 'UI/StartAnimation',
  component: StartAnimation,
} as Meta<typeof StartAnimation>

const Template: StoryFn<typeof StartAnimation> = (
  args: StartAnimationProps,
) => ({
  components: { StartAnimation },
  setup() {
    return { args }
  },
  template: '<StartAnimation v-bind="args" />',
})

export const StartAnimationStory = Template.bind({})
StartAnimationStory.args = {}

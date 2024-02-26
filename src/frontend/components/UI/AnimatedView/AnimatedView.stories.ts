import type { Meta, StoryFn } from '@storybook/vue3'

import AnimatedView, { AnimatedViewProps } from './index.vue'

export default {
  title: 'UI/Ui/AnimatedView',
  component: AnimatedView,
} as Meta<typeof AnimatedView>

const Template: StoryFn<typeof AnimatedView> = (args: AnimatedViewProps) => ({
  components: { AnimatedView },
  setup() {
    return { args }
  },
  template: '<AnimatedView v-bind="args" />',
})

export const AnimatedViewStory = Template.bind({})
AnimatedViewStory.args = {}

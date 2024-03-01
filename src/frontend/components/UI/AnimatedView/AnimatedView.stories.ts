import type { Meta, StoryFn } from '@storybook/vue3'

import AnimatedView, { AnimatedViewProps } from './index.vue'
import { mockEntries } from '@/.storybook/mockdata/mockEntries'

export default {
  title: 'Ui/AnimatedView',
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
AnimatedViewStory.args = {
  entries: mockEntries,
}

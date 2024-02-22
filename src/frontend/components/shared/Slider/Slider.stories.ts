import type { Meta, StoryFn } from '@storybook/vue3'

import Slider, { SliderProps } from './index.vue'

export default {
  title: 'Shared/Slider',
  component: Slider,
} as Meta<typeof Slider>

const Template: StoryFn<typeof Slider> = (args: SliderProps) => ({
  components: { Slider },
  setup() {
    return { args }
  },
  template: '<Slider v-bind="args" />',
})

export const SliderStory = Template.bind({})
SliderStory.args = {}

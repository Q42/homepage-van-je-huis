import type { Meta, StoryFn } from '@storybook/vue3'

import Fade from './index.vue'

export default {
  title: 'Transitions/Fade',
  component: Fade,
} as Meta<typeof Fade>

const Template: StoryFn<typeof Fade> = (args) => ({
  components: { Fade },
  setup() {
    return { args }
  },
  template:
    '<Fade><div v-if="args.isShown" style="background-color: #d55140; width: 50px; height: 50px; border-radius: 50%;"></div></Fade>',
})

export const FadeStory = Template.bind({})
FadeStory.args = {
  isShown: true,
}

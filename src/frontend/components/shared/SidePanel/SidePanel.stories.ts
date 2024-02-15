import type { Meta, StoryFn } from '@storybook/vue3'

import SidePanel, { SidePanelProps } from './index.vue'

export default {
  title: 'Shared/SidePanel',
  component: SidePanel,
} as Meta<typeof SidePanel>

const Template: StoryFn<typeof SidePanel> = (args: SidePanelProps) => ({
  components: { SidePanel },
  setup() {
    return { args }
  },
  template: '<SidePanel v-bind="args" />',
})

export const SidePanelStory = Template.bind({})
SidePanelStory.args = {}

import type { Meta, StoryFn } from '@storybook/vue3'

import SearchBlock, { SearchBlockProps } from './index.vue'

export default {
  title: 'UI/Ui/SearchBlock',
  component: SearchBlock,
} as Meta<typeof SearchBlock>

const Template: StoryFn<typeof SearchBlock> = (args: SearchBlockProps) => ({
  components: { SearchBlock },
  setup() {
    return { args }
  },
  template: '<SearchBlock v-bind="args" />',
})

export const SearchBlockStory = Template.bind({})
SearchBlockStory.args = {}

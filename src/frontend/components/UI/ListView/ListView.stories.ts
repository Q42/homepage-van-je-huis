import type { Meta, StoryFn } from '@storybook/vue3'

import ListView, { ListViewProps } from './index.vue'
import { mockEntries } from '@/.storybook/mockdata/mockEntries'

export default {
  title: 'Ui/ListView',
  component: ListView,
} as Meta<typeof ListView>

const Template: StoryFn<typeof ListView> = (args: ListViewProps) => ({
  components: { ListView },
  setup() {
    return { args }
  },
  template: '<ListView v-bind="args" />',
})

export const ListViewStory = Template.bind({})
ListViewStory.args = {
  entries: mockEntries,
}

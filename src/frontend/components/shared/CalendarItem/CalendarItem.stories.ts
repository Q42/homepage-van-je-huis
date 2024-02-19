import type { Meta, StoryFn } from '@storybook/vue3'

import CalendarItem, { CalendarItemProps } from './index.vue'

export default {
  title: 'Shared/CalendarItem',
  component: CalendarItem,
} as Meta<typeof CalendarItem>

const Template: StoryFn<typeof CalendarItem> = (args: CalendarItemProps) => ({
  components: { CalendarItem },
  setup() {
    return { args }
  },
  template: '<CalendarItem v-bind="args" />',
})

export const CalendarItemStory = Template.bind({})
CalendarItemStory.args = {}

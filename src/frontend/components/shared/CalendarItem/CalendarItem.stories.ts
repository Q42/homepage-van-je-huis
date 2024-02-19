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
CalendarItemStory.args = {
  calendarItem: {
    image: {
      url: 'https://images.memorix.nl/ams/thumb/1000x1000/87d81163-42b2-16f2-6890-dc5c2d22408d.jpg',
      altText: 'Chez Diederichs, Frères, Marché au fleurs, à Amsterdam',
    },
    title: 'Openingsconcert',
    description: 'Dit is een beschrijving van het openingsconcert.',
    date: '2024-10-27T00:00:00.000Z',
  },
}

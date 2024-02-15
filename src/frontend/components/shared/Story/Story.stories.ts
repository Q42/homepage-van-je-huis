import type { Meta, StoryFn } from '@storybook/vue3'

import Story, { StoryProps } from './index.vue'

export default {
  title: 'Shared/Story',
  component: Story,
} as Meta<typeof Story>

const Template: StoryFn<typeof Story> = (args: StoryProps) => ({
  components: { Story },
  setup() {
    return { args }
  },
  template: '<Story v-bind="args" />',
})

export const StoryStory = Template.bind({})
StoryStory.args = {
  story: {
    image: {
      url: 'https://images.memorix.nl/ams/thumb/1000x1000/87d81163-42b2-16f2-6890-dc5c2d22408d.jpg',
      altText: 'Chez Diederichs, Frères, Marché au fleurs, à Amsterdam',
    },
    title: 'Hier komt de naam van je straat vandaan.',
    contents:
      "Genoemd naar drie woningen onder een dak, 't Keyserrijck genaamd, die in de zestiende eeuw hier op de hoek van de tegenwoordige Spuistraat stonden. In die tijd noemde men het steegje 't Keizerrijksteegje.",
    visitUrl: '#',
    visitUrlText: 'Lees meer',
  },
}

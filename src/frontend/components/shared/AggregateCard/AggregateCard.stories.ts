import type { Meta, StoryFn } from '@storybook/vue3'

import AggregateCard, { AggregateCardProps } from './index.vue'

export default {
  title: 'Shared/AggregateCard',
  component: AggregateCard,
} as Meta<typeof AggregateCard>

const Template: StoryFn<typeof AggregateCard> = (args: AggregateCardProps) => ({
  components: { AggregateCard },
  setup() {
    return { args }
  },
  template: '<AggregateCard v-bind="args" />',
})

export const AggregateCardStoryBees = Template.bind({})
AggregateCardStoryBees.args = {
  count: 10,
  type: 'aggregate_bees',
}

export const AggregateCardStoryTrees = Template.bind({})
AggregateCardStoryTrees.args = {
  count: 10,
  type: 'aggregate_trees',
}

export const AggregateCardStoryTreeSpecies = Template.bind({})
AggregateCardStoryTreeSpecies.args = {
  count: 10,
  type: 'aggregate_tree_species',
}

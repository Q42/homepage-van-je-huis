import type { Meta, StoryFn } from '@storybook/vue3'

import Icon, { IconProps } from './index.vue'

export default {
  title: 'Shared/Icons',
  component: Icon,
  tags: ['autodocs'],
} as Meta<typeof Icon>

const Template: StoryFn<typeof Icon> = (args: IconProps) => ({
  components: { Icon },
  setup() {
    return { args }
  },
  template: '<Icon v-bind="args"/>',
})

export const Logo = Template.bind({})
Logo.args = {
  type: 'logo',
}

export const LogoNoText = Template.bind({})
LogoNoText.args = {
  type: 'logo--no-text',
  height: 40,
  width: 12,
}

export const Search = Template.bind({})
Search.args = {
  type: 'search',
  height: 24,
  width: 24,
}

export const Link = Template.bind({})
Link.args = {
  type: 'link',
  height: 13,
  width: 13,
}

export const Stories = Template.bind({})
Stories.args = {
  type: 'stories',
  height: 24,
  width: 24,
}

export const Calendar = Template.bind({})
Calendar.args = {
  type: 'calendar',
  height: 24,
  width: 24,
}

export const Close = Template.bind({})
Close.args = {
  type: 'close',
  height: 24,
  width: 24,
}

export const Bees = Template.bind({})
Bees.args = {
  type: 'bees',
}

export const Trees = Template.bind({})
Trees.args = {
  type: 'trees',
}

export const TreeSpecies = Template.bind({})
TreeSpecies.args = {
  type: 'tree-species',
}

export const Location = Template.bind({})
Location.args = {
  type: 'location',
}

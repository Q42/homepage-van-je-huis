import type { Meta, StoryFn } from '@storybook/vue3'

import Link, { LinkProps } from './index.vue'

export default {
  title: 'Shared/Link',
  component: Link,
} as Meta<typeof Link>

const Template: StoryFn<typeof Link> = (args: LinkProps) => ({
  components: { Link },
  setup() {
    return { args }
  },
  template: '<Link v-bind="args" />',
})

export const LinkStory = Template.bind({})
LinkStory.args = {
  href: '#',
  label: 'ik ben super link',
}

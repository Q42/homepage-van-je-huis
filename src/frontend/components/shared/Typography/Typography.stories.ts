import type { Meta, StoryFn } from '@storybook/vue3'

import Typography from './index.vue'

const variantsArray = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'body',
  'body-small',
  'quote',
  'intro',
]

export default {
  title: 'Shared/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    classes: {
      table: { disable: true },
    },
    as: {
      table: { disable: true },
    },
    variant: {
      options: variantsArray,
    },
  },
} as Meta<typeof Typography>

const Template: StoryFn<typeof Typography> = (args: any) => ({
  components: { Typography },
  setup() {
    return { args }
  },
  template: `<Typography v-bind="args">${args.default}</Typography>`,
})

export const Heading1 = Template.bind({})
Heading1.args = {
  variant: 'h1',
  default: 'Heading 1',
}

export const Heading2 = Template.bind({})
Heading2.args = {
  variant: 'h2',
  default: 'Heading 2',
}

export const Heading3 = Template.bind({})
Heading3.args = {
  variant: 'h3',
  default: 'Heading 3',
}

export const Heading4 = Template.bind({})
Heading4.args = {
  variant: 'h4',
  default: 'Heading 4',
}

export const Heading5 = Template.bind({})
Heading5.args = {
  variant: 'h5',
  default: 'Heading 5',
}

export const Heading6 = Template.bind({})
Heading6.args = {
  variant: 'h6',
  default: 'Heading 6',
}

export const Quote = Template.bind({})
Quote.args = {
  variant: 'quote',
  default: 'Quote',
}

export const Intro = Template.bind({})
Intro.args = {
  variant: 'intro',
  default:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, vestibulum mi nec, ultrices ipsum.',
}

export const Body = Template.bind({})
Body.args = {
  variant: 'body',
  default:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, vestibulum mi nec, ultrices ipsum.',
}

export const BodySmall = Template.bind({})
BodySmall.args = {
  variant: 'body-small',
  default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
}

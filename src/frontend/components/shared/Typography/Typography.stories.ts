import type { Meta, StoryFn } from '@storybook/vue3'

import Typography, { TypographyProps } from './index.vue'

export default {
  title: 'Shared/Shared/Typography',
  component: Typography,
} as Meta<typeof Typography>

const Template: StoryFn<typeof Typography> = (args: TypographyProps) => ({
  components: { Typography },
  setup() {
    return { args }import type { Meta, StoryFn } from '@storybook/vue3'

    import Typography from './index.vue'
    
    const variantsArray = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'body', 'body-large']
    
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
    
    export const BodyLarge = Template.bind({})
    BodyLarge.args = {
      variant: 'body-large',
      default: 'Body large',
    }
    
    export const Body = Template.bind({})
    Body.args = {
      variant: 'body',
      default: 'Body',
    }
    
    export const Label = Template.bind({})
    Label.args = {
      variant: 'label',
      default: 'Label',
    }
    
    export const LabelBig = Template.bind({})
    LabelBig.args = {
      variant: 'label-big',
      default: 'Label Big',
    }
    
  },
  template: '<Typography v-bind="args" />',
})

export const TypographyStory = Template.bind({})
TypographyStory.args = {}

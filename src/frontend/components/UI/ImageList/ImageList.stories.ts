import type { Meta, StoryFn } from '@storybook/vue3'

import ImageList, { ImageListProps } from './index.vue'

export default {
  title: 'Ui/ImageList',
  component: ImageList,
} as Meta<typeof ImageList>

const Template: StoryFn<typeof ImageList> = (args: ImageListProps) => ({
  components: { ImageList },
  setup() {
    return { args }
  },
  template: '<ImageList v-bind="args" />',
})

export const ImageListStory = Template.bind({})
ImageListStory.args = {}

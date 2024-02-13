import type { Meta, StoryFn } from '@storybook/vue3'

import Image, { ImageProps } from './index.vue'
import { mockImages } from './MockImages/mockImages'

export default {
  title: 'Shared/Image',
  component: Image,
  tags: ['autodocs'],
} as Meta<typeof Image>

const Template: StoryFn<typeof Image> = (args: ImageProps) => ({
  components: { Image },
  setup() {
    return { args }
  },
  template: '<Image v-bind="args" />',
})

export const ImageOne = Template.bind({})
ImageOne.args = {
  image: mockImages[0],
}

export const ImageTwo = Template.bind({})
ImageTwo.args = {
  image: mockImages[1],
}

export const ImageThree = Template.bind({})
ImageThree.args = {
  image: mockImages[2],
}

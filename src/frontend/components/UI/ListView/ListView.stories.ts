import type { Meta, StoryFn } from '@storybook/vue3'

import ListView, { ListViewProps } from './index.vue'

export default {
  title: 'Ui/ListView',
  component: ListView,
} as Meta<typeof ListView>

const Template: StoryFn<typeof ListView> = (args: ListViewProps) => ({
  components: { ListView },
  setup() {
    return { args }
  },
  template: '<ListView v-bind="args" />',
})

const images = [
  {
    image: {
      url: 'https://amsterdam.kunstwacht.nl/cache/f/7/8/f78fafcc62a48652bd13dfb91a39f960_700_540.jpg',
      altText: 'Pauze',
    },
    title: 'Pauze',
    visitUrl: 'https://amsterdam.kunstwacht.nl/kunstwerken/bekijk/1384-pauze',
  },
  {
    image: {
      url: 'https://amsterdam.kunstwacht.nl/cache/7/1/2/712a4c926e524ac743d3ef72f3626d5b_700_540.jpg',
      altText: 'Lusvormig object',
    },
    title: 'Lusvormig object',
    visitUrl:
      'https://amsterdam.kunstwacht.nl/kunstwerken/bekijk/1417-lusvormig-object',
  },
  {
    image: {
      url: 'https://amsterdam.kunstwacht.nl/cache/d/2/7/d270165f07412de53c0d8ddc0ebbff74_700_540.jpg',
      altText: 'Phoenix, oorlogsgedenkteken Slachtoffers Noord',
    },
    title: 'Phoenix, oorlogsgedenkteken Slachtoffers Noord',
    visitUrl:
      'https://amsterdam.kunstwacht.nl/kunstwerken/bekijk/1406-phoenix-oorlogsgedenkteken-slachtoffers-noord',
  },
  {
    image: {
      url: 'https://amsterdam.kunstwacht.nl/cache/a/f/c/afc75cf7af0c9530a3c66e89a3361c13_700_540.jpg',
      altText: 'Zonder titel - Volten',
    },
    title: 'Zonder titel - Volten',
    visitUrl:
      'https://amsterdam.kunstwacht.nl/kunstwerken/bekijk/1427-zonder-titel-volten',
  },
  {
    image: {
      url: 'https://amsterdam.kunstwacht.nl/cache/1/b/2/1b2dbf1c38841b219373efc463937de7_700_540.jpg',
      altText: 'Ringvormig object met zwerfkei',
    },
    title: 'Ringvormig object met zwerfkei',
    visitUrl:
      'https://amsterdam.kunstwacht.nl/kunstwerken/bekijk/1408-ringvormig-object-met-zwerfkei',
  },
  {
    image: {
      url: 'https://amsterdam.kunstwacht.nl/cache/8/b/6/8b6f37fdfab2c4c3f1a3dad5615b8bed_700_540.jpg',
      altText: 'Tegeltableau Wingerdweg, Barmhartige Samaritaan',
    },
    title: 'Tegeltableau Wingerdweg, Barmhartige Samaritaan',
    visitUrl:
      'https://amsterdam.kunstwacht.nl/kunstwerken/bekijk/1462-tegeltableau-wingerdweg-barmhartige-samaritaan',
  },
  {
    image: {
      url: 'https://amsterdam.kunstwacht.nl/cache/5/4/c/54c609913c769ecd746b66b425b92620_700_540.jpg',
      altText: 'Tegeltableau Wingerdweg, Spelende Kinderen',
    },
    title: 'Tegeltableau Wingerdweg, Spelende Kinderen',
    visitUrl:
      'https://amsterdam.kunstwacht.nl/kunstwerken/bekijk/1463-tegeltableau-wingerdweg-spelende-kinderen',
  },
  {
    image: {
      url: 'https://amsterdam.kunstwacht.nl/cache/1/3/e/13e7ddd423ac612007c3048fae3b414f_700_540.jpg',
      altText: 'Emaille platen',
    },
    title: 'Emaille platen',
    visitUrl:
      'https://amsterdam.kunstwacht.nl/kunstwerken/bekijk/1396-emaille-platen',
  },
  {
    image: {
      url: 'https://amsterdam.kunstwacht.nl/cache/f/e/2/fe29cc9353deead2a34559f2f5811e3f_700_540.jpg',
      altText: 'Vrouwfiguren',
    },
    title: 'Vrouwfiguren',
    visitUrl:
      'https://amsterdam.kunstwacht.nl/kunstwerken/bekijk/1383-vrouwfiguren',
  },
  {
    image: {
      url: 'https://amsterdam.kunstwacht.nl/cache/6/b/5/6b511b523f6a0bff97b8d5d43d6e986b_700_540.jpg',
      altText: 'Ks 619',
    },
    title: 'Ks 619',
    visitUrl: 'https://amsterdam.kunstwacht.nl/kunstwerken/bekijk/17692-ks-619',
  },
  {
    image: {
      url: 'https://amsterdam.kunstwacht.nl/cache/0/5/1/05158e8bdc3e13f20af7e75b9ab1c96a_700_540.jpg',
      altText: 'Friendly Fire',
    },
    title: 'Friendly Fire',
    visitUrl:
      'https://amsterdam.kunstwacht.nl/kunstwerken/bekijk/20943-friendly-fire',
  },
  {
    image: {
      url: 'https://amsterdam.kunstwacht.nl/cache/1/2/4/124acc756b0b6e76d2427b17685c6638_700_540.jpg',
      altText: 'Zonder titel - Meursing',
    },
    title: 'Zonder titel - Meursing',
    visitUrl:
      'https://amsterdam.kunstwacht.nl/kunstwerken/bekijk/1415-zonder-titel-meursing',
  },
]

export const ListViewStory = Template.bind({})
ListViewStory.args = {
  images,
}

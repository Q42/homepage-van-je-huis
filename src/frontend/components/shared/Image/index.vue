<template>
  <img class="image" :src="image.url" :alt="image.altText" />
</template>

<script setup lang="ts">
import { Image } from '@/models/Image'

export interface ImageProps {
  image: Image
}

const getImageWidth = () => {
  return props.image.width ? props.image.width + 'px' : '100%'
}

const imageWidth = computed(getImageWidth)

const props = defineProps<ImageProps>()
</script>

<style lang="less" scoped>
.image {
  width: v-bind(imageWidth);
  position: relative;
  overflow: hidden;
}
</style>

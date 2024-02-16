<template>
  <img class="image" :src="image.url" :alt="image.altText" />
</template>

<script setup lang="ts">
import { ImageRef } from '../../../../common/apiSchema/shared'

export interface ImageProps {
  image: ImageRef
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

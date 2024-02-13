<template>
  <img class="image" :src="image.src" :alt="image.alt" />
</template>

<script setup lang="ts">
type Image = {
  src: string
  alt: string
  width?: number
}

export interface ImageProps {
  image: Image
}

const getImageWidth = () => {
  return props.image.width + 'px' || '100%'
}

const props = defineProps<ImageProps>()
</script>

<style lang="less" scoped>
.image {
  width: v-bind(getImageWidth());
  position: relative;
  overflow: hidden;
}
</style>

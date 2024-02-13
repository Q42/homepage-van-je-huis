<template>
  <div class="image-list">
    <div
      v-for="(image, index) in props.images"
      :key="index"
      class="image-wrapper"
    >
      <SharedImage :image="image.image" />
      <SharedTypography variant="body" :compact="true">{{
        image.title
      }}</SharedTypography>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Image } from '@/models/Image'

type ImageWithMetaData = {
  image: Image
  title: string
  visitUrl?: string
}

export interface ImageListProps {
  images: ImageWithMetaData[]
}

const props = defineProps<ImageListProps>()
</script>

<style lang="less" scoped>
.image-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.image-wrapper {
  width: 615px;
  max-width: 75%;
}
</style>

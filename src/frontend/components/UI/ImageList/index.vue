<template>
  <div class="image-list"></div>
</template>

<script setup lang="ts">
import { Image } from '~/models/Image'

type ImageWithMetaData = {
  image: Image
  title: string
  visitUrl?: string
  type: string // TODO: Change to PresentEntityType
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
  background-color: silver;
}
</style>

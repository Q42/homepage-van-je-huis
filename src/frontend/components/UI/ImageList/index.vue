<template>
  <div class="image-list">
    <div
      v-for="(image, index) in props.images"
      :key="index"
      class="image-wrapper"
    >
      <SharedImage v-if="image.image" :image="image.image" />
      <div class="image-info">
        <SharedTypography variant="body" :compact="true">{{
          image.title
        }}</SharedTypography>
        <SharedLink
          v-if="image.visitUrl"
          :href="image.visitUrl"
          :label="$t(getTranslationKey('images.externalLink'))"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ImageRef } from '../../../../common/apiSchema/shared'
import { getTranslationKey } from '@/translations'

type ImageWithMetaData = {
  image: ImageRef
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
  gap: 1.5rem;
  align-items: center;
  padding-bottom: 1.5rem;
}

.image-wrapper {
  width: 615px;
  max-width: 75%;
}

.image-info {
  display: flex;
  gap: 5px;
}
</style>

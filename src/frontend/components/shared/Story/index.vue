<template>
  <div class="story-card">
    <SharedImage v-if="story.image" :image="story.image" />
    <div class="storycard__content">
      <SharedTypography variant="h5">{{ story.title }}</SharedTypography>
      <SharedTypography variant="body" :compact="true">{{
        story.contents
      }}</SharedTypography>
    </div>
    <SharedLink
      v-if="story.visitUrl"
      :href="story.visitUrl"
      :label="story.visitUrlText || story.visitUrl"
    />
  </div>
</template>

<script setup lang="ts">
import { ImageRef } from '../../../../common/apiSchema/shared'

export interface StoryProps {
  story: {
    image?: ImageRef
    title: string
    contents: string
    visitUrl?: string
    visitUrlText?: string
  }
}

const props = defineProps<StoryProps>()
</script>

<style lang="less" scoped>
.story-card {
  width: 100%;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.storycard__content {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}
</style>

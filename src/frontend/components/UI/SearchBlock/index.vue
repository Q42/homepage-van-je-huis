<template>
  <div class="search-block">
    <div class="title">
      <SharedTypography variant="h1">{{
        $t(getTranslationKey('home.title'))
      }}</SharedTypography>
      <SharedTypography variant="body" :compact="true">{{
        $t(getTranslationKey('home.subtitle'))
      }}</SharedTypography>
    </div>
    <SharedInput
      v-model:value="search"
      :placeholder="$t(getTranslationKey('home.inputPlaceholder'))"
      icon="search"
    />
  </div>
</template>
import { getTranslationKey } from '~/translations';

<script setup lang="ts">
import { getTranslationKey } from '@/translations'
export interface SearchBlockProps {
  // TODO
}

const props = defineProps<SearchBlockProps>()

const search = ref('')

onUpdated(() => {
  console.log('search', search.value)
})
</script>

<style lang="less" scoped>
.search-block {
  position: absolute;
  height: calc(100% - @header-height);
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: fit-content;
  justify-content: center;
  left: 50%;
  transform: translate(-50%, -@header-height);
}

.title {
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

<template>
  <div class="search-block">
    <div class="title">
      <SharedTypography variant="h1">{{
        $t(getTranslationKey('home.title'))
      }}</SharedTypography>
      <SharedTypography variant="body">{{
        $t(getTranslationKey('home.subtitle'))
      }}</SharedTypography>
    </div>
    <form @submit.prevent="handleSubmit">
      <SharedInput
        v-model:value="search"
        :placeholder="$t(getTranslationKey('home.inputPlaceholder'))"
        icon="search"
      />
      <TransitionFade>
        <div v-if="search" class="autocomplete-panel"></div>
      </TransitionFade>
    </form>
  </div>
</template>
import { getTranslationKey } from '@/translations';

<script setup lang="ts">
import { getTranslationKey } from '@/translations'
export interface SearchBlockProps {
  // TODO
}

const props = defineProps<SearchBlockProps>()

const search = ref('')

const handleSubmit = () => {
  console.log('submit', search.value)
}
</script>

<style lang="less" scoped>
.search-block {
  position: relative;
  height: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: fit-content;
  justify-content: center;
  margin-top: calc(25%);
  transform: translateY(-50%);
}

.autocomplete-panel {
  position: absolute;
  height: 300px;
  width: 100%;
  top: 100%;
  background: gray;
}

.title {
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

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
        <ul v-if="search" class="autocomplete-panel">
          <li @click="() => (search = '5a58dacbfbb0dbf25da0a2041a8ae6f4')">
            5a58dacbfbb0dbf25da0a2041a8ae6f4
          </li>
          <li>Prinsengracht</li>
          <li>Keizersgracht</li>
          <li>Herengracht</li>
          <li>Rozengracht</li>
          <li>Leidsestraat</li>
          <li>Van Baerlestraat</li>
          <li>Kalverstraat</li>
          <li>Nieuwezijds Voorburgwal</li>
          <li>Oudezijds Voorburgwal</li>
          <li>Jordaan</li>
        </ul>
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

const router = useRouter()
const { locale } = useI18n()

const search = ref('')

const handleSubmit = () => {
  router.push('/' + locale.value + '/' + search.value)
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
  margin-top: calc(50vh - @header-height);
  transform: translateY(-50%);
}

.autocomplete-panel {
  position: absolute;
  max-height: 300px;
  width: 100%;
  top: 100%;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 0 0 8px 8px;
  overflow-y: auto;
  border: solid 1px @neutral-grey1;
}

.autocomplete-panel li {
  list-style: none;
  padding: 10px;
}

.title {
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

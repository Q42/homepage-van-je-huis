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
    <form class="form" @submit.prevent="handleSubmit">
      <SharedInput
        v-model:value="street"
        :disabled="!Boolean(streets)"
        class="street-input"
        :placeholder="$t(getTranslationKey('home.streetInputPlaceHolder'))"
      />
      <SharedInput
        v-model:value="houseNumber"
        class="house-number-input"
        :placeholder="$t(getTranslationKey('home.houseNumberInputPlaceHolder'))"
        icon="search"
      />
      <TransitionFade>
        <ul v-if="street" class="autocomplete-panel"></ul>
      </TransitionFade>
    </form>
  </div>
</template>
import { getTranslationKey } from '@/translations';

<script setup lang="ts">
import { getTranslationKey } from '@/translations'
import { useAutocompleteStore } from '@/store/autocompleteStore'
export interface SearchBlockProps {
  // TODO
}

const props = defineProps<SearchBlockProps>()

const router = useRouter()
const { locale } = useI18n()
const addressService = useAddressService()
const autocompleteStore = useAutocompleteStore()

const streets = computed(() => autocompleteStore.autocompleteStreets)
const street = ref('')
const houseNumber = ref('')

const handleSubmit = () => {
  router.push('/' + locale.value + '/' + street.value)
}

onMounted(async () => {
  await addressService.getAutocompleteStreets()
})
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

.street-input {
  flex: 100;
}

.house-number-input {
  flex: 2;
}

.form {
  display: flex;
  gap: 5px;
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

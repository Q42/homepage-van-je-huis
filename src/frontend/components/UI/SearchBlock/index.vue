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
        class="street-input"
        v-model:value="street"
        :placeholder="$t(getTranslationKey('home.streetInputPlaceHolder'))"
      />
      <SharedInput
        class="house-number-input"
        v-model:value="houseNumber"
        :placeholder="$t(getTranslationKey('home.houseNumberInputPlaceHolder'))"
        icon="search"
      />
      <TransitionFade>
        <ul v-if="street" class="autocomplete-panel">
          <li
            v-for="id in tempAutoCompleteList"
            :key="id"
            @click="() => (street = id)"
          >
            5a58dacbfbb0dbf25da0a2041a8ae6f4
          </li>
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

const street = ref('')
const houseNumber = ref('')

const handleSubmit = () => {
  router.push('/' + locale.value + '/' + street.value)
}
// TODO: Remove this
const tempAutoCompleteList = [
  '4e67ac553e1b337b6901cab7409034d7',
  '4e67ac553e1b337b6901cab7409034d7',
  '22b8eeafdeac4649f4270b557d93ec45',
  '36621c0cd0d2bc427286ce283876b4b7',
  '79678b8bda840894a0ca2bf3c32fff80',
  '13790327f965d243df5ab2b4921bf0e4',
  'bb479ec6e7d342d353bb53a44a92a5ef',
]
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

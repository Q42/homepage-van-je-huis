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
    <div v-if="hasError" class="error">
      {{ $t(getTranslationKey(error as TranslationKey)) }}
    </div>
    <form class="form" @submit.prevent="handleSubmit">
      <SharedInput
        v-model:value="street"
        input-id="street-input"
        :disabled="!Boolean(streets)"
        class="street-input"
        :placeholder="$t(getTranslationKey('home.streetInputPlaceHolder'))"
      />
      <SharedInput
        v-model:value="houseNumber"
        input-id="house-number-input"
        :disabled="!Boolean(houseNumbers)"
        class="house-number-input"
        :placeholder="$t(getTranslationKey('home.houseNumberInputPlaceHolder'))"
        icon="search"
      />
      <TransitionFade>
        <ul v-if="streetAutocompleteIsOpen" class="autocomplete-panel">
          <li
            v-for="(autocompleteStreet, index) in filteredStreets"
            :key="index"
          >
            <button
              ref="streetItems"
              :class="{
                'autocomplete-item--focused': index === focussedStreetIndex,
              }"
              type="button"
              @click="() => selectStreet(autocompleteStreet)"
              @mouseenter="() => (focussedStreetIndex = index)"
              @mouseleave="() => (focussedStreetIndex = null)"
            >
              {{ autocompleteStreet }}
            </button>
          </li>
        </ul>
      </TransitionFade>
      <TransitionFade>
        <ul v-if="houseNumberAutocompleteIsOpen" class="autocomplete-panel">
          <li
            v-for="(autocompleteHouseNumber, index) in filteredHouseNumbers"
            :key="index"
          >
            <button
              ref="streetItems"
              :class="{
                'autocomplete-item--focused':
                  index === focussedHouseNumberIndex,
              }"
              type="button"
              @click="() => selectHouseNumber(autocompleteHouseNumber)"
              @mouseenter="() => (focussedHouseNumberIndex = index)"
              @mouseleave="() => (focussedHouseNumberIndex = null)"
            >
              {{ autocompleteHouseNumber }}
            </button>
          </li>
        </ul>
      </TransitionFade>
    </form>
  </div>
</template>

<script setup lang="ts">
import { getTranslationKey, TranslationKey } from '@/translations'
export interface SearchBlockProps {
  // TODO
}

const props = defineProps<SearchBlockProps>()

const router = useRouter()
const { locale } = useI18n()

const streetItems = ref<HTMLButtonElement[] | null>(null)
const street = ref('')
const houseNumber = ref('')
const error: Ref<TranslationKey | null> = ref(null)
const hasError = computed(() => Boolean(error.value))

const focussedStreetIndex: Ref<number | null> = ref(null)
const focussedHouseNumberIndex: Ref<number | null> = ref(null)

const handleKeyboardFocus = (
  direction: 'down' | 'up',
  focussedIdentifier: Ref<number | null>,
  list: Ref<string[] | undefined>,
) => {
  if (!list.value || !streetItems.value) {
    return
  }

  if (direction === 'down') {
    if (
      focussedIdentifier.value === null ||
      focussedIdentifier.value === list.value.length - 1
    ) {
      focussedIdentifier.value = 0
      streetItems.value[0].focus()
    } else if (focussedIdentifier.value < list.value.length - 1) {
      focussedIdentifier.value++
      streetItems.value[focussedIdentifier.value].focus()
    }
  } else if (direction === 'up') {
    if (focussedIdentifier.value === null || focussedIdentifier.value === 0) {
      focussedIdentifier.value = list.value.length - 1
    } else if (focussedIdentifier.value > 0) {
      focussedIdentifier.value--
    }
  }
}

const {
  streetAutocompleteIsOpen,
  houseNumberAutocompleteIsOpen,
  filteredHouseNumbers,
  filteredStreets,
  streets,
  houseNumbers,
} = useSearchAutocomplete(street, houseNumber)

const selectStreet = (selectedStreet: string) => {
  error.value = null
  street.value = selectedStreet
}

const selectHouseNumber = (selectedHouseNumber: string) => {
  error.value = null
  houseNumber.value = selectedHouseNumber
}

const handleSubmit = () => {
  if (!street.value || !houseNumber.value) {
    error.value = getTranslationKey('search.invalideAddress')
    return
  }

  router.push(
    '/' + locale.value + '/' + slugifyAddress(street.value, houseNumber.value),
  )
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown') {
    if (streetAutocompleteIsOpen.value) {
      handleKeyboardFocus('down', focussedStreetIndex, filteredStreets)
    } else if (houseNumberAutocompleteIsOpen.value) {
      handleKeyboardFocus(
        'down',
        focussedHouseNumberIndex,
        filteredHouseNumbers,
      )
    }
  } else if (event.key === 'ArrowUp') {
    if (streetAutocompleteIsOpen.value) {
      handleKeyboardFocus('up', focussedStreetIndex, filteredStreets)
    } else if (houseNumberAutocompleteIsOpen.value) {
      handleKeyboardFocus('up', focussedHouseNumberIndex, filteredHouseNumbers)
    }
  } else if (event.key === 'Enter') {
    if (streetAutocompleteIsOpen.value) {
      if (filteredStreets.value && focussedStreetIndex.value) {
        selectStreet(filteredStreets.value[focussedStreetIndex.value])
      }
    } else if (houseNumberAutocompleteIsOpen.value) {
      if (filteredHouseNumbers.value && focussedHouseNumberIndex.value) {
        selectHouseNumber(
          filteredHouseNumbers.value[focussedHouseNumberIndex.value],
        )
      }
    } else {
      handleSubmit()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})
</script>

<style lang="less" scoped>
.search-block {
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

.street-input {
  flex: 100;
}

.house-number-input {
  flex: 2;
}

.form {
  position: relative;
  display: flex;
  gap: 5px;
}
// TODO: temp styles, not designed
.error {
  padding: 10px 20px;
  background: lighten(@primary-red, 50%);
  border-radius: 5px;
  color: @primary-black;
  border: 2px solid @primary-red;
}

.autocomplete-panel {
  background: @primary-white;
  position: absolute;
  max-height: 300px;
  width: 100%;
  top: 100%;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  border-radius: 0 0 8px 8px;
  overflow-y: auto;
  border: solid 1px @neutral-grey1;
  z-index: 1;
}

.autocomplete-panel button {
  all: unset;
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
  cursor: pointer;

  &:hover {
    background: @neutral-grey1;
  }
}

.autocomplete-panel .autocomplete-item--focused {
  background: @neutral-grey1;
}

.autocomplete-panel li {
  list-style: none;
  z-index: inherit;
}

.title {
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

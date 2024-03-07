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
        :class="{ 'input-error': hasError }"
        :placeholder="$t(getTranslationKey('home.streetInputPlaceHolder'))"
      />
      <SharedInput
        v-model:value="houseNumber"
        :input-id="referenceIds.houseNumberInput"
        :disabled="!Boolean(houseNumbers)"
        class="house-number-input"
        :class="{ 'input-error': hasError }"
        :placeholder="$t(getTranslationKey('home.houseNumberInputPlaceHolder'))"
      />
      <!-- TODO: add aria label -->
      <button type="submit" class="icon-btn">
        <SharedIcon :height="24" :width="24" type="search" />
      </button>

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
        <ul
          v-if="houseNumberAutocompleteIsOpen && !houseNumberIsSelected"
          class="autocomplete-panel"
        >
          <li
            v-for="(autocompleteHouseNumber, index) in filteredHouseNumbers"
            :key="index"
          >
            <button
              ref="houseNumberItems"
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
    <div v-if="hasError" class="error">
      {{ $t(getTranslationKey(error as TranslationKey)) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { referenceIds } from '@/config/referenceIds'
import { getTranslationKey, TranslationKey } from '@/translations'
import { useAddressStore } from '@/store/addressStore'
export interface SearchBlockProps {
  // TODO
}

defineProps<SearchBlockProps>()

const router = useRouter()
const { locale } = useI18n()
const { fetchAddressData } = useAddressStore()

const streetItems = ref<HTMLButtonElement[] | null>(null)
const houseNumberItems = ref<HTMLButtonElement[] | null>(null)
const street = ref('')
const houseNumber = ref('')
const error: Ref<TranslationKey | null> = ref(null)
const hasError = computed(() => Boolean(error.value))
const houseNumberIsSelected = ref(false)

const focussedStreetIndex: Ref<number | null> = ref(null)
const focussedHouseNumberIndex: Ref<number | null> = ref(null)

const handleKeyboardFocus = (
  direction: 'ArrowDown' | 'ArrowUp',
  focussedIdentifier: Ref<number | null>,
  list: Ref<string[] | undefined>,
  focussableItems: Ref<HTMLButtonElement[] | null>,
) => {
  if (!list.value || !focussableItems.value) {
    return
  }

  if (direction === 'ArrowDown') {
    if (
      focussedIdentifier.value === null ||
      focussedIdentifier.value === list.value.length - 1
    ) {
      focussedIdentifier.value = 0
    } else if (focussedIdentifier.value < list.value.length - 1) {
      focussedIdentifier.value++
    }
    focussableItems.value[focussedIdentifier.value].focus()
  } else if (direction === 'ArrowUp') {
    if (focussedIdentifier.value === null || focussedIdentifier.value === 0) {
      focussedIdentifier.value = list.value.length - 1
    } else if (focussedIdentifier.value > 0) {
      focussedIdentifier.value--
    }
    focussableItems.value[focussedIdentifier.value].focus()
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
  const houseNumberInput = document.getElementById(
    referenceIds.houseNumberInput,
  )
  if (houseNumberInput) {
    houseNumberInput.focus()
  }
  houseNumberIsSelected.value = true
}

const handleSubmit = async () => {
  if (!street.value || !houseNumber.value) {
    error.value = getTranslationKey('search.invalideAddress')
    return
  }

  try {
    await fetchAddressData(slugifyAddress(street.value, houseNumber.value))
  } catch (e) {
    // TODO: mabye add a more specific error message
    error.value = getTranslationKey('search.addressNotFound')
    return
  }

  await router.push(
    '/' + locale.value + '/' + slugifyAddress(street.value, houseNumber.value),
  )
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (
    event.key === 'ArrowDown' ||
    event.key === 'ArrowUp' ||
    event.key === 'Tab'
  ) {
    if (streetAutocompleteIsOpen.value) {
      handleKeyboardFocus(
        event.key === 'Tab' ? 'ArrowDown' : event.key,
        focussedStreetIndex,
        filteredStreets,
        streetItems,
      )
    } else if (houseNumberAutocompleteIsOpen.value) {
      handleKeyboardFocus(
        event.key === 'Tab' ? 'ArrowDown' : event.key,
        focussedHouseNumberIndex,
        filteredHouseNumbers,
        houseNumberItems,
      )
    }
  }
}

const handleHouseNumberInputInteraction = () => {
  houseNumberIsSelected.value = false
}

onMounted(() => {
  const houseNumberInput = document.getElementById(
    referenceIds.houseNumberInput,
  )

  if (houseNumberInput) {
    houseNumberInput.addEventListener(
      'focus',
      handleHouseNumberInputInteraction,
    )
    houseNumberInput.addEventListener(
      'change',
      handleHouseNumberInputInteraction,
    )
  }

  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  const houseNumberInput = document.getElementById(
    referenceIds.houseNumberInput,
  )

  if (houseNumberInput) {
    houseNumberInput.removeEventListener(
      'focus',
      handleHouseNumberInputInteraction,
    )
    houseNumberInput.removeEventListener(
      'change',
      handleHouseNumberInputInteraction,
    )
  }
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style lang="less" scoped>
.search-block {
  display: flex;
  flex-direction: column;
  width: 90%;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media @mq-from-tablet {
    width: fit-content;
  }
}

.input-error {
  border-color: @primary-red;
}

.error {
  color: @primary-red;
}

.street-input {
  width: 60%;

  @media @mq-from-tablet {
    width: 70%;
  }
}

.house-number-input {
  width: 40%;

  @media @mq-from-tablet {
    width: 30%;
  }
}

.form {
  position: relative;
  display: flex;
  gap: 5px;
  margin-bottom: 0.5rem;
}
// TODO: temp styles, not designed

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
  margin-bottom: 1.5rem;
}

.icon-btn {
  all: unset;
  padding: 0.5rem 0;
  cursor: pointer;
  width: 24px;

  &:focus-visible {
    outline: 1px solid @neutral-grey2;
  }
}
</style>

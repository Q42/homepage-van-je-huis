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
            @click="street = autocompleteStreet"
          >
            {{ autocompleteStreet }}
          </li>
        </ul>
      </TransitionFade>
      <TransitionFade>
        <ul v-if="houseNumberAutocompleteIsOpen" class="autocomplete-panel">
          <li
            v-for="(autocompleteHouseNumber, index) in houseNumbers"
            :key="index"
            @click="houseNumber = autocompleteHouseNumber"
          >
            {{ autocompleteHouseNumber }}
          </li>
        </ul>
      </TransitionFade>
    </form>
    <div class="error">Vul een geldig adres in</div>
  </div>
</template>

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

const street = ref('')
const houseNumber = ref('')
const streets = computed(() => autocompleteStore.autocompleteStreets)
const filteredStreets = computed(() => {
  return streets.value
    ?.filter((autocompleteStreet) =>
      autocompleteStreet.toLowerCase().includes(street.value.toLowerCase()),
    )
    .sort()
})
const houseNumbers: Ref<null | string[]> = ref(null)

onUpdated(async () => {
  if (streets.value?.includes(street.value) && street.value) {
    const autocompleteHouseNumbers = await addressService.getHouseNumbers(
      slugifyStreetName(street.value),
    )

    houseNumbers.value = autocompleteHouseNumbers
  } else {
    houseNumbers.value = null
    houseNumber.value = ''
  }
})

const autocompleteListContainsSelectedStreet = computed(() => {
  return streets.value?.includes(street.value)
})

const streetAutocompleteIsOpen = computed(
  () =>
    Boolean(filteredStreets.value) &&
    Boolean(street.value) &&
    !autocompleteListContainsSelectedStreet.value,
)

const houseNumberAutocompleteIsOpen = computed(
  () => Boolean(houseNumbers.value) && Boolean(houseNumber.value),
)

const handleSubmit = () => {
  if (!street.value || !houseNumber.value) {
    return
  }

  router.push(
    '/' + locale.value + '/' + slugifyAddress(street.value, houseNumber.value),
  )
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
// TODO: temp styles, not designed
.error {
  padding: 10px 20px;
  background: lighten(@primary-red, 50%);
  border-radius: 5px;
  color: @primary-black;
  border: 2px solid @primary-red;
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

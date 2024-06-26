import { useAutocompleteStore } from '@/store/autocompleteStore'
import { referenceIds } from '@/config/referenceIds'

// This composable is tightly coupled with the search component. But I wanted to put some
// logic in a separate file to make the component more readable.
export const useSearchAutocomplete = (street: Ref, houseNumber: Ref) => {
  const autocompleteStore = useAutocompleteStore()
  const addressService = useAddressService()

  const streetListContainsSelected = computed(() => {
    return streets.value?.includes(street.value)
  })

  const streets = computed(() => autocompleteStore.autocompleteStreets)
  const filteredStreets = computed(() => {
    return streets.value?.filter((autocompleteStreet) =>
      autocompleteStreet.toLowerCase().startsWith(street.value.toLowerCase()),
    )
  })

  const houseNumbers: Ref<undefined | string[]> = ref()
  const filteredHouseNumbers = computed(() => {
    if (!houseNumber.value) {
      return houseNumbers.value
    } else {
      return houseNumbers.value
        ?.filter((autocompleteHouseNumber) =>
          autocompleteHouseNumber
            .toLowerCase()
            .startsWith(houseNumber.value.toLowerCase()),
        )
        .sort()
    }
  })

  const streetAutocompleteIsOpen = computed(
    () =>
      street.value &&
      Boolean(filteredStreets.value) &&
      !streetListContainsSelected.value,
  )

  const houseNumberInputHasFocus = ref(false)
  const houseNumberAutocompleteIsOpen = computed(() => {
    const filterList = filteredHouseNumbers.value

    return houseNumber.value && filterList && filterList.length > 1
  })

  // We fetch the house numbers if we have a match with an autocomplete street
  onUpdated(async () => {
    if (
      streets.value?.includes(street.value) &&
      street.value &&
      !houseNumbers.value
    ) {
      const autocompleteHouseNumbers = await addressService.getHouseNumbers(
        slugifyStreetName(street.value),
      )
      houseNumbers.value = autocompleteHouseNumbers
      const houseNumbersInput = document.getElementById(
        referenceIds.houseNumberInput,
      )
      if (houseNumbersInput) {
        await nextTick()
        houseNumbersInput.focus()
      }
    } else if (!streets.value?.includes(street.value)) {
      houseNumbers.value = undefined
      houseNumber.value = ''
    }
  })

  const handleFocusIn = () => {
    const houseNumberInput = document.getElementById(
      referenceIds.houseNumberInput,
    )
    houseNumberInputHasFocus.value = document.activeElement === houseNumberInput
  }

  onMounted(async () => {
    await addressService.getAutocompleteStreets()
    document.addEventListener('focusin', handleFocusIn)
  })

  onUnmounted(() => {
    document.removeEventListener('focusin', handleFocusIn)
  })

  return {
    streetAutocompleteIsOpen,
    houseNumberAutocompleteIsOpen,
    filteredHouseNumbers,
    filteredStreets,
    streets,
    houseNumbers,
  }
}

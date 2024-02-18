import { useAutocompleteStore } from '@/store/autocompleteStore'

// This composable is tightly coupled with the search component. But I wanted to put some
// logic in a separate file to make the component more readable.
export const useSearchAutocomplete = (street: Ref, houseNumber: Ref) => {
  const autocompleteStore = useAutocompleteStore()
  const addressService = useAddressService()

  const streetInputIsFocused = ref(false)
  const houseNumberInputIsFocused = ref(false)

  const streetListContainsSelected = computed(() => {
    return streets.value?.includes(street.value)
  })
  const houseNumberListContainsSelected = computed(() => {
    return houseNumbers.value?.includes(houseNumber.value.toUpperCase())
  })

  const streets = computed(() => autocompleteStore.autocompleteStreets)
  const filteredStreets = computed(() => {
    return streets.value
      ?.filter((autocompleteStreet) =>
        autocompleteStreet.toLowerCase().includes(street.value.toLowerCase()),
      )
      .sort()
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
            .includes(houseNumber.value.toLowerCase()),
        )
        .sort()
    }
  })

  const streetAutocompleteIsOpen = computed(
    () =>
      // TODO: Uncomment this
      // streetInputIsFocused.value &&
      Boolean(filteredStreets.value) && !streetListContainsSelected.value,
  )

  const houseNumberAutocompleteIsOpen = computed(
    () =>
      houseNumberInputIsFocused.value && !houseNumberListContainsSelected.value,
  )

  // We fetch the house numbers if we have a match with an autocomplete street
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

  // Focus logic is to enable user frendly autocomplete
  const handleFocusIn = (e: FocusEvent) => {
    const streetInput = document.getElementById('street-input')
    const houseNumberInput = document.getElementById('house-number-input')

    if (e.target === streetInput) {
      streetInputIsFocused.value = true
    } else if (e.target === houseNumberInput) {
      houseNumberInputIsFocused.value = true
    }
  }

  const handleFocusOut = () => {
    streetInputIsFocused.value = false
    houseNumberInputIsFocused.value = false
  }

  onMounted(async () => {
    await addressService.getAutocompleteStreets()
    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)
  })

  onUnmounted(() => {
    document.removeEventListener('focusin', handleFocusIn)
    document.removeEventListener('focusout', handleFocusOut)
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

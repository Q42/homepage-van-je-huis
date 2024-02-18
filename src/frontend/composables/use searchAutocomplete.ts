import { useAutocompleteStore } from '@/store/autocompleteStore'

export const useSearchAutocomplete = (street: Ref, houseNumber: ref) => {
  const autocompleteStore = useAutocompleteStore()
  const addressService = useAddressService()

  const streetInputIsFocused = ref(false)
  const houseNumberInputIsFocused = ref(false)

  const streetAutocompleteListContainsSelectedStreet = computed(() => {
    return streets.value?.includes(street.value)
  })
  const houseNumberAutocompleteListContainsSelectedHouseNumber = computed(
    () => {
      return houseNumbers.value?.includes(houseNumber.value.toUpperCase())
    },
  )

  const streets = computed(() => autocompleteStore.autocompleteStreets)
  const filteredStreets = computed(() => {
    return streets.value
      ?.filter((autocompleteStreet) =>
        autocompleteStreet.toLowerCase().includes(street.value.toLowerCase()),
      )
      .sort()
  })

  const houseNumbers: Ref<null | string[]> = ref(null)
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
      streetInputIsFocused.value &&
      Boolean(filteredStreets.value) &&
      !streetAutocompleteListContainsSelectedStreet.value,
  )

  const houseNumberAutocompleteIsOpen = computed(
    () =>
      houseNumberInputIsFocused.value &&
      !houseNumberAutocompleteListContainsSelectedHouseNumber.value,
  )

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

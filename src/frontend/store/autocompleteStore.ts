import { defineStore } from 'pinia'

export const useAutocompleteStore = defineStore('autocomplete', () => {
  const autocompleteStreets: Ref<string[] | null> = ref(null)

  const setAutocompleteStreets = (streets: string[]) => {
    autocompleteStreets.value = streets
  }

  return { autocompleteStreets, setAutocompleteStreets }
})

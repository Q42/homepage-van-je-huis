import { defineStore } from 'pinia'

export const useAutocompleteStore = defineStore('autocomplete', () => {
  const autocompleteStreets: Ref<string[] | null> = ref(null)

  const setStreets = (streets: string[]) => {
    autocompleteStreets.value = streets
  }

  return { autocompleteStreets, setStreets }
})

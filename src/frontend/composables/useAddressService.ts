import { useAutocompleteStore } from '@/store/autocompleteStore'
import { configVars } from '~/config/vars'

// TODO: better error handling (but wait till api is definitive)

export const useAddressService = () => {
  const autocompleteStore = useAutocompleteStore()

  const getAddressJSONandParse = async (addressSlug: string) => {
    const path = configVars.baseUrl + `/api/address/${addressSlug}.json`
    const response = await fetch(path)
    if (!response.ok) {
      // TODO: Add error handling
      console.error('Error - Adress not found')
      return null
    }
    const jsonData = await response.json()
    return jsonData
  }

  const getAutocompleteStreets = async () => {
    const path = configVars.baseUrl + `/api/resolve/streetNames.json`
    const response = await fetch(path)
    if (!response.ok) {
      // TODO: Add error handling
      console.error('Error - No autocomplete street names found')
      return null
    }
    const jsonData = await response.json()
    autocompleteStore.setAutocompleteStreets(jsonData.streets)
  }

  const getHouseNumbers = async (streetSlug: string) => {
    const path = configVars.baseUrl + `/api/resolve/numbers/${streetSlug}.json`
    const response = await fetch(path)
    if (!response.ok) {
      // TODO: Add error handling
      console.error('Error - No autocomplete house numbers names found')
      return
    }
    const jsonData = await response.json()
    return jsonData.numbers as string[] //TODO: dit kan nog mis gaan
  }

  return {
    getAddressJSONandParse,
    getAutocompleteStreets,
    getHouseNumbers,
  }
}

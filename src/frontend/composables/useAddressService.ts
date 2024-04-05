import { useAutocompleteStore } from '@/store/autocompleteStore'

// TODO: better error handling (but wait till api is definitive)

export const useAddressService = () => {
  const autocompleteStore = useAutocompleteStore()
  const runtimeConfig = useRuntimeConfig()

  const baseUrl = runtimeConfig.public.baseUrl

  const getAddressJSONandParse = async (addressSlug: string) => {
    const path = baseUrl + `/api/address/${addressSlug}.json`
    const response = await fetch(path)
    if (!response.ok) {
      if (response.status === 404) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Address Not Found',
          fatal: true,
        })
      } else {
        // TODO: Maybe more error handling?
        console.log('Error - 500')
      }
      return null
    }
    const jsonData = await response.json()
    return jsonData
  }

  const getAutocompleteStreets = async () => {
    const path = baseUrl + `/api/resolve/streetNames.json`
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
    const path = baseUrl + `/api/resolve/numbers/${streetSlug}.json`
    const response = await fetch(path)
    if (!response.ok) {
      // TODO: Add error handling
      console.error('Error - No autocomplete house numbers names found')
      return
    }
    const jsonData = await response.json()
    return jsonData.numbers as string[] // TODO: dit kan nog mis gaan
  }

  return {
    getAddressJSONandParse,
    getAutocompleteStreets,
    getHouseNumbers,
  }
}

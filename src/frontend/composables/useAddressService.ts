import { TimelineEntry } from '../../common/apiSchema/past'
import { DistanceViewEntry } from '../../common/apiSchema/present'
import { useAutocompleteStore } from '@/store/autocompleteStore'

// TODO: better error handling (but wait till api is definitive)

export const useAddressService = () => {
  const autocompleteStore = useAutocompleteStore()

  const getAddressJSONandParse = async (addressSlug: string) => {
    const filePath = `/api/address/${addressSlug}.json`
    const response = await fetch(filePath)
    if (!response.ok) {
      // TODO: Add error handling
      console.error('Error - Adress not found')
      return null
    }
    const jsonData = await response.json()
    return jsonData
  }

  const getImagesViewModel = (
    slider: (DistanceViewEntry | TimelineEntry)[],
  ) => {
    return slider.map((sliderItem) => {
      return {
        image: sliderItem.image,
        title: sliderItem.title,
        visitUrl: sliderItem.visitUrl,
      }
    })
  }

  const getAutocompleteStreets = async () => {
    const filePath = `/api/resolve/streetNames.json`
    const response = await fetch(filePath)
    if (!response.ok) {
      // TODO: Add error handling
      console.error('Error - No autocomplete street names found')
      return null
    }
    const jsonData = await response.json()
    autocompleteStore.setAutocompleteStreets(jsonData.streets)
  }

  const getHouseNumbers = async (streetSlug: string) => {
    const filePath = `/api/resolve/numbers/${streetSlug}.json`
    const response = await fetch(filePath)
    if (!response.ok) {
      // TODO: Add error handling
      console.error('Error - No autocomplete house numbers names found')
      return null
    }
    const jsonData = await response.json()
    return jsonData.numbers as string[] //TODO: dit kan nog mis gaan
  }

  return {
    getAddressJSONandParse,
    getImagesViewModel,
    getAutocompleteStreets,
    getHouseNumbers,
  }
}

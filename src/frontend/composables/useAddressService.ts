export const useAddressService = () => {
  const getAddressJSONandParse = async (id: string) => {
    const filePath = `/mockdata/address/${id}.json`
    const response = await fetch(filePath)
    if (!response.ok) {
      console.error('404 - Adress not found')
      return null
    }
    const jsonData = await response.json()
    return jsonData
  }

  // TODO: fix typing
  const getImagesViewModel = (slider: any[]) => {
    return slider.map((sliderItem: any) => {
      return {
        image: sliderItem.image,
        title: sliderItem.title,
        visitUrl: sliderItem.visitUrl,
      }
    })
  }

  return { getAddressJSONandParse, getImagesViewModel }
}

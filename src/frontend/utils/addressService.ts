export const getAddressJSONandParse = async (id: string) => {
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
export const getImagesViewModel = (slider: any[]) => {
  return slider.map((sliderItem: any) => {
    return {
      src: sliderItem.url,
      alt: sliderItem.alt,
      title: sliderItem.title,
      visitUrl: sliderItem.visitUrl,
    }
  })
}

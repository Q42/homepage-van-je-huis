export const getAddressJSONandParse = async (id: string) => {
  const filePath = `/mockdata/addressdata/${id}.json`
  const response = await fetch(filePath)
  if (!response.ok) {
    console.log('Error fetching address data')
    return null
  }
  const jsonData = await response.json()
  return jsonData
}

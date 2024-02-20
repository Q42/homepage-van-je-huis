import { PastData } from '../../common/apiSchema/past'
import { AddressRecord } from '../../common/apiSchema/addressRecord'

import { PresentData } from '../../common/apiSchema/present'

export const useAddress = (address: string) => {
  const addressService = useAddressService()

  const addressData: Ref<AddressRecord | null> = ref(null)
  const pastData: Ref<PastData | null> = ref(null)
  const presentData: Ref<PresentData | null> = ref(null)

  onMounted(async () => {
    const data = await addressService.getAddressJSONandParse(address)
    addressData.value = data
    pastData.value = data.pastData
    presentData.value = data.presentData
  })

  return { addressData, pastData, presentData }
}

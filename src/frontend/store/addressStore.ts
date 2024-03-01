import { defineStore } from 'pinia'
import { PastData } from '../../common/apiSchema/past'
import { AddressRecord } from '../../common/apiSchema/addressRecord'
import { PresentData } from '../../common/apiSchema/present'

export const useAddressStore = defineStore('address', () => {
  const addressService = useAddressService()
  const addressData: Ref<AddressRecord | null> = ref(null)
  const pastData: Ref<PastData | null> = ref(null)
  const presentData: Ref<PresentData | null> = ref(null)

  const fetchAddressData = async (address: string) => {
    const data = await addressService.getAddressJSONandParse(address)
    addressData.value = data
    pastData.value = data.pastData
    presentData.value = data.presentData
  }

  const resetAddressData = () => {
    addressData.value = null
    pastData.value = null
    presentData.value = null
  }

  return {
    addressData,
    pastData,
    presentData,
    fetchAddressData,
    resetAddressData,
  }
})

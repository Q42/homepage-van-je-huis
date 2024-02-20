<template>
  <!-- <UISearchBlock /> -->

  <UIImageList v-if="images" :images="images" />
</template>

<script setup lang="ts">
defineI18nRoute({
  paths: {
    nl: '/',
  },
})

const addressService = useAddressService()

const addressData: any = ref(null) //TODO: fix typing

const images = computed(() => {
  if (!addressData.value) {
    return null
  }

  return addressService.getImagesViewModel(addressData.value.presentData.slider)
})

onMounted(async () => {
  const data = await addressService.getAddressJSONandParse(
    '5a58dacbfbb0dbf25da0a2041a8ae6f4',
  )
  addressData.value = data
})
</script>

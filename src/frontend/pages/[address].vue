<template>
  <div>
    <SharedSidePanel label="Hello World" icon-type="stories" />
    <UIImageList v-if="images" :images="images" />
  </div>
</template>

<script setup lang="ts">
defineI18nRoute({
  paths: {
    nl: '/[address]',
  },
})

const { params } = useRoute()

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
    params.address as string,
  )
  addressData.value = data
})
</script>

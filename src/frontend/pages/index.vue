<template>
  <!-- <UISearchBlock /> -->

  <UIImageList v-if="addressData" />
</template>

<script setup lang="ts">
defineI18nRoute({
  paths: {
    nl: '/',
  },
})

const addressData: any = ref(null) //TODO: fix typing

onMounted(async () => {
  // console.log('onMounted')
  // // const data = await getAddressJSONandParse('5a58dacbfbb0dbf25da0a2041a8ae6f4')
  // console.log('data', data)
  // addressData.value = data
})
</script>

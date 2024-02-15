<template>
  <div>
    <SharedSidePanel
      :label="$t(getTranslationKey('sidePanel.storiesLabel'))"
      icon-type="stories"
    >
      <div v-if="addressData" class="side-panel-items">
        <SharedStory
          v-for="(story, index) in addressData.pastData.stories"
          :key="index"
          :story="story"
        />
      </div>
    </SharedSidePanel>
    <UIImageList v-if="images" :images="images" />

    <div class="tab-buttons"></div>
  </div>
</template>

<script setup lang="ts">
import { getTranslationKey } from '~/translations'

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

  console.log(addressData.value)
})
</script>

<style lang="less" scoped>
.side-panel-items {
  display: flex;
  flex-direction: column;
  gap: 80px;
}
</style>

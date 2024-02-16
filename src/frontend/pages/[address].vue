<template>
  <div>
    <SharedSidePanel
      :label="
        currentView === 'past'
          ? $t(getTranslationKey('sidePanel.storiesLabel'))
          : 'nog maken'
      "
      icon-type="stories"
    >
      <div
        v-if="addressData && currentView === 'past'"
        class="side-panel-items"
      >
        <SharedStory
          v-for="(story, index) in addressData.pastData.stories"
          :key="index"
          :story="story"
        />
      </div>
    </SharedSidePanel>
    <UIImageList v-if="images" :images="images" />
    <!-- TODO: accessibility -->
    <div class="tab-buttons">
      <SharedButton
        :label="$t(getTranslationKey('addressPage.pastLabel'))"
        @click="() => (currentView = 'past')"
      />
      <SharedButton
        :label="$t(getTranslationKey('addressPage.presentLabel'))"
        @click="() => (currentView = 'present')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PastData } from '../../common/apiSchema/past'
import { AddressRecord } from '../../common/apiSchema/addressRecord'

import { PresentData } from '../../common/apiSchema/present'
import { getTranslationKey } from '@/translations'

defineI18nRoute({
  paths: {
    nl: '/[address]',
  },
})

const { params } = useRoute()

const addressService = useAddressService()

const addressData: Ref<AddressRecord | null> = ref(null)
const currentView: Ref<'present' | 'past'> = ref('past')
const pastData: Ref<PastData | null> = ref(null)
const presentData: Ref<PresentData | null> = ref(null)

const images = computed(() => {
  if (!addressData.value) {
    return null
  }

  const getImages = () => {
    if (!pastData.value || !presentData.value) {
      throw new Error('Past or present data is missing')
    }
    if (currentView.value === 'past') {
      return pastData.value.timeline
    } else {
      return presentData.value.slider
    }
  }

  return addressService.getImagesViewModel(getImages())
})

onMounted(async () => {
  const data = await addressService.getAddressJSONandParse(
    params.address as string,
  )
  addressData.value = data
  pastData.value = data.pastData
  presentData.value = data.presentData
})
</script>

<style lang="less" scoped>
.side-panel-items {
  display: flex;
  flex-direction: column;
  gap: 80px;
}

.tab-buttons {
  display: flex;
  gap: 1.125rem;
  width: fit-content;
  z-index: 1;
  position: fixed;
  bottom: 20px;
  margin-left: 50%;
  transform: translatex(-50%);
}
</style>

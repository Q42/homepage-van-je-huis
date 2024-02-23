<template>
  <div>
    <SharedSidePanel
      :label="
        currentView === 'past'
          ? $t(getTranslationKey('sidePanel.storiesLabel'))
          : $t(getTranslationKey('sidePanel.calendarLabel'))
      "
      :icon-type="currentView === 'past' ? 'stories' : 'calendar'"
    >
      <div v-if="pastData && currentView === 'past'" class="side-panel-items">
        <SharedStory
          v-for="(story, index) in pastData.stories"
          :key="index"
          :story="story"
        />
      </div>
      <div
        v-if="presentData && currentView === 'present'"
        class="side-panel-items side-panel-items--calendar"
      >
        <SharedCalendarItem
          v-for="(calenderItem, index) in presentData.agenda"
          :key="index"
          :calendar-item="calenderItem"
        />
      </div>
    </SharedSidePanel>
    <UIListView :entries="entries" />
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
    <SharedSlider />
  </div>
</template>

<script setup lang="ts">
import { getTranslationKey } from '@/translations'

defineI18nRoute({
  paths: {
    nl: '/[address]',
  },
})

const { params } = useRoute()

const { pastData, presentData } = useAddress(params.address as string)
const currentView: Ref<'present' | 'past'> = ref('past')

const entries = computed(() => {
  return currentView.value === 'past'
    ? pastData.value?.timeline
    : presentData.value?.slider
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

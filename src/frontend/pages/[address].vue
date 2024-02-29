<template>
  <div>
    <SharedSidePanel
      :label="
        pastOrPresent === 'past'
          ? $t(getTranslationKey('sidePanel.storiesLabel'))
          : $t(getTranslationKey('sidePanel.calendarLabel'))
      "
      :icon-type="pastOrPresent === 'past' ? 'stories' : 'calendar'"
    >
      <div v-if="pastData && pastOrPresent === 'past'" class="side-panel-items">
        <SharedStory
          v-for="(story, index) in pastData.stories"
          :key="index"
          :story="story"
        />
      </div>
      <div
        v-if="presentData && pastOrPresent === 'present'"
        class="side-panel-items side-panel-items--calendar"
      >
        <SharedCalendarItem
          v-for="(calenderItem, index) in presentData.agenda"
          :key="index"
          :calendar-item="calenderItem"
        />
      </div>
    </SharedSidePanel>
    <UIListView
      v-if="currentView === 'list'"
      :set-view="setView"
      :entries="entries"
    />
    <UIAnimatedView
      v-if="currentView === 'animated'"
      :set-view="setView"
      :entries="entries"
    />
    <!-- TODO: accessibility -->
    <div v-if="currentView === 'animated'" class="tab-buttons">
      <SharedButton
        :label="$t(getTranslationKey('addressPage.pastLabel'))"
        @click="() => (pastOrPresent = 'past')"
      />
      <SharedButton
        :label="$t(getTranslationKey('addressPage.presentLabel'))"
        @click="() => (pastOrPresent = 'present')"
      />
    </div>
    <SharedSlider
      v-if="currentDataSet && entries"
      :range-max="currentDataSet.rangeEnd"
      :range-min="currentDataSet.rangeStart"
      :positions="getEntryPositions(entries)"
      :is-distance-view="pastOrPresent === 'present'"
    />
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getTranslationKey } from '@/translations'
import { useAddressStore } from '@/store/addressStore'

gsap.registerPlugin(ScrollTrigger)

defineI18nRoute({
  paths: {
    nl: '/[address]',
  },
})

const { params } = useRoute()

const { pastData, presentData } = useAddressStore(params.address as string)
const pastOrPresent: Ref<'present' | 'past'> = ref('past')
const currentView: Ref<'animated' | 'list'> = ref('animated')

const setView = () => {
  ScrollTrigger.killAll()
  currentView.value = currentView.value === 'animated' ? 'list' : 'animated'
}

const entries = computed(() => {
  return pastOrPresent.value === 'past'
    ? pastData.value?.timeline
    : presentData.value?.slider.filter((entry) => {
        return entryIsAggregate(entry) || entry.image
      })
})

const currentDataSet = computed(() => {
  return pastOrPresent.value === 'past' ? pastData.value : presentData.value
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

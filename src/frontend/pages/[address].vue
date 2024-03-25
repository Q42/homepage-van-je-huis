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
      <div
        v-if="store.pastData && pastOrPresent === 'past'"
        class="side-panel-items"
      >
        <SharedStory
          v-for="(story, index) in store.pastData.stories"
          :key="index"
          :story="story"
        />
      </div>
      <div
        v-if="store.presentData && pastOrPresent === 'present'"
        class="side-panel-items side-panel-items--calendar"
      >
        <SharedCalendarItem
          v-for="(calenderItem, index) in store.presentData.agenda"
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
    <div v-if="currentView === 'animated' || isOnTablet" class="tab-buttons">
      <SharedButton
        v-if="pastHasData"
        :active="pastOrPresent === 'past'"
        :label="$t(getTranslationKey('addressPage.pastLabel'))"
        @click="() => setDataSet('past')"
      />
      <SharedButton
        v-if="presentHasData"
        :active="pastOrPresent === 'present'"
        :label="$t(getTranslationKey('addressPage.presentLabel'))"
        @click="() => setDataSet('present')"
      />
    </div>
    <SharedSlider
      v-if="currentDataSet && entries"
      :range-max="
        pastOrPresent === 'past'
          ? currentDataSet.rangeEnd
          : getRangeEnd(entries)
      "
      :range-min="
        pastOrPresent === 'past'
          ? currentDataSet.rangeStart
          : getRangeStart(entries)
      "
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
import { Entries } from '@/models/Entries'

const innerWidth = useScreenWidth()
const isOnTablet = computed(() => isTablet(innerWidth.value))

gsap.registerPlugin(ScrollTrigger)

defineI18nRoute({
  paths: {
    nl: '/[address]',
  },
})

const { params, query } = useRoute()

const pastHasData = computed(() => store.pastData?.timeline.length)
const presentHasData = computed(() =>
  store.presentData?.slider.some((entry) => entry.image),
)

const getViewFromQuery = () => {
  if (query.view === 'past' || query.view === 'present') {
    if (!pastHasData.value) {
      return 'present'
    } else if (!presentHasData.value) {
      return 'past'
    } else {
      return query.view
    }
  } else {
    return pastHasData.value ? 'past' : 'present'
  }
}

const getCurrentModeFromQuery = () => {
  if (isOnTablet.value) {
    return 'list'
  } else if (query.mode === 'animated' || query.mode === 'list') {
    return query.mode
  } else {
    return 'animated'
  }
}

const store = useAddressStore()
const pastOrPresent: Ref<'present' | 'past'> = ref('past')
const currentView: Ref<'animated' | 'list'> = ref(getCurrentModeFromQuery())
const router = useRouter()

const setView = async (elementId: string) => {
  ScrollTrigger.killAll()
  currentView.value = currentView.value === 'animated' ? 'list' : 'animated'
  router.push({ query: { view: pastOrPresent.value, mode: currentView.value } })
  await nextTick()
  window.scrollTo({
    top: document.getElementById(elementId)?.offsetTop,
    behavior: 'smooth',
  })
}

onMounted(async () => {
  if (!store.pastData || !store.presentData) {
    await store.fetchAddressData(params.address as string)
    pastOrPresent.value = getViewFromQuery()
  }
})

const setDataSet = (value: 'past' | 'present') => {
  pastOrPresent.value = value
  window.scrollTo({ top: 0, behavior: 'instant' })
  router.push({ query: { view: value } })
}

// TODO: this is a temporary solution because we remove the
// entries with no images from the feed. So delete this
// if we have a solution for that.
const getRangeStart = (entries: Entries) => {
  return entries![0].position
}
const getRangeEnd = (entries: Entries) => {
  return entries![entries!.length - 1].position
}

const entries = computed(() => {
  return pastOrPresent.value === 'past'
    ? store.pastData?.timeline
    : store.presentData?.slider.filter((entry) => {
        return entryIsAggregate(entry) || entry.image
      }) // TODO: this filters out all entries without images. Remove if we have a solution for that.
})

const currentDataSet = computed(() => {
  return pastOrPresent.value === 'past' ? store.pastData : store.presentData
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
  transform: translatex(calc(50vw - 50% - 1.125rem));
}
</style>

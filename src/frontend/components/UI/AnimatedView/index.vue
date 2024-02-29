<template>
  <div v-if="entries" class="animated-view">
    <SharedTypography class="header" variant="h1">
      {{ slugToAddress(route?.params?.address as string) }}
    </SharedTypography>
    <div
      v-for="(entry, index) in entries"
      :key="index"
      :style="getStartPosition()"
      class="entry-wrapper item"
    >
      <div class="card-wrapper">
        <SharedAggregateCard
          v-if="entryIsAggregate(entry)"
          :type="entry.type as AggregateType"
          :count="(entry as DistanceViewAggregateEntry).data.count"
        />
      </div>
      <SharedImage
        v-if="!entryIsAggregate(entry) && (entry as EntryWithImage).image"
        :image="(entry as EntryWithImage).image!"
      />
      <div class="entry-info">
        <SharedTypography variant="body" :compact="true"
          >{{ entry.title }}
          <SharedLink
            v-if="(entry as EntryWithImage).visitUrl"
            :href="(entry as EntryWithImage).visitUrl!"
            :label="$t(getTranslationKey('images.externalLink'))"
          />
        </SharedTypography>
      </div>
    </div>
    <div
      v-for="(entry, index) in entries"
      :id="getId(entry)"
      :key="index"
      class="trigger-item"
      aria-hidden="true"
    ></div>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  DistanceViewEntry,
  DistanceViewAggregateEntry,
} from '../../../../common/apiSchema/present'
import { TimelineEntry } from '../../../../common/apiSchema/past'
import { getTranslationKey } from '@/translations'
import { Entries } from '@/models/Entries'

gsap.registerPlugin(ScrollTrigger)

type EntryWithImage = DistanceViewEntry | TimelineEntry
type AggregateType =
  | 'aggregate_trees'
  | 'aggregate_tree_species'
  | 'aggregate_bees'

export interface AnimatedViewProps {
  entries: Entries
}

const props = defineProps<AnimatedViewProps>()

const route = useRoute()

const loading = ref(true)

let lastId: number | null = null

const getId = (
  entry: TimelineEntry | DistanceViewAggregateEntry | DistanceViewEntry,
) => {
  if (entry.position === lastId) {
    return undefined
  } else {
    lastId = entry.position
    return lastId.toString()
  }
}

const entryIsAggregate = (
  entry: DistanceViewEntry | DistanceViewAggregateEntry | TimelineEntry,
) => {
  return (
    entry.type === 'aggregate_trees' ||
    entry.type === 'aggregate_tree_species' ||
    entry.type === 'aggregate_bees'
  )
}
let index = 0

const getStartPosition = () => {
  const startPositions = [
    'transform: translate(-100%, ' + Math.floor(Math.random() * 100) + 'vh)', // Willekeurig links
    'transform: translate(' +
      Math.floor(Math.random() * 100) +
      'px, calc(-100% - 3px))', // Willekeurig boven
    'transform: translate(100vw, ' + Math.floor(Math.random() * 100) + 'vh)', // Willekeurig rechts
    'transform: translate(' + Math.floor(Math.random() * 100) + 'px, 100vh)', // Willekeurig onder
  ]

  const returnValue = startPositions[index]

  index = index === 3 ? 0 : index + 1
  return returnValue
}

const setAnimation = () => {
  ScrollTrigger.killAll()

  loading.value = true

  setTimeout(() => {
    const scrollTriggers = document.querySelectorAll('.trigger-item')

    document.querySelectorAll('.item').forEach((item, index) => {
      const getStartPos = () => {
        if (index === 0) {
          return 'top'
        }
        if (index > 0) {
          return `-${index < 4 ? index - 1 : 3}${Math.floor(Math.random() * 20) + 50}%`
        }
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollTriggers[index],
          scrub: 1,
          start: `${getStartPos()} top`,
        },
      })

      tl.to(item, {
        x: '25vw',
        y: 'calc(50vh - 200px)',
        transformOrigin: 'center center',
        duration: 2,
      })
        .to(item, { scale: 0.2, duration: 2 }, '-=2')
        .to(item, { opacity: 0, duration: 2 }, '-=1.5')
    })
    loading.value = false
  }, 3000)
}

onMounted(setAnimation)
watch(() => props.entries, setAnimation)
</script>

<style lang="less" scoped>
.animated-view {
  overflow: scroll;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
}
.item {
  position: fixed;
}
.trigger-item {
  width: 300px;
  height: 400px;
  opacity: 0;
}

.header {
  z-index: 1;
  position: fixed;
  text-transform: capitalize;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

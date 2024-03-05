<template>
  <TransitionFade>
    <div v-if="entries" class="animated-view">
      <SharedTypography class="header" variant="h1">
        {{ slugToAddress(route?.params?.address as string) }}
      </SharedTypography>
      <button
        v-for="(entry, index) in entries"
        :key="index"
        :style="getStartPosition()"
        class="entry-wrapper item"
        @click="() => setView(elementIds[index])"
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
          class="image"
          :image="(entry as EntryWithImage).image!"
        />
        <div class="entry-info">
          <SharedTypography variant="body" :compact="true"
            >{{ entry.title }}
          </SharedTypography>
        </div>
      </button>
      <div
        v-for="(_, index) in entries"
        :id="elementIds[index]"
        :key="index"
        class="trigger-item"
        aria-hidden="true"
      >
        {{ elementIds[index] }}
      </div>
    </div>
  </TransitionFade>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DistanceViewAggregateEntry } from '../../../../common/apiSchema/present'
import { Entries, AggregateType, EntryWithImage } from '@/models/Entries'
import { generateIds } from '@/utils/entries'

export interface AnimatedViewProps {
  entries: Entries
  setView: (id: string) => void
}

const props = defineProps<AnimatedViewProps>()

const route = useRoute()
const elementIds = computed(() => generateIds(props.entries))
const loading = ref(true)

let index = 0

const getPosition = (index: number) => {
  // the order of the positions is the order in which the items will be entering the screen
  const positions = ['left', 'top', 'right', 'bottom'] as const
  const positionIndex = index % 4
  return positions[positionIndex] as (typeof positions)[number]
}

const getStartPosition = () => {
  const startPositions = {
    left:
      'transform: translate(-100%, ' + Math.floor(Math.random() * 100) + 'vh)',
    right:
      'transform: translate(100vw, ' + Math.floor(Math.random() * 100) + 'vh)',
    top:
      'transform: translate(' +
      Math.floor(Math.random() * 100) +
      'px, calc(-100% - 3px))',
    bottom:
      'transform: translate(' + Math.floor(Math.random() * 100) + 'px, 100vh)',
  }

  const returnValue = startPositions[getPosition(index)]

  index = index === 3 ? 0 : index + 1
  return returnValue
}

const setAnimation = async () => {
  ScrollTrigger.killAll()

  loading.value = true

  // wait for the next tick to ensure the DOM is updated
  await nextTick()

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

    const offset = 300

    const getYOffset = () => {
      const position = getPosition(index)
      if (position === 'top') {
        return offset
      } else if (position === 'bottom') {
        return -offset
      } else {
        return 0
      }
    }

    const getXOffset = () => {
      const position = getPosition(index)
      if (position === 'left') {
        return offset
      } else if (position === 'right') {
        return -offset
      } else {
        return 0
      }
    }

    tl.to(item, {
      top: `calc(50vh - ${getYOffset()}px)`,
      left: `calc(50vw - ${getXOffset()}px)`,
      x: '-50%',
      y: '-50%',
      duration: 2,
    })
      .to(item, { scale: 0.2, duration: 2 }, '-=2')
      .to(item, { opacity: 0, duration: 2 }, '-=1.5')
  })
  loading.value = false
}

onMounted(() => {
  setAnimation()
  // TODO: fix resizing
})
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

// TODO: check this with design
.image {
  height: 700px;
  width: 1000px;
}

.entry-wrapper {
  all: unset;
  cursor: pointer;
}

.entry-wrapper:hover {
  .entry-info {
    opacity: 1;
  }
}

.entry-info {
  transition: 0.2s;
  opacity: 0;
}

.item {
  position: fixed;
}
.trigger-item {
  width: 300px;
  height: 400px;
  pointer-events: none;
  // opacity: 0;
  font-size: bigger;
  font-weight: bolder;
  display: flex;
  justify-content: center;
  opacity: 0;

  // opacity: 0.3; // TODO: remove
  // background: lightblue; // TODO: remove
  // border-top: black 1px solid; // TODO: remove
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

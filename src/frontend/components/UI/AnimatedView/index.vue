<template>
  <TransitionFade>
    <div v-if="entries" class="animated-view">
      <SharedTypography class="header" variant="h1">
        {{ addressInfo }}
      </SharedTypography>
      <button
        v-for="(entry, index) in entries"
        :key="index"
        :style="getStartPosition(entryIsAggregate(entry))"
        class="entry-wrapper item"
        @click="() => setView(elementIds[index])"
      >
        <div class="card-wrapper">
          <SharedAggregateCard
            v-if="entryIsAggregate(entry)"
            :type="entry.type as AggregateType"
            class="aggregate-card"
            :count="(entry as DistanceViewAggregateEntry).data.count"
          />
        </div>
        <SharedImage
          v-if="!entryIsAggregate(entry) && (entry as EntryWithImage).image"
          class="image"
          :image="(entry as EntryWithImage).image!"
        />
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
import { useAddressStore } from '~/store/addressStore'

export interface AnimatedViewProps {
  entries: Entries
  setView: (id: string) => void
}

const props = defineProps<AnimatedViewProps>()

const addresStore = useAddressStore()
const elementIds = computed(() => generateIds(props.entries))
const loading = ref(true)

let index = 0

const addressInfo = computed(() => {
  const address = addresStore.addressData?.address
  return address ? address.streetName + ' ' + address.houseNumber : ''
})

const getPosition = (index: number) => {
  // the order of the positions is the order in which the items will be entering the screen
  const positions = ['left', 'top', 'right', 'bottom'] as const
  const positionIndex = index % 4
  return positions[positionIndex] as (typeof positions)[number]
}

const getStartPosition = (isAggregateCard: boolean) => {
  const percentage = isAggregateCard ? 150 : 100
  const right = isAggregateCard ? 'calc(100vw + 50%)' : '100vw'
  const top = isAggregateCard ? 'calc(100vh + 50%)' : '100vh'
  const startPositions = {
    left: `transform: translate(-${percentage}%, ${Math.floor(Math.random() * 100)}vh)`,
    right: `transform: translate(${right}, ${Math.floor(Math.random() * 100)}vh)`,
    top: `transform: translate(${Math.floor(Math.random() * 100)}px, calc(-${percentage}% - 3px))`,
    bottom: `transform: translate(${Math.floor(Math.random() * 100)}px, ${top})`,
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

    const offset = isTablet(window.innerWidth) ? 50 : 200

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
      .to(item, { opacity: 0, duration: 2 }, '-=1')
  })
  loading.value = false
}

onMounted(() => {
  setAnimation()

  setTimeout(() => {
    window.scrollTo({ top: 150, behavior: 'smooth' })
  }, 1000)

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

.aggregate-card {
  transform: scale3d(2, 2, 1);
}

.image {
  height: calc(700px * 0.75);
  width: calc(1000px * 0.75);
  transition: transform 0.2s ease;

  @media @mq-from-tablet {
    height: 700px;
    width: 1000px;
  }

  &:hover {
    transform: scale(1.1);
  }
}

.entry-wrapper {
  all: unset;
  cursor: pointer;
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

  // opacity: 0.3; // debug value
  // background: lightblue; // debug value
  // border-top: black 1px solid; // debug value
}

.header {
  z-index: 1;
  position: fixed;
  text-transform: capitalize;
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>

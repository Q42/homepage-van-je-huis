<template>
  <TransitionFade>
    <div
      v-if="entries"
      :id="referenceIds.animatedViewBox"
      class="animated-view"
    >
      <SharedTypography class="header" variant="h1">
        {{ addressInfo }}
      </SharedTypography>
      <button
        v-for="(entry, index) in entries"
        :id="getAnimatedElementId(index)"
        :key="index"
        :style="`transform: ${getTransformFrom(index)}; opacity: ${animationIsSetting ? 0 : 1}; transition: ${animationIsSetting ? 'none' : 'opacity 1s'}`"
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
      </button>
      <div
        :style="`height: ${calculateScrollBoxHeight(entries.length + 1)}`"
        class="scroll-triggers"
      >
        <div
          v-for="(_, index) in entries"
          :id="elementIds[index]"
          :key="index"
          :style="`transform: ${getScrollTriggerTransform(index)}`"
          class="trigger-item"
          aria-hidden="true"
        >
          {{ elementIds[index] }}
        </div>
      </div>
    </div>
  </TransitionFade>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import debounce from 'lodash.debounce'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DistanceViewAggregateEntry } from '../../../../common/apiSchema/present'
import {
  getTransformFrom,
  getTransformTo,
  getAnimatedElementId,
  AGGREGATE_CARD_SCALE,
  SCROLL_TRIGGER_CONTAINER_HEIGHT,
  getScrollTriggerTransform,
  calculateScrollBoxHeight,
} from './animation-service'
import { Entries, AggregateType, EntryWithImage } from '@/models/Entries'
import { generateIds } from '@/utils/entries'
import { useAddressStore } from '@/store/addressStore'
import { referenceIds } from '@/config/referenceIds'
import { config } from '@/config/config'

export interface AnimatedViewProps {
  entries: Entries
  setView: (id: string) => void
}

const props = defineProps<AnimatedViewProps>()

const addressStore = useAddressStore()
const elementIds = computed(() => generateIds(props.entries))
const scrollTriggerHeight = SCROLL_TRIGGER_CONTAINER_HEIGHT + 'px'

const animationIsSetting = ref(false)

const addressInfo = computed(() => {
  const address = addressStore.addressData?.address
  return address ? address.streetName + ' ' + address.houseNumber : ''
})

const setAnimation = async () => {
  animationIsSetting.value = true
  ScrollTrigger.killAll()

  // to avoid flickering we need to wait till all elements are rendered
  // TODO: make this event based?
  await sleep(config.animationDelay)

  const scrollTriggers = document.querySelectorAll('.trigger-item')

  const items = gsap.utils.toArray('.item')

  items.forEach((item, index) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollTriggers[index],
        scrub: 1,
        start: `top top`,
      },
    })

    tl.fromTo(
      item as HTMLElement,
      {
        transform: `${getTransformFrom(index)}`,
      },
      {
        transform: `${getTransformTo(index)}`,
        duration: 3,
      },
    )
      .to(
        item as HTMLElement,
        {
          transform: `${getTransformTo(index)} scale3d(0.4, 0.4, 1)`,
          duration: 3,
        },
        '-=3',
      )
      .to(
        item as HTMLElement,
        {
          opacity: 0,
          transition: 'none',
          duration: 1,
        },
        '-=1',
      )
  })

  animationIsSetting.value = false
}

const onResize = debounce(async () => {
  // await nextTick()
  // setAnimation()
  // TODO: check this with ipad and stuff
}, 30)

onMounted(() => {
  setAnimation()

  window.addEventListener('resize', onResize)
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

.image {
  height: calc(700px * 0.75);
  width: calc(1000px * 0.75);
  transition: transform 0.2s ease;

  @media @mq-from-tablet {
    height: 700px;
    width: 1000px;
  }

  &:hover {
    transform: scale3d(1.1, 1.1, 1);
  }
}

.aggregate-card {
  transform: scale(v-bind(AGGREGATE_CARD_SCALE));
}

.entry-wrapper {
  all: unset;
  cursor: pointer;

  will-change: transform;
  will-change: opacity;
}

.item {
  position: fixed;
}

.scroll-triggers {
  width: fit-content;
  height: fit-content;
}

.trigger-item {
  width: 300px;
  height: v-bind(scrollTriggerHeight);
  pointer-events: none;
  font-size: bigger;
  font-weight: bolder;
  display: flex;
  justify-content: center;
  opacity: 0;

  // opacity: 0.3; // debug value
  // background: lightblue; // debug value
  // border-top: black 3px solid; // debug value
}

.animating {
  opacity: 0;
}

.header {
  z-index: 1;
  position: fixed;
  text-transform: capitalize;
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
}
</style>

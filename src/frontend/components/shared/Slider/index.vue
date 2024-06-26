<template>
  <TransitionFade>
    <div v-if="!loading" :id="referenceIds.slider" class="slider">
      <div :style="currentStyle" class="pointer">
        <div class="pointer-label">
          <SharedTypography variant="body-small" :compact="true">
            {{ currentPosition + (isDistanceView ? 'm' : '') }}
          </SharedTypography>
        </div>
      </div>
    </div>
  </TransitionFade>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { referenceIds } from '@/config/referenceIds'
import { config } from '@/config/config'
gsap.registerPlugin(ScrollTrigger)

export interface SliderProps {
  positions: number[] // the positions correspond with the ids of the entries
  rangeMax: number
  rangeMin: number
  isDistanceView?: boolean
  view: 'animated' | 'list'
}

const props = defineProps<SliderProps>()

const currentPosition = ref(props.rangeMax)
const loading = ref(true)
const percentage = ref(0)

const currentStyle = computed(() => {
  const slider = document.getElementById('slider')
  const sliderHeight = slider ? slider.clientHeight : 0
  const topOffset = (sliderHeight / 100) * percentage.value

  return `transform: translateY(calc(${topOffset}px - 12px)) translateX(-50%)`
})

const innerWidth = useScreenWidth()
const isOnTablet = computed(() => isTablet(innerWidth.value))

const setAnimation = () => {
  if (isOnTablet.value) {
    ScrollTrigger.killAll()
  }
  loading.value = true
  currentPosition.value = props.rangeMax

  setTimeout(async () => {
    props.positions.forEach((position, index) => {
      // In list view and animated view these ids are set on the entries. The ids are the positions of the entries.
      // When they correspond with one of the positions this trigger will be triggered.
      const element = document.getElementById(position.toString())

      if (!element) {
        return
      }

      // This helps to set the positions of the trigger so that the last element also scrolls trough a trigger
      const getTriggerPosition = () => {
        if (index === props.positions.length - 2) {
          const elementAfter = document.getElementById(
            props.positions[index + 1].toString(),
          )
          if (!elementAfter) {
            return '50%'
          }

          return (
            window.innerHeight -
            elementAfter.clientHeight -
            element.clientHeight / 2 +
            'px'
          )
        } else if (index === props.positions.length - 1) {
          return window.innerHeight - element.clientHeight + 10 + 'px'
        } else {
          return element.clientHeight - 10 + 'px'
        }
      }

      ScrollTrigger.create({
        trigger: element,
        start: `top ${getTriggerPosition()}`,
        end: `bottom ${getTriggerPosition()}`,
        onEnter: () => {
          currentPosition.value = position || props.rangeMax
        },
        onLeaveBack: () => {
          currentPosition.value = props.positions[index - 1] || props.rangeMax
        },
      })
    })

    await nextTick()
    loading.value = false
  }, config.animationDelay)
}

const handleScrollHeight = () => {
  const scrollPosition = window.scrollY
  const scrollHeight =
    props.view === 'animated'
      ? document.getElementById(referenceIds.animatedViewBox)?.scrollHeight
      : document.body.scrollHeight

  if (!scrollHeight) {
    console.error('No scroll height found')
    return
  }

  const totalHeight = scrollHeight - window.innerHeight
  percentage.value =
    (scrollPosition / totalHeight) * 100 < 100
      ? (scrollPosition / totalHeight) * 100
      : 100
}

onMounted(() => {
  setAnimation()

  window.addEventListener('scroll', handleScrollHeight)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScrollHeight)
})

watch(() => props.positions, setAnimation)
</script>

<style lang="less" scoped>
.slider {
  position: fixed;
  left: 26px;
  top: 10dvh;
  height: 90dvh;
  border-right: 1px solid @primary-black;
  width: 1px;
}

.pointer {
  position: absolute;
  width: 12px;
  height: 12px;
  background: @primary-black;
  border-radius: 50%;
  transition: transform 0.5s;
  transform: translateX(-50%);
}

.pointer-label {
  overflow: hidden;
  position: absolute;
  color: @primary-black;
  transform: translate(15px, -6px);

  height: 24px;
  display: flex;
  align-items: center;
}
</style>

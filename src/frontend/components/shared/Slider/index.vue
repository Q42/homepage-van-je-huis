<template>
  <TransitionFade>
    <div v-if="!loading" id="slider" class="slider">
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
import debounce from 'lodash.debounce'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getPercentageInRange } from '@/utils/timelineUtils'
gsap.registerPlugin(ScrollTrigger)

export interface SliderProps {
  positions: number[] // the positions correspond with the ids of the entries
  rangeMax: number
  rangeMin: number
  isDistanceView?: boolean
}

const props = defineProps<SliderProps>()

const currentPosition = ref(props.rangeMax)
const loading = ref(true)

const currentStyle = computed(() => {
  const percentage = getPercentageInRange(
    props.rangeMax,
    props.rangeMin,
    currentPosition.value,
  )

  const slider = document.getElementById('slider')
  const sliderheight = slider ? slider.clientHeight : 0
  const topOfset = (sliderheight / 100) * percentage

  return `transform: translateY(calc(${props.isDistanceView ? topOfset : sliderheight - topOfset}px - 12px)) translateX(-50%)`
})

const setAnimation = () => {
  loading.value = true
  currentPosition.value = props.rangeMax

  setTimeout(async () => {
    props.positions.forEach((position, index) => {
      const element = document.getElementById(position.toString())

      if (!element) {
        return
      }

      // This helps to set the positoions of the trigger so that the last element also scrolls trough a trigger
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
  }, 500)
}

// const handleResize = debounce(() => {
//   setAnimation()
//   window.scrollTo(0, 0)
// }, 50)

onMounted(() => {
  setAnimation()
  // window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // window.removeEventListener('resize', handleResize)
})

watch(() => props.positions, setAnimation)
</script>

<style lang="less" scoped>
.slider {
  position: fixed;
  left: 26px;
  top: 10vh;
  height: 90vh;
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

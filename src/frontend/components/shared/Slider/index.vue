<template>
  <TransitionFade>
    <div v-if="!loading" class="slider">
      <div :style="cssProp" class="pointer">
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

const cssProp = computed(() => {
  const percentage = getPercentageInRange(
    props.rangeMax,
    props.rangeMin,
    currentPosition.value,
  )

  return `top: calc(${props.isDistanceView ? percentage : 100 - percentage}% - 12px)`
})

const setAnimation = () => {
  loading.value = true
  currentPosition.value = props.rangeMax

  setTimeout(() => {
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
          currentPosition.value = position
        },
        onLeaveBack: () => {
          currentPosition.value = props.positions[index - 1]
        },
      })
    })
    loading.value = false
  }, 500)
}

const handleResize = () => {
  setAnimation()
  window.scrollTo(0, 0)
}

onMounted(() => {
  setAnimation()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
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
  transition: top 0.5s;
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

<template>
  <div class="slider">
    <div :style="cssProp" class="pointer">
      <div class="pointer-label">
        <SharedTypography variant="body-small" :compact="true">
          {{ currentPosition }}
        </SharedTypography>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getPercentageInRange } from '@/utils/timelineUtils'
gsap.registerPlugin(ScrollTrigger)

const props = defineProps<SliderProps>()

export interface SliderProps {
  positions: number[] // the positions correspond with the ids of the entries
  rangeMax: number
  rangeMin: number
}

const currentPosition = ref(props.rangeMax)

const cssProp = computed(() => {
  const percentage = getPercentageInRange(
    props.rangeMax,
    props.rangeMin,
    currentPosition.value,
  )

  return `top: calc(${100 - percentage}% - 12px)`
})

onMounted(() => {
  // TODO: remove timeout and make this if all images are loaded
  setTimeout(() => {
    props.positions.forEach((position, index) => {
      ScrollTrigger.create({
        trigger: `[id="${position}"]`,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => {
          currentPosition.value = position
        },
        onLeaveBack: () => {
          currentPosition.value = props.positions[index - 1]
        },
      })
    })
  }, 500)
})
</script>

<style lang="less" scoped>
.slider {
  position: fixed;
  left: 30px;
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
  transition: top 0.5s ease-in-out;
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

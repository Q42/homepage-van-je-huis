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

const props = defineProps<SliderProps>()

export interface SliderProps {
  positions: number[] // the positions correspond with the ids of the entries
  rangeMax: number
  rangeMin: number
  isDistanceView?: boolean
}

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

// TODO: implement this
// const areImagesLoaded = () => {
//   const images = document.getElementsByTagName('img')

//   for (let i = 0; i < images.length; i++) {
//     if (!images[i].complete) {
//       return false
//     }
//   }

//   return true
// }

const setAnimation = () => {
  // TODO: make this not timeout but event based
  loading.value = true
  currentPosition.value = props.rangeMax

  setTimeout(() => {
    props.positions.forEach((position, index) => {
      ScrollTrigger.create({
        trigger: `[id="${position}"]`,
        start: 'top 10%',
        end: 'top 10%',
        onEnter: () => {
          currentPosition.value = position
        },
        onLeaveBack: () => {
          currentPosition.value = props.positions[index - 1]
        },
      })
    })
    loading.value = false
  }, 3002)
}

onMounted(setAnimation)
watch(() => props.positions, setAnimation)
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

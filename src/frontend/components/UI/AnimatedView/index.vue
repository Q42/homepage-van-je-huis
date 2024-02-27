<template>
  <div class="animated-view">
    <div
      v-for="item in 25"
      :key="item"
      :style="getStartPosition()"
      class="item"
    >
      {{ item }}
    </div>

    <div
      v-for="item in 25"
      :key="item"
      class="trigger-item"
      aria-hidden="true"
    ></div>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export interface AnimatedViewProps {
  // TODO
}

const props = defineProps<AnimatedViewProps>()

const getStartPosition = () => {
  const startPositions = [
    'transform: translate(-100%, ' + Math.floor(Math.random() * 100) + 'vh)', // Willekeurig links
    'transform: translate(' + Math.floor(Math.random() * 100) + 'px, -100%)', // Willekeurig boven
    'transform: translate(' + Math.floor(Math.random() * 100) + 'px, 100vh)', // Willekeurig onder
    'transform: translate(100vw, ' + Math.floor(Math.random() * 100) + 'vh)', // Willekeurig rechts
  ]

  const randomIndex = Math.floor(Math.random() * startPositions.length)

  return startPositions[randomIndex]
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

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
      x: '100%',
      y: '50%',
      transformOrigin: 'center center',
      duration: 3,
      scale: 0.2,
    }).to(item, { opacity: 0, duration: 2 }, '-=2')
  })
})
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
  width: 500px;
  height: 400px;
  background: darkblue;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: larger;
  font-weight: bold;
}
.trigger-item {
  width: 300px;
  height: 400px;
  opacity: 0;
}
</style>

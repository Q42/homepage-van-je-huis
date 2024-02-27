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
    'transform: translate(-100%, -100%)',
    'transform: translate(100vw, -100%)', // Rechtsboven
    'transform: translate(-100%, 100vh)', // Linksonder
    'transform: translate(100vw, 100vh)', // Rechtsonder
    'transform: translate(0, -100%)', // Bovenkant
    'transform: translate(0, 100vh)', // Onderkant
    'transform: translate(-100%, 0)', // Linkerkant
    'transform: translate(100vw, 0)', // Rechterkant
    'transform: translate(0, -100vh)', // Bovenkant (volledig uit zicht)
    'transform: translate(-100vw, 0)', // Linkerkant (volledig uit zicht)
    'transform: translate(-100%, ' + Math.floor(Math.random() * 100) + 'vh)', // Links met willekeurige verticale positie
    'transform: translate(' + Math.floor(Math.random() * 100) + 'px, -100%)', // Boven met willekeurige horizontale positie
    'transform: translate(' + Math.floor(Math.random() * 100) + 'px, 100vh)', // Onder met willekeurige horizontale positie
    'transform: translate(100vw, ' + Math.floor(Math.random() * 100) + 'vh)', // Rechts met willekeurige verticale positie
  ]

  const randomIndex = Math.floor(Math.random() * startPositions.length)

  return startPositions[randomIndex]
}

const getRandomYPos = () => {
  const randomValue = Math.floor(Math.random() * -100)

  return `transform: translateY(${randomValue}%)`
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

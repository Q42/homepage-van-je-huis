<template>
  <div class="start-animation">
    <SharedImage
      :image="{ url: getRandomImageUrl() }"
      class="animate-item"
    ></SharedImage>
    <SharedImage
      :image="{ url: getRandomImageUrl() }"
      class="animate-item"
    ></SharedImage>
    <SharedImage
      :image="{ url: getRandomImageUrl() }"
      class="animate-item"
    ></SharedImage>
    <SharedImage
      :image="{ url: getRandomImageUrl() }"
      class="animate-item"
    ></SharedImage>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { isMobile } from '@/utils/breakpoints'

const imagesIds = Array.from({ length: 35 }, (_, i) => i + 1)

const getRandomImageUrl = () => {
  if (imagesIds.length === 4) {
    imagesIds.length = 0
    imagesIds.push(...Array.from({ length: 35 }, (_, i) => i + 1))
  }

  const randomIndex = Math.floor(Math.random() * imagesIds.length)
  const pickedItem = imagesIds.splice(randomIndex, 1)[0]

  return `/startanimation/${pickedItem}.jpg`
}

onMounted(() => {
  const items = document.getElementsByClassName('animate-item')
  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth

  setTimeout(() => {
    Array.from(items).forEach((el, index) => {
      const elementWidth = el.clientWidth
      const elementHeight = el.clientHeight

      const fromPositions = [
        { x: -elementWidth, y: -elementHeight }, // top left
        {
          x: windowWidth + elementWidth,
          y: -elementHeight,
        }, // top right
        { x: -elementWidth, y: windowHeight + elementHeight }, // bottom left
        { x: windowWidth + elementWidth, y: windowHeight + elementHeight }, // bottom right
      ]

      const highest = isTablet(windowWidth) ? 160 : 210
      const lowest = highest - 140

      const toPositions = [
        { x: windowWidth * 0.1, y: lowest }, // top left
        { x: windowWidth - elementWidth - windowWidth * 0.1, y: highest }, // top right
        { x: windowWidth * 0.1, y: windowHeight - elementHeight - highest }, // bottom left
        {
          x: windowWidth - elementWidth - windowWidth * 0.1,
          y: windowHeight - elementHeight - lowest,
        }, // bottom right
      ]

      gsap.to(el, {
        x: toPositions[index].x,
        y: toPositions[index].y,
        opacity: 1,
        duration: 2,
      })

      setTimeout(() => {
        gsap.to(el, {
          x: fromPositions[index].x,
          y: fromPositions[index].y,
          opacity: 0,
          duration: 1,
        })
      }, 5000)
    })
  }, 2000)
})

export interface StartAnimationProps {
  // TODO
}

defineProps<StartAnimationProps>()
</script>

<style lang="less" scoped>
.start-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}

.animate-item {
  position: absolute;
  width: 30%;
  min-width: 200px;
  aspect-ratio: 3/2;
  opacity: 0;

  @media @mq-from-desktop-md {
    width: 20%;
  }
}

.animate-item:nth-child(1) {
  transform: translate(-100%, -100%);
}

.animate-item:nth-child(2) {
  transform: translate(calc(100vw + 100%), -100%);
}

.animate-item:nth-child(3) {
  transform: translate(-100%, calc(100vh + 100%));
}

.animate-item:nth-child(4) {
  transform: translate(calc(100vw + 100%), calc(100vh + 100%));
}
</style>

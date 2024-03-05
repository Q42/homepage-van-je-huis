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
    <slot />
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'

const getRandomImageUrl = () => {
  const randomNumber = Math.floor(Math.random() * 35) + 1

  return `/startanimation/${randomNumber}.jpg`
}

onMounted(() => {
  const items = document.getElementsByClassName('animate-item')
  const height = window.innerHeight
  const width = window.innerWidth

  setTimeout(() => {
    Array.from(items).forEach((el, index) => {
      const positions = [
        { x: 100, y: 70 }, // top left
        { x: width - el.clientWidth - 200, y: 100 }, // top right
        { x: 150, y: height - el.clientHeight - 150 }, // bottom left
        { x: width - el.clientWidth - 180, y: height - el.clientHeight - 90 }, // bottom right
      ]

      gsap.to(el, {
        x: positions[index].x,
        y: positions[index].y,
        opacity: 1,
        duration: 1,
      })
    })
  }, 1500)
})

export interface StartAnimationProps {
  // TODO
}

const props = defineProps<StartAnimationProps>()
</script>

<style lang="less" scoped>
.start-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
}

.animate-item {
  position: absolute;
  width: 300px;
  height: 200px;
  opacity: 0;
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

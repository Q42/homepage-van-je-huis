<template>
  <div class="start-animation">
    <div class="item"></div>
    <div class="item"></div>
    <div class="item"></div>
    <div class="item"></div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'

onMounted(() => {
  const items = document.getElementsByClassName('item')
  const height = window.innerHeight
  const width = window.innerWidth

  Array.from(items).forEach((el, index) => {
    const positions = [
      { x: 100, y: 100 }, // top left
      { x: width - el.clientWidth - 100, y: 100 }, // top right
      { x: 100, y: height - el.clientHeight - 100 }, // bottom left
      { x: width - el.clientWidth - 100, y: height - el.clientHeight - 100 }, // bottom right
    ]

    gsap.to(el, {
      x: positions[index].x,
      y: positions[index].y,
      opacity: 1,
      duration: 1,
    })
  })
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
}

.item {
  position: absolute;
  width: 300px;
  height: 200px;
  background-color: salmon;
  opacity: 0;
}

.item:nth-child(1) {
  transform: translate(-100%, -100%);
}

.item:nth-child(2) {
  transform: translate(calc(100vw + 100%), -100%);
}

.item:nth-child(3) {
  transform: translate(-100%, calc(100vh + 100%));
}

.item:nth-child(4) {
  transform: translate(calc(100vw + 80%), calc(100vh + 80%));
}
</style>

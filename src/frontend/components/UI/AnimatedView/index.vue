<template>
  <div class="animated-view">
    <div v-for="item in 25" :key="item" class="item"></div>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export interface AnimatedViewProps {
  // TODO
}

const props = defineProps<AnimatedViewProps>()

const getRandomNumber = () => {
  if (Math.random() < 0.5) {
    return Math.floor(Math.random() * (100 - 50)) + 50 + '%'
  } else {
    return Math.floor(Math.random() * (-100 - -50)) + -50 + '%'
  }
}
onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  document.querySelectorAll('.item').forEach((item) => {
    gsap.fromTo(
      item,
      {
        scrollTrigger: {
          trigger: item,
          scrub: true,
        },
        markers: true,
        toggleActions: 'restart none none none',
        x: getRandomNumber(),
        scale: 3,
        opacity: 1,
      },
      {
        scrollTrigger: {
          trigger: item,
          scrub: true,
        },
        x: '50%',
        opacity: 0,
        scale: 0,
      },
    )
  })
})
</script>

<style lang="less" scoped>
.item {
  width: 400px;
  height: 300px;
  background-color: red;
  margin: 30px;

  :first-child {
    margin-top: 100vh;
  }
}
</style>

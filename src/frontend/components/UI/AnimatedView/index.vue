<template>
  <div class="animated-view">
    <div v-for="item in 10" :key="item" class="item"></div>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export interface AnimatedViewProps {
  // TODO
}

const props = defineProps<AnimatedViewProps>()

onMounted(() => {
  function animateItem(item) {
    gsap.to(item, {
      x: 0,
      y: 0,
      opacity: 1,
    })
  }

  document.querySelectorAll('.item').forEach((item) => {
    gsap.set(item, {
      x: -1000,
      y: -1000,
    })

    // Define ScrollTrigger for each item
    ScrollTrigger.create({
      trigger: item,
      start: 'top center', // Adjust as needed
      end: 'bottom center', // Adjust as needed
      scrub: true,
      onUpdate: (self) => {
        if (self.direction === 1) {
          // Forward scrolling
          animateItem(item)
        } else if (self.direction === -1) {
          // Reverse scrolling
          //   animateItemBack(item)
        }
      },
    })
  })
})
</script>

<style lang="less" scoped>
.item {
  width: 400px;
  height: 300px;
  background-color: red;
  margin: 40px auto;
}
</style>

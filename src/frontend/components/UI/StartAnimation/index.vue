<template>
  <div v-if="randomImages" class="start-animation">
    <SharedImage
      v-for="(image, index) in randomImages"
      :key="index"
      :image="{ url: image }"
      class="animate-item"
    />
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'

const imagesIds = Array.from({ length: 35 }, (_, i) => i + 1)
const between = ref(false)

const getRandomImageUrl = () => {
  if (imagesIds.length === 4) {
    imagesIds.length = 0
    imagesIds.push(...Array.from({ length: 35 }, (_, i) => i + 1))
  }

  const randomIndex = Math.floor(Math.random() * imagesIds.length)
  const pickedItem = imagesIds.splice(randomIndex, 1)[0]

  return `/startanimation/${pickedItem}.jpg`
}

let randomImages: Ref<string[] | null> = ref(null)

const setRandomImages = () => {
  randomImages.value = Array.from({ length: 4 }, () => getRandomImageUrl())
}

const animate = async () => {
  setRandomImages()
  await nextTick()

  const items = document.getElementsByClassName('animate-item')
  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth

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
      gsap
        .to(el, {
          x: fromPositions[index].x,
          y: fromPositions[index].y,
          opacity: 0,
          duration: 1,
        })
        .then(() => {
          randomImages.value = null
        })
    }, 5000)
  })
}

let count = 2
let interval: NodeJS.Timeout | null = null

const startAnimation = () => {
  setTimeout(() => {
    animate()
    interval = setInterval(() => {
      if (count === 5 && interval) {
        clearInterval(interval)
      }
      animate()
      count += 1
    }, 8000)
  }, 1000)
}

onMounted(startAnimation)

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
  min-width: 180px;
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

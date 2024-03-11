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

const getRandomImageUrl = () => {
  if (imagesIds.length === 4) {
    imagesIds.length = 0
    imagesIds.push(...Array.from({ length: 35 }, (_, i) => i + 1))
  }

  const randomIndex = Math.floor(Math.random() * imagesIds.length)
  const pickedItem = imagesIds.splice(randomIndex, 1)[0]

  return `/startanimation/${pickedItem}.jpg`
}

const randomImages: Ref<string[] | null> = ref(null)

const setRandomImages = () => {
  randomImages.value = Array.from({ length: 4 }, () => getRandomImageUrl())
}

const animate = async () => {
  if (count < numberOfRepetitions) {
    setRandomImages()
    await nextTick()
  }
  const items = document.getElementsByClassName('animate-item')
  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth

  Array.from(items).forEach((el, index) => {
    const elementWidth = el.clientWidth
    const elementHeight = el.clientHeight

    const percentageToPx = (percentage: number, axis: 'x' | 'y') => {
      const measurement = axis === 'x' ? elementWidth : elementHeight

      return measurement * (percentage / 100)
    }

    const fromPositions = [
      { x: 0, y: 0 }, // top left
      {
        x: windowWidth - elementWidth,
        y: 0,
      }, // top right
      { x: 0, y: windowHeight - elementHeight }, // bottom left
      { x: windowWidth - elementWidth, y: windowHeight - elementHeight }, // bottom right
    ]

    const highest = isTablet(windowWidth) ? 160 : 210

    const toPositions = [
      { x: percentageToPx(20, 'x'), y: percentageToPx(30, 'y') }, // top left
      {
        x: windowWidth - elementWidth - percentageToPx(20, 'x'),
        y: percentageToPx(10, 'y'),
      }, // top right
      {
        x: percentageToPx(40, 'x'),
        y: windowHeight - elementHeight - percentageToPx(15, 'y'),
      }, // bottom left
      {
        x: windowWidth - elementWidth - percentageToPx(10, 'x'),
        y: windowHeight - elementHeight - percentageToPx(40, 'y'),
      }, // bottom right
    ]
    gsap.to(el, {
      x: toPositions[index].x,
      y: toPositions[index].y,
      opacity: 1,
      duration: 2,
    })

    if (count < numberOfRepetitions) {
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
    }
  })
}

const numberOfRepetitions = 5
let count = 2
let interval: NodeJS.Timeout | null = null

const startAnimation = () => {
  setTimeout(() => {
    animate()
    interval = setInterval(() => {
      if (count === numberOfRepetitions && interval) {
        clearInterval(interval)
      }
      animate()
      count += 1
    }, 8000)
  }, 1000)
}

onMounted(startAnimation)

// TODO: remove. Only to test end positions
// onMounted(setRandomImages)
</script>

<style lang="less" scoped>
.start-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
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
  transform: translate(0, 0);
}

.animate-item:nth-child(2) {
  transform: translate(calc(100vw - 100%), 0);
}

.animate-item:nth-child(3) {
  transform: translate(0, calc(100vh - 100%));
}

.animate-item:nth-child(4) {
  transform: translate(calc(100vw - 100%), calc(100vh - 100%));
}

// TODO: test for to positions

// .animate-item:nth-child(1) {
//   transform: translate(20%, 30%);
// }

// .animate-item:nth-child(2) {
//   transform: translate(calc(100vw - 100% - 40%), 10%);
// }

// .animate-item:nth-child(3) {
//   transform: translate(40%, calc(100vh - 100% - 15%));
// }

// .animate-item:nth-child(4) {
//   transform: translate(calc(100vw - 100% - 10%), calc(100vh - 100% - 40%));
// }
</style>

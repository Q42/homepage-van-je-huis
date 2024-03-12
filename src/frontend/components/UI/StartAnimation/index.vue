<template>
  <div v-if="randomImages" class="start-animation">
    <div
      v-for="(image, index) in randomImages"
      :key="index"
      class="animate-item"
    >
      <SharedImage :image="{ url: image }" />
    </div>
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
  const round = count
  const shouldAnimate = round <= numberOfRepetitions
  count += 1
  if (shouldAnimate) {
    setRandomImages()
    await nextTick()
  }
  const items = document.getElementsByClassName('animate-item')
  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth

  Array.from(items).forEach((el, index) => {
    const elementWidth = el.clientWidth
    const elementHeight = el.clientHeight

    const fromPositions = [
      {
        x: definePositions([0, 0, 0], round),
        y: definePositions([0, 0, 0], round),
      }, // top left
      {
        x: windowWidth - elementWidth - definePositions([0, 0, 0], round),
        y: definePositions([-100, 0, 0], round),
      }, // top right
      {
        x: definePositions([0, 0, 0], round),
        y: windowHeight - elementHeight - definePositions([-100, 0, 0], round),
      }, // bottom left
      {
        x: windowWidth - elementWidth - definePositions([0, 0, 0], round),
        y: windowHeight - elementHeight - definePositions([0, 0, 0], round),
      }, // bottom right
    ]

    const toPositions = [
      {
        x: definePositions([100, 0, 0], round),
        y: definePositions([0, 0, 0], round),
      }, // top left
      {
        x: windowWidth - elementWidth - definePositions([0, 0, 0], round),
        y: definePositions([0, 0, 0], round),
      }, // top right
      {
        x: definePositions([0, 0, 0], round),
        y: windowHeight - elementHeight - definePositions([0, 0, 0], round),
      }, // bottom left
      {
        x: windowWidth - elementWidth - definePositions([100, 0, 0], round),
        y: windowHeight - elementHeight - definePositions([0, 0, 0], round),
      }, // bottom right
    ]
    gsap.to(el, {
      x: toPositions[index].x,
      y: toPositions[index].y,
      opacity: 1,
      duration: 2,
    })

    // This sets the back animation
    const shouldAnimateBack = round < numberOfRepetitions
    if (shouldAnimateBack) {
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

const definePositions = (
  positions: [number, number, number],
  count: number,
) => {
  // if (count > numberOfRepetitions) {
  //   return positions[0]
  // }
  return positions[count - 1]
}

const numberOfRepetitions = 3
let count = 1
let interval: NodeJS.Timeout | null = null

const startAnimation = () => {
  setTimeout(() => {
    animate()
    interval = setInterval(() => {
      if (count === numberOfRepetitions && interval) {
        clearInterval(interval)
      }
      animate()
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
  height: 100dvh;
  z-index: -1;
  overflow: hidden;
}

.animate-item {
  position: absolute;
  width: 30%;
  min-width: 180px;
  aspect-ratio: 3/2;
  overflow: hidden;
  opacity: 0;

  @media @mq-from-desktop-md {
    width: 400px;
  }
}

.animate-item img {
  aspect-ratio: 3/2;
}

.animate-item:nth-child(1) {
  transform: translate(0, 0);
}

.animate-item:nth-child(2) {
  transform: translate(calc(100vw - 100%), -100px);
}

.animate-item:nth-child(3) {
  transform: translate(0, calc(100vh - 100% + 100px));
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

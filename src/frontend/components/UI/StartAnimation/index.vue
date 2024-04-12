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

const imagesIds = Array.from({ length: 23 }, (_, i) => i + 1)

const getRandomImageUrl = () => {
  if (imagesIds.length === 4) {
    imagesIds.length = 0
    imagesIds.push(...Array.from({ length: 23 }, (_, i) => i + 1))
  }

  const randomIndex = Math.floor(Math.random() * imagesIds.length)
  const pickedItem = imagesIds.splice(randomIndex, 1)[0]

  return `/startanimation/${pickedItem}.webp`
}

const randomImages: Ref<string[] | null> = ref(null)

const setRandomImages = () => {
  randomImages.value = Array.from(
    { length: isDesktopMd(window.innerWidth) ? 3 : 3 },
    () => getRandomImageUrl(),
  )
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

    const bottomOffsetPhone = 55

    const fromPositions = [
      {
        // 1
        x: definePositions([400, windowWidth / 2, 0], [0, 0, 0], round),
        y: definePositions(
          [-200, -elementHeight - 200, 0],
          [-100, -100, -100],
          round,
        ),
      },
      {
        // 2
        x: windowWidth - definePositions([0, 0, 0], [-200, -200, -200], round),
        y: definePositions(
          [400, 400, -100],
          [
            windowHeight - elementHeight - bottomOffsetPhone,
            windowHeight - elementHeight - bottomOffsetPhone,
            windowHeight - elementHeight - bottomOffsetPhone,
          ],
          round,
        ),
      },
      {
        // 3
        x: definePositions([0, -100, 550], [-50, -50, -50], round),
        y:
          windowHeight -
          elementHeight -
          definePositions([-100, 0, -100], [-150, -159, -150], round),
      },
    ]

    const toPositions = [
      {
        // 1
        x: definePositions([100, windowWidth / 2, 10], [110, 110, 110], round),
        y: definePositions(
          [50, -(elementHeight / 6), 120],
          [30, 30, 30],
          round,
        ),
      },
      {
        // 2
        x:
          windowWidth -
          elementWidth -
          definePositions([-100, 40, 0], [-30, -30, -30], round),
        y: definePositions(
          [250, windowHeight - elementHeight - 40, 0],
          [
            windowHeight - elementHeight - bottomOffsetPhone,
            windowHeight - elementHeight - bottomOffsetPhone,
            windowHeight - elementHeight - bottomOffsetPhone,
          ],
          round,
        ),
      },
      {
        // 3
        x: definePositions([400, 0, windowWidth / 2], [-20, -20, -20], round),
        y:
          windowHeight -
          elementHeight -
          definePositions([0, 200, 0], [-10, -10, -10], round),
      },
    ]
    gsap.fromTo(
      el,
      {
        x: fromPositions[index].x,
        y: fromPositions[index].y,
        opacity: 0,
      },
      {
        x: toPositions[index].x,
        y: toPositions[index].y,
        opacity: 1,
        duration: 2,
      },
    )

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
  desktopPositions: [number, number, number],
  mobilePositions: [number, number, number],
  count: number,
) => {
  return isDesktopMd(window.innerWidth)
    ? mobilePositions[count - 1]
    : desktopPositions[count - 1]
}

const numberOfRepetitions = isDesktopMd(window.innerWidth) ? 1 : 3
let count = 1
let interval: NodeJS.Timeout | null = null

const startAnimation = () => {
  setTimeout(() => {
    animate()
    if (numberOfRepetitions > 1) {
      interval = setInterval(() => {
        if (count === numberOfRepetitions && interval) {
          clearInterval(interval)
        }
        animate()
      }, 8000)
    }
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
  width: 50%;
  aspect-ratio: 3/2;
  overflow: hidden;
  opacity: 0;

  @media @mq-from-desktop-md {
    width: 28%;
  }
}

.animate-item img {
  aspect-ratio: 3/2;
}

// // left
// .animate-item:nth-child(1) {
//   transform: translate(0, 0);
// }

// // right middle
// .animate-item:nth-child(2) {
//   transform: translate(0, 300px);
// }

// // bottom left
// .animate-item:nth-child(3) {
//   transform: translate(0, 300px);
// }

@media @mq-from-desktop-md {
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
}
</style>

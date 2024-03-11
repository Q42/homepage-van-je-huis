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

onMounted(setRandomImages)
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
  opacity: 1;

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
</style>

import { defineStore } from 'pinia'

export const useMountStore = defineStore('mount-store', () => {
  const animatedViewHasBeenMounted = ref(false)

  return { animatedViewHasBeenMounted }
})

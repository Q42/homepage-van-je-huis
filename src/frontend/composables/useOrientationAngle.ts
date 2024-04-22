export const useOrientationAngle = () => {
  const orientation = ref(window.screen.orientation.angle)

  const handleOrientationChange = () => {
    orientation.value = window.screen.orientation.angle
  }

  onMounted(() => {
    screen.orientation.addEventListener('change', handleOrientationChange)
  })

  onUnmounted(() => {
    screen.orientation.removeEventListener('change', handleOrientationChange)
  })

  return orientation
}

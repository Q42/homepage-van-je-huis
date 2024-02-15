<template>
  <div
    class="side-panel"
    :class="{
      'side-panel--hover': toggleIsHovered,
      'side-panel--open': panelIsOpen,
    }"
  >
    <!-- TODO: add aria label -->
    <button
      v-if="!panelIsOpen"
      class="side-panel__label"
      @mouseenter="handleMousEnter"
      @mouseleave="handleMouseLeave"
      @click="openPanel"
    >
      <SharedIcon type="stories" :height="24" :width="24" />
      <SharedTypography
        classes="side-panel__label__text"
        variant="body"
        :compact="true"
        >verhalen</SharedTypography
      >
    </button>
    <!-- TODO: add aria label -->
    <button class="close-btn" @click="closePanel">X</button>
  </div>
</template>

<script setup lang="ts">
export interface SidePanelProps {
  // TODO
}
const toggleIsHovered = ref(false)
const panelIsOpen = ref(false)

let timeout: NodeJS.Timeout | null = null

const props = defineProps<SidePanelProps>()

const openPanel = () => {
  panelIsOpen.value = true
}

const closePanel = () => {
  panelIsOpen.value = false
}

const handleMousEnter = () => {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  toggleIsHovered.value = true
}

const handleMouseLeave = () => {
  timeout = setTimeout(() => {
    toggleIsHovered.value = false
  }, 700)
}
</script>

<style lang="less" scoped>
.side-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 500px;
  z-index: 1;
  background: @primary-black;
  transform: translateX(90%);
  transition: transform 0.3s;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 40px;
  width: 48px;
  background: @primary-black;
  color: @primary-white;
  border: none;
  cursor: pointer;
}

.side-panel--hover {
  transform: translateX(80%);
}

.side-panel--open {
  transform: translateX(0%);
}

.side-panel__label {
  all: unset;
  outline: none;
  height: 48px;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  color: @primary-white;
  padding-left: 20px;
  padding-right: 100vw;
  background: @primary-black;
  transform: translate(calc(-100% + 100vw - 20px), 12px);
  gap: 1rem;
  cursor: pointer;
}

.side-panel__label__text {
  color: @primary-white;
}
</style>

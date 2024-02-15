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
      <SharedIcon :type="iconType" :height="24" :width="24" />
      <SharedTypography
        classes="side-panel__label__text"
        variant="body"
        :compact="true"
      >
        {{ label }}
      </SharedTypography>
    </button>
    <div class="header">
      <SharedTypography variant="h3">{{ label }}</SharedTypography>
      <!-- TODO: add aria label -->
      <button class="close-btn" @click="closePanel">
        <SharedIcon :width="24" :height="24" type="close" />
      </button>
    </div>
    <div
      class="content-wrapper"
      :class="{
        'content-wrapper--open': panelIsOpen,
      }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconType } from '@/models/Icon'

export interface SidePanelProps {
  label: string
  iconType: IconType
}
const toggleIsHovered = ref(false)
const panelIsOpen = ref(false)

let timeout: NodeJS.Timeout | null = null

const props = defineProps<SidePanelProps>()

const openPanel = () => {
  toggleIsHovered.value = false
  panelIsOpen.value = true
}

const closePanel = () => {
  toggleIsHovered.value = false
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
  color: @primary-white;
}

.close-btn {
  all: unset;
  background: @primary-black;
  color: @primary-white;
  border: none;
  cursor: pointer;
}

.header {
  height: @header-height;
  position: fixed;
  padding: 40px;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  z-index: 1;
  background: @primary-black;
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
  padding-inline: 20px;
  background: @primary-black;
  transform: translate(calc(-100% + 1px), 12px);
  gap: 1rem;
  cursor: pointer;
}

.side-panel__label__text {
  color: @primary-white;
}

.content-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  padding-inline: 40px;
  margin-top: @header-height;
  overflow: auto;
}

.content-wrapper--open {
  overflow: auto;
}
</style>

<template>
  <div class="side-panel" :class="{ 'side-panel--hover': isHovering }">
    <button
      @mouseenter="handleMousEnter"
      @mouseleave="handleMouseLeave"
      class="side-panel__label"
    >
      <SharedIcon type="stories" :height="24" :width="24" />
      <SharedTypography
        classes="side-panel__label__text"
        variant="body"
        :compact="true"
        >verhalen</SharedTypography
      >
    </button>
  </div>
</template>

<script setup lang="ts">
export interface SidePanelProps {
  // TODO
}

const isHovering = ref(false)
let timeout: NodeJS.Timeout | null = null

const props = defineProps<SidePanelProps>()

const handleMousEnter = () => {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  isHovering.value = true
}

const handleMouseLeave = () => {
  timeout = setTimeout(() => {
    isHovering.value = false
  }, 700)
}
</script>

<style lang="less" scoped>
.side-panel {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 1;
  background: @primary-black;
  transform: translateX(90%);
  transition: transform 0.3s;
}

.side-panel--hover {
  transform: translateX(80%);
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

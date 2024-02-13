<template>
  <div class="side-panel">
    <div class="side-panel__label">
      <SharedIcon type="stories" :height="24" :width="24" />
      <SharedTypography
        classes="side-panel__label__text"
        variant="body"
        :compact="true"
        >verhalen</SharedTypography
      >
    </div>
  </div>
</template>

<script setup lang="ts">
export interface SidePanelProps {
  // TODO
}

const props = defineProps<SidePanelProps>()
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
}

.side-panel__label {
  height: 48px;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  color: @primary-white;
  padding: 20px;
  background: @primary-black;
  transform: translate(calc(-100% + 1px), 12px);
  gap: 1rem;
}
.side-panel__label__text {
  color: @primary-white;
}
</style>

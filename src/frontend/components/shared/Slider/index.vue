<template>
  <div class="slider">
    <div class="pointer">
      <div class="pointer-label">
        <SharedTypography variant="body-small" :compact="true">
          1900
        </SharedTypography>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface SliderProps {
  // TODO
}

const props = defineProps<SliderProps>()
</script>

<style lang="less" scoped>
.slider {
  position: fixed;
  left: 30px;
  top: 10vh;
  height: 90vh;
  border-right: 1px solid @primary-black;
  width: 1px;
}

.pointer {
  position: absolute;
  width: 12px;
  height: 12px;
  background: @primary-black;
  border-radius: 50%;
  transform: translateX(-50%);
}

.pointer-label {
  overflow: hidden;
  position: absolute;
  color: @primary-black;
  transform: translate(15px, -6px);

  height: 24px;
  display: flex;
  align-items: center;
}
</style>

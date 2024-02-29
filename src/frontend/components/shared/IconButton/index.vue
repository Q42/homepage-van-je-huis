<template>
  <button class="button">
    <SharedIcon
      :width="iconHeight ?? 24"
      :height="iconWidth ?? 24"
      :type="icon"
    ></SharedIcon>
  </button>
</template>

<script setup lang="ts">
import { IconType } from '@/models/Icon'

export interface IconButtonProps {
  icon: IconType
  iconHeight?: number
  iconWidth?: number
}

const props = defineProps<IconButtonProps>()
</script>

<style lang="less" scoped>
.button {
  all: unset;
  cursor: pointer;
}
</style>

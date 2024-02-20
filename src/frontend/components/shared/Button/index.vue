<template>
  <button class="button">
    <SharedTypography variant="h6" as="span">{{ label }}</SharedTypography>
  </button>
</template>

<script setup lang="ts">
export interface ButtonProps {
  label: string
}

const props = defineProps<ButtonProps>()
</script>

<style lang="less" scoped>
.button {
  all: unset;
  cursor: pointer;
  border-bottom: 3px solid @primary-black;
  padding-block: 0.25rem;
}
</style>

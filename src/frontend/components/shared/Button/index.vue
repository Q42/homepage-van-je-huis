<template>
  <button class="button" :class="{ 'button--active': active }">
    <SharedTypography variant="h6" as="span">{{ label }}</SharedTypography>
  </button>
</template>

<script setup lang="ts">
export interface ButtonProps {
  label: string
  active?: boolean
}

const props = defineProps<ButtonProps>()
</script>

<style lang="less" scoped>
.button {
  all: unset;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  padding-block: 0.25rem;
  transition: border 0.5s;
}
.button--active {
  border-bottom: 3px solid @primary-black;
}
</style>

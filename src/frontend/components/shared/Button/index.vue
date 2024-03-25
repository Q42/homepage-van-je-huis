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

defineProps<ButtonProps>()
</script>

<style lang="less" scoped>
.button {
  all: unset;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  padding: 0.25rem;
  transition: border 0.5s;

  &:hover {
    border-bottom: 2px solid @primary-black;
  }
}

.button--active {
  border-bottom: 2px solid @primary-black;
  transition: background 0.5s;

  &:hover {
    background: @neutral-grey1;
  }
}
</style>

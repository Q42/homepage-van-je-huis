<template>
  <NuxtLink :to="href" target="_blank" class="link"
    ><SharedTypography variant="body" :compact="true">{{
      label
    }}</SharedTypography>
    <span v-if="!hideIcon"
      ><SharedIcon :height="13" :width="13" type="link" /></span
  ></NuxtLink>
</template>

<script setup lang="ts">
export interface LinkProps {
  href: string
  label: string
  hideIcon?: boolean
}

defineProps<LinkProps>()
</script>

<style lang="less" scoped>
.link {
  width: fit-content;
  position: relative;
  display: inline-flex;
  gap: 5px;
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition: 1s;
  &::after {
    content: '';
    top: 100%;
    height: 1px;
    background-color: currentColor;
    position: absolute;
    display: block;
    width: 100%;
    transition: 0.2s ease;
  }

  &:hover {
    &::after {
      height: 2px;
    }
  }
}
</style>

<template>
  <NuxtLink :to="href" class="link"
    >{{ label }} <span><SharedIcon :height="13" :width="13" type="link" /></span
  ></NuxtLink>
</template>

<script setup lang="ts">
export interface LinkProps {
  href: string
  label: string
}

const props = defineProps<LinkProps>()
</script>

<style lang="less" scoped>
.link {
  display: inline-flex;
  gap: 5px;
  align-items: center;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  border-bottom: 1px solid @primary-black;
  &:hover {
    border-bottom: 2px solid @primary-black;
  }
}
</style>

<template>
  <div class="header">
    <SharedIcon type="logo" class="header__logo" />
  </div>
</template>

<script setup lang="ts">
export interface HeaderProps {
  // TODO
}

const props = defineProps<HeaderProps>()
</script>

<style lang="less" scoped>
.header {
  display: flex;
  height: 80px;
  padding: 20px;
}
</style>

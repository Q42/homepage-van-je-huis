<template>
  <div class="page-wrapper">
    <UIHeader />
    <main>
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
.page-wrapper {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

main {
  height: 100%;
  flex: 1;
}
</style>

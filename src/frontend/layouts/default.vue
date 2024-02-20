<template>
  <div class="page-wrapper">
    <UIHeader />
    <main class="container">
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
.page-wrapper {
  position: relative;
  min-height: 100vh;
}

.container {
  padding: 0 20px;
}
</style>

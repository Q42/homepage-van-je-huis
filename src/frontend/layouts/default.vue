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
  min-height: 100vh;
  padding: 0 20px;
}

main {
  min-height: 100%;
}
</style>

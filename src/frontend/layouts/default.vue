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
.container {
  margin-top: @header-height;
  padding: 0 20px;
}
</style>

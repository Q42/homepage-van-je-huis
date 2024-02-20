<template>
  <Transition name="fade" :duration="300">
    <slot />
  </Transition>
</template>

<script setup lang="ts"></script>

<style lang="less">
.fade {
  &-enter-from,
  &-leave-to {
    opacity: 0;
  }

  &-enter-to,
  &-leave-from {
    opacity: 1;
  }

  &-enter-active,
  &-leave-active {
    transition: opacity 0.3s linear;
  }
}
</style>

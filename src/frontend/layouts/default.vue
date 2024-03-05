<template>
  <div class="page-wrapper">
    <UIHeader :hide-title="path === '/nl'" />
    <main class="container">
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute()

const path = computed(() => route.path)

onMounted(() => {
  console.log('mounted')
})
</script>

<style lang="less" scoped>
.container {
  margin-top: @header-height;
  padding: 0 20px;
}
</style>

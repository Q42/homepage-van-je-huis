<template>
  <div>
    <h1>404 - page not found</h1>
    <button @click="handleClearError">Go home</button>
  </div>
</template>

<script setup lang="ts">
export interface ErrorProps {
  // TODO
}

const props = defineProps<ErrorProps>()

const { locale } = useI18n()

const handleClearError = () => {
  clearError({ redirect: '/' + locale.value })
}
</script>

<style lang="less" scoped></style>

<template>
  <div>
    <UISearchBlock />
  </div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()

onMounted(() => {
  console.log('mounted')
  console.log('env', runtimeConfig.public.environment)
})
defineI18nRoute({
  paths: {
    nl: '/',
  },
})
</script>

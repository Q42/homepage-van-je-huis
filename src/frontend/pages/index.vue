<template>
  <UIStartAnimation>
    <UISearchBlock />
  </UIStartAnimation>
</template>

<script setup lang="ts">
import { useAddressStore } from '@/store/addressStore'

const { resetAddressData } = useAddressStore()

onMounted(resetAddressData)

defineI18nRoute({
  paths: {
    nl: '/',
  },
})
</script>

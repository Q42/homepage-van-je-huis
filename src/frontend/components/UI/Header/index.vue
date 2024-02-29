<template>
  <div class="header">
    <SharedIcon
      :width="isOnMobile ? 12 : 155"
      :height="40"
      :type="IconType"
      class="header__logo"
    />

    <SharedTypography variant="h1" :compact="true" class="header__title">
      {{ $t(getTranslationKey('home.title')) }}
    </SharedTypography>
  </div>
</template>

<script setup lang="ts">
import { isTablet } from '@/utils/breakpoints'
import { getTranslationKey } from '@/translations'

const screenWidth = useScreenWidth()
const isOnMobile = computed(() => isTablet(screenWidth.value))
const IconType = computed(() => (isOnMobile.value ? 'logo--no-text' : 'logo'))
</script>

<style lang="less" scoped>
.header {
  display: flex;
  height: @header-height;
  padding: 20px;
  gap: 10px;
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 1;
  background-color: @primary-white;
  width: 100%;
}
</style>

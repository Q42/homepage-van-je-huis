<template>
  <div class="error-section">
    <SharedTypography variant="h1">{{
      $t(getTranslationKey('error.notFound'))
    }}</SharedTypography>
    <button class="button" @click="handleClearError">
      <SharedTypography variant="body">{{
        $t(getTranslationKey('error.backToHome'))
      }}</SharedTypography>
    </button>
  </div>
</template>

<script setup lang="ts">
import { getTranslationKey } from './translations'

export interface ErrorProps {
  // TODO
}

const props = defineProps<ErrorProps>()

const { locale } = useI18n()

const handleClearError = () => {
  clearError({ redirect: '/' + locale.value })
}
</script>

<style lang="less" scoped>
.error-section {
  transform: translateY(calc(50vh - 50%));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  height: 100%;
}

.button {
  color: @primary-white;
  background: @primary-blue;
  padding: 0.75rem 1rem;
  border: none;
  transition: background 0.2s ease;
  cursor: pointer;

  &:focus,
  &:hover {
    background: @dark-blue;
  }
}
</style>

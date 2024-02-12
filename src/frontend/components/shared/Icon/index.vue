<template>
  <component :is="iconComponent" class="icon" />
</template>

<script setup lang="ts">
import { Logo, LogoNoText } from '@/assets/icons'
import { IconType } from '@/models/Icon'

export interface IconProps {
  type: IconType
}

const props = defineProps<IconProps>()

const iconComponent = computed(() => {
  switch (props.type) {
    case 'logo':
      return Logo
    case 'logo--no-text':
      return LogoNoText
  }
})
</script>

<style lang="less" scoped>
.icon {
  fill: currentColor;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>

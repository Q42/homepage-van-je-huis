<template>
  <component :height="height" :width="width" :is="iconComponent" class="icon" />
</template>

<script setup lang="ts">
import {
  Logo,
  LogoNoText,
  Search,
  Link,
  Stories,
  Close,
  Calendar,
} from '@/assets/icons'
import { IconType } from '@/models/Icon'

export interface IconProps {
  type: IconType
  height?: number
  width?: number
}

const props = defineProps<IconProps>()

const iconComponent = computed(() => {
  switch (props.type) {
    case 'logo':
      return Logo
    case 'logo--no-text':
      return LogoNoText
    case 'search':
      return Search
    case 'link':
      return Link
    case 'stories':
      return Stories
    case 'close':
      return Close
    case 'calendar':
      return Calendar
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

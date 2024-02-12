<template>
  <div class="input-wrapper">
    <input
      class="input"
      type="text"
      :v-model="value"
      :placeholder="placeholder"
    />
    <button v-if="icon" type="submit" class="icon-btn">
      <SharedIcon :height="24" :width="24" :type="icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { IconType } from '~/models/Icon'

export interface InputProps {
  value: string
  placeholder: string
  icon?: IconType
}

const props = defineProps<InputProps>()
</script>

<style lang="less" scoped>
.input-wrapper {
  display: flex;
  width: 100%;
  align-items: center;
  border-bottom: solid 1px @primary-black;
}

.input {
  all: unset;
  padding: 1rem 0;
  flex: 1;
}

.icon-btn {
  all: unset;
  padding: 1rem 0;
}
</style>

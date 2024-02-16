<template>
  <div
    class="input-wrapper"
    :class="{
      'input-wrapper--disabled': props.disabled,
    }"
  >
    <input
      :disabled="props.disabled"
      class="input"
      :class="{
        'input--disabled': props.disabled,
      }"
      type="text"
      :placeholder="placeholder"
      :value="value"
      @input="$emit('update:value', ($event.target as HTMLInputElement).value)"
    />
    <button v-if="icon" type="submit" class="icon-btn">
      <SharedIcon :height="24" :width="24" :type="icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { IconType } from '@/models/Icon'

export interface InputProps {
  placeholder: string
  icon?: IconType
  disabled?: boolean
}

const value = defineModel('value')

const props = defineProps<InputProps>()
</script>

<style lang="less" scoped>
.input-wrapper {
  display: flex;
  width: 100%;
  align-items: center;
  border-bottom: solid 1px @primary-black;
}

.input-wrapper--disabled {
  border-color: lightgray;
}

.input {
  all: unset;
  padding: 1rem 0;
  flex: 1;
}

.input--disabled {
  &::placeholder {
    color: lightgray;
  }
}
.icon-btn {
  all: unset;
  padding: 1rem 0;
  cursor: pointer;
}
</style>

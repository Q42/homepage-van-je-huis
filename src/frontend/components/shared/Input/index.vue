<template>
  <div
    class="input-wrapper"
    :class="{
      'input-wrapper--disabled': props.disabled,
    }"
  >
    <input
      :id="inputId"
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
  </div>
</template>

<script setup lang="ts">
import { IconType } from '@/models/Icon'

export interface InputProps {
  placeholder: string
  icon?: IconType
  disabled?: boolean
  inputId?: string
}

const value = defineModel('value')

const props = defineProps<InputProps>()
</script>

<style lang="less" scoped>
.input-wrapper {
  display: flex;
  width: 100%;
  height: fit-content;
  align-items: center;
  border-bottom: solid 1px @primary-black;
  overflow: hidden; // TODO: remove
}

.input-wrapper--disabled {
  border-color: lightgray;
}

.input {
  all: unset;
  padding: 0.5rem 0;
  width: 100%;
}

.input--disabled {
  &::placeholder {
    color: lightgray;
  }
}
</style>

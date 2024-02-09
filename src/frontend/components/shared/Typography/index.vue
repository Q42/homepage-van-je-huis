<template>
  <component :is="tag" :class="classes">
    <slot />
  </component>
</template>

<script lang="ts">
type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'body-small'
  | 'quote'

type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'blockquote'

type VariantClasses = {
  [key in TypographyVariant]: string
}
</script>

<script setup lang="ts">
export interface TypographyProps {
  as?: Tag
  variant: TypographyVariant
  classes?: string
}

const props = defineProps<TypographyProps>()

const variantClasses: VariantClasses = {
  h1: 'heading-1',
  h2: 'heading-2',
  h3: 'heading-3',
  h4: 'heading-4',
  h5: 'heading-5',
  h6: 'heading-6',
  body: 'body',
  'body-small': 'body-small',
  quote: 'quote',
}

const tag = computed(() => {
  if (props.as) {
    return props.as
  }
  switch (props.variant) {
    case 'h1':
      return 'h1'
    case 'h2':
      return 'h2'
    case 'h3':
      return 'h3'
    case 'h4':
      return 'h4'
    case 'h5':
      return 'h5'
    case 'h6':
      return 'h6'
    case 'body':
    case 'body-small':
      return 'p'
    case 'quote':
      return 'blockquote'
  }
})

const classes = computed(() => {
  return [
    variantClasses[props.variant as keyof VariantClasses],
    props.classes,
  ].join(' ')
})
</script>

<style lang="less" scoped>
.heading-1 {
  .heading-1();
}

.heading-2 {
  .heading-2();
}

.heading-3 {
  .heading-3();
}

.heading-4 {
  .heading-4();
}

.heading-5 {
  .heading-5();
}
.heading-6 {
  .heading-6();
}

.quote {
  .quote();
}

.body {
  .body();
}

.body-small {
  .body-small();
}
</style>

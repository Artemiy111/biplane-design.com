<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { Primitive, type PrimitiveProps } from 'reka-ui'

import { cn } from '~~/src/shared/lib/utils'

import { buttonVariants, type ButtonVariants } from '.'

type Props = {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
} & PrimitiveProps

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
    data-slot="button"
  >
    <slot />
  </Primitive>
</template>

<script setup lang="ts">
import { cn } from '~~/src/shared/lib/utils'

import type { WithClassAsProps } from './interface'

import { useCarousel } from './useCarousel'

const props = defineProps<WithClassAsProps>()

const { orientation } = useCarousel()
</script>

<template>
  <div
    aria-roledescription="slide"
    :class="cn(
      'min-w-0 shrink-0 grow-0 basis-full',
      orientation === 'horizontal' ? 'pl-4' : 'pt-4',
      props.class,
    )"
    data-slot="carousel-item"
    role="group"
  >
    <slot />
  </div>
</template>

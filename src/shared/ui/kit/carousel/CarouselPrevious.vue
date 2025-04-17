<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'

import { cn } from '~~/src/shared/lib/utils'
import { Button, type ButtonVariants } from '~~/src/shared/ui/kit/button'

import type { WithClassAsProps } from './interface'

import { useCarousel } from './useCarousel'

const props = withDefaults(defineProps<{
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
}
& WithClassAsProps>(), {
  variant: 'outline',
  size: 'icon',
})

const { orientation, canScrollPrev, scrollPrev } = useCarousel()
</script>

<template>
  <Button
    :class="cn(
      'absolute size-8 rounded-full',
      orientation === 'horizontal'
        ? 'top-1/2 -left-12 -translate-y-1/2'
        : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
      props.class,
    )"
    data-slot="carousel-previous"
    :disabled="!canScrollPrev"
    :size="size"
    :variant="variant"
    @click="scrollPrev"
  >
    <slot>
      <ArrowLeft />
      <span class="sr-only">Previous Slide</span>
    </slot>
  </Button>
</template>

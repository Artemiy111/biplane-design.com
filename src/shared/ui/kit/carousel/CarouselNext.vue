<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

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

const { orientation, canScrollNext, scrollNext } = useCarousel()
</script>

<template>
  <Button
    :class="cn(
      'absolute size-8 rounded-full',
      orientation === 'horizontal'
        ? 'top-1/2 -right-12 -translate-y-1/2'
        : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
      props.class,
    )"
    data-slot="carousel-next"
    :disabled="!canScrollNext"
    :size="size"
    :variant="variant"
    @click="scrollNext"
  >
    <slot>
      <ArrowRight />
      <span class="sr-only">Next Slide</span>
    </slot>
  </Button>
</template>

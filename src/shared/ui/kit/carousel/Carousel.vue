<script setup lang="ts">
import { cn } from '~~/src/shared/lib/utils'

import type { CarouselEmits, CarouselProps, WithClassAsProps } from './interface'

import { useProvideCarousel } from './useCarousel'

const props = withDefaults(defineProps<CarouselProps & WithClassAsProps>(), {
  orientation: 'horizontal',
})

const emits = defineEmits<CarouselEmits>()

const refs = toRefs(() => props)

const { canScrollNext, canScrollPrev, carouselApi, carouselRef, orientation, scrollNext, scrollPrev } = useProvideCarousel(refs, emits)

defineExpose({
  canScrollNext,
  canScrollPrev,
  carouselApi,
  carouselRef,
  orientation,
  scrollNext,
  scrollPrev,
})

function onKeyDown(event: KeyboardEvent) {
  const prevKey = props.orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
  const nextKey = props.orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'

  if (event.key === prevKey) {
    event.preventDefault()
    scrollPrev()

    return
  }

  if (event.key === nextKey) {
    event.preventDefault()
    scrollNext()
  }
}
</script>

<template>
  <!-- eslint-disable vuejs-accessibility/no-static-element-interactions -->
  <div
    aria-roledescription="carousel"
    :class="cn('relative', props.class)"
    data-slot="carousel"
    role="region"
    tabindex="0"
    @keydown="onKeyDown"
  >
    <slot
      :can-scroll-next
      :can-scroll-prev
      :carousel-api
      :carousel-ref
      :orientation
      :scroll-next
      :scroll-prev
    />
  </div>
</template>

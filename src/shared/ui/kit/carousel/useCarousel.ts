import { createInjectionState } from '@vueuse/core'
import emblaCarouselVue from 'embla-carousel-vue'
import { onMounted, ref, type ToRefs } from 'vue'

import type { UnwrapRefCarouselApi as CarouselApi, CarouselEmits, CarouselProps } from './interface'

const [useProvideCarousel, useInjectCarousel] = createInjectionState(
  ({
    opts,
    orientation,
    plugins,
  }: ToRefs<CarouselProps>, emits: CarouselEmits) => {
    // const axis = computed(() => {

    //   if (isRef(orientation)) return orientation.value === 'horizontal' ? 'x' : 'y'
    //   return orientation === 'horizontal' ? 'x' : 'y'
    // })
    const axis = computed(() => orientation?.value === 'horizontal' ? 'x' : 'y')
    const [emblaNode, emblaApi] = emblaCarouselVue(computed(() => (
      {
        ...opts,
        axis: axis.value,
      }
    )), plugins?.value)

    function scrollPrev() {
      emblaApi.value?.scrollPrev()
    }
    function scrollNext() {
      emblaApi.value?.scrollNext()
    }

    const canScrollNext = ref(false)
    const canScrollPrev = ref(false)

    function onSelect(api: CarouselApi) {
      canScrollNext.value = api?.canScrollNext() || false
      canScrollPrev.value = api?.canScrollPrev() || false
    }

    onMounted(() => {
      if (!emblaApi.value)
        return

      emblaApi.value?.on('init', onSelect)
      emblaApi.value?.on('reInit', onSelect)
      emblaApi.value?.on('select', onSelect)

      emits('init-api', emblaApi.value)
    })

    return { carouselRef: emblaNode, carouselApi: emblaApi, canScrollPrev, canScrollNext, scrollPrev, scrollNext, orientation }
  },
)

function useCarousel() {
  const carouselState = useInjectCarousel()

  if (!carouselState)
    throw new Error('useCarousel must be used within a <Carousel />')

  return carouselState
}

export { useCarousel, useProvideCarousel }

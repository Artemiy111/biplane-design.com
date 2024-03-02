import { useEventListener, useWindowSize } from '@vueuse/core'
import { type ScreenSize, screens } from '~/tailwind.config'

function getMaxScreenWidth(size: ScreenSize) {
  const width = Number.parseFloat(screens[size].max)
  return width
}

export function useScreenSize() {
  const width = ref(Number.POSITIVE_INFINITY)
  onMounted(() => {
    width.value = window.innerWidth
    useEventListener(window, 'resize', () => {
      width.value = window.innerWidth
    })
  })

  const size = computed<ScreenSize | 'default'>(() => {
    switch (true) {
      case width.value <= getMaxScreenWidth('xs'):
        return 'xs'
      case width.value <= getMaxScreenWidth('sm'):
        return 'sm'
      case width.value <= getMaxScreenWidth('md'):
        return 'md'
      case width.value <= getMaxScreenWidth('lg'):
        return 'lg'
      case width.value <= getMaxScreenWidth('xl'):
        return 'xl'
      case width.value <= getMaxScreenWidth('2xl'):
        return '2xl'
      default: return 'default'
    }
  })

  function isSize(screenSize: ScreenSize) {
    return computed(() => size.value === 'default' ? false : getMaxScreenWidth(size.value) <= getMaxScreenWidth(screenSize))
  }

  const xxl = isSize('2xl')
  const xl = isSize('xl')
  const lg = isSize('lg')
  const md = isSize('md')
  const sm = isSize('sm')
  const xs = isSize('xs')

  return { size, xxl, xl, lg, md, sm, xs }
}

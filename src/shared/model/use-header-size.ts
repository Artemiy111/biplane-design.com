import { useEventListener } from '@vueuse/core'

export const useHeaderSize = () => {
  const width = ref(0)
  const height = ref(0)
  const header = ref<HTMLElement | null>(null)

  const onResize = () => {
    if (!header.value) return

    const rect = header.value.getBoundingClientRect()
    width.value = rect.width
    height.value = rect.height
  }

  useEventListener('resize', onResize)

  onMounted(() => {
    header.value = document.querySelector<HTMLElement>('#header')
    onResize()
  })

  return {
    width,
    height,
  }
}

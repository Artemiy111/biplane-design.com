export const useHeaderSize = () => {
  const width = ref(0)
  const height = ref(0)
  const header = ref<HTMLElement | null>(null)
  const onResize = () => {
    if (!header.value) return
    const rect = header.value.getBoundingClientRect()
    console.log(rect)
    width.value = rect.width
    height.value = rect.height
  }

  onMounted(() => {
    header.value = document.querySelector<HTMLElement>('#header')
    console.log(header.value)
    if (!header.value) return
    const rect = header.value.getBoundingClientRect()
    width.value = rect.width
    height.value = rect.height

    window.addEventListener('resize', onResize)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', onResize)
  })

  return {
    width,
    height,
  }
}

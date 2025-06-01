<script setup lang="ts">
import { useCookieAllowed } from '~~/src/shared/model/user'
import { toast } from 'vue-sonner'
import CookieToast from './cookie-toast.vue'
import { watchImmediate } from '@vueuse/core'

const { cookieAllowed } = useCookieAllowed()

const toastId = ref<number | string>()

onMounted(() => {
  if (cookieAllowed.value) return
  toastId.value = toast.custom(markRaw(CookieToast), { duration: Infinity, componentProps: { id: toastId } })
})
</script>

<template>
  <slot />
</template>
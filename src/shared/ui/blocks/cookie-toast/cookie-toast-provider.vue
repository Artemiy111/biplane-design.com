<script setup lang="ts">
import { toast } from 'vue-sonner'

import { useCookieAllowed } from '~~/src/shared/model/user'

import CookieToast from './cookie-toast.vue'

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

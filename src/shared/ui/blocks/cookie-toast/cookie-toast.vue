<script setup lang="ts">
import { Button } from '~~/src/shared/ui/kit/button'
import { toast } from 'vue-sonner'
import { useCookieAllowed } from '~~/src/shared/model/user'

const { allowCookie } = useCookieAllowed()

const { id } = defineProps<{
  id: string | number
}>()

const allow = async () => {
  await allowCookie()
  toast.dismiss(id)
}

</script>

<template>
  <div
    class="text-sm p-6 pt-5 bg-background shadow-md flex flex-col gap-y-2 fixed bottom-[calc(var(--container-pad)/2)] right-[calc(var(--container-pad)/2)] z-1000 transition-all @starting:opacity-0 opacity-100">
    <p>Мы используем куки <br /> для сбора аналитики в Яндекс.Метрике</p>
    <Button class="cursor-pointer text-sm" variant="secondary" size="sm" @click="allow()">Хорошо</Button>
  </div>
</template>
<script setup lang="ts">
import { buttonVariants } from '~~/src/shared/ui/kit/button'

const title = 'Страница не найдена'
const description = 'Ошибка 404'
useSeoMeta({ title, ogTitle: title, description, ogDescription: description })
</script>

<template>
  <main class="container flex flex-col items-center justify-center gap-8 pt-[20dvh]">
    <div class="flex flex-col items-center gap-1">
      <span class="text-[140px] leading-none lg:text-[120px] md:text-[100px]">404</span>
      <span>Страница не найдена</span>
    </div>
    <NuxtLink
      :class="buttonVariants()"
      to="/projects"
    >
      Смотреть проекты
    </NuxtLink>
  </main>
</template>

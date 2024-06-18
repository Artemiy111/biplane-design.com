<script setup lang="ts">
import { buttonVariants } from '~/components/ui/button'

useServerSeoMeta({
  title: 'Страница не найдена',
  ogTitle: 'Страница не найдена',
  description: 'Ошибка 404',
  ogDescription: 'Ошибка 404',
})
useSeoMeta({
  title: 'Страница не найдена',
  ogTitle: 'Страница не найдена',
  description: 'Ошибка 404',
  ogDescription: 'Ошибка 404',
})
</script>

<template>
  <main class="container flex flex-col items-center justify-center gap-8 pt-[20dvh]">
    <div class="flex flex-col items-center gap-1">
      <span class="text-[140px] leading-none lg:text-[120px] md:text-[100px]">404</span>
      <span>Страница не найдена</span>
    </div>  <NuxtLink
      to="/projects"
      :class="buttonVariants()"
    >
      Смотреть проекты
    </NuxtLink>
  </main>
</template>

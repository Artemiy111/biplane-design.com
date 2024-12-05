<script setup lang="ts">
import { cn } from '~~/src/shared/lib/utils'
import { Separator } from '~~/src/shared/ui/kit/separator'

const route = useRoute()
</script>

<template>
  <footer
    :class="cn('container mt-20 flex flex-col', route.path === '/' && 'mt-0')"
  >
    <Separator />
    <section
      class="grid justify-center gap-x-16 gap-y-8 py-16 lg:gap-x-16 md:gap-y-4"
      data-footer-cols
    >
      <ul class="flex flex-col gap-1">
        <h6 class="font-semibold">
          Контакты
        </h6>
        <li>Biplane-design@mail.ru</li>
        <li>3473 25-18-56</li>
      </ul>
      <ul class="flex flex-col gap-1">
        <h6 class="font-semibold">
          Время работы
        </h6>
        <li>Пн — Пт&nbsp;&nbsp;&nbsp;&nbsp;8 — 18</li>
      </ul>
      <ul class="flex flex-col gap-1">
        <h6 class="font-semibold">
          Адрес
        </h6>
        <li>
          <NuxtLink
            :external="true"
            target="_blank"
            to="https://yandex.ru/map-widget/v1/?um=constructor%3A3da4595a6346865d8223d34a3ff56c219a4f3852edd8bb18b888329ab0ba28fa&amp;source=constructor"
          >
            Стерлитамак, ул&nbsp;Карла&nbsp;Маркса&nbsp;101Б, офис&nbsp;313&nbsp;&nbsp;→
          </NuxtLink>
        </li>
      </ul>
      <ul class="flex flex-col gap-1">
        <h6 class="font-semibold">
          Студентам
        </h6>
        <li>
          <NuxtLink
            class="flex gap-2 "
            :external="true"
            href="https://coolors.co"
            rel=""
            target="_blank noopener noreferrer"
          >
            Цветовая палитра&nbsp;&nbsp;→
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            class="flex gap-2"
            :external="true"
            href="https://habr.com/ru/companies/ruvds/articles/553582"
            target="_blank noopener noreferrer"
          >
            Теория цвета&nbsp;&nbsp;→
          </NuxtLink>
        </li>
      </ul>
      <!-- <ul class="flex flex-col gap-1">
        <li class="font-bold">
          <NuxtLink
            href="/"
            class="underline hover:no-underline"
          >
            Пример документации проекта
          </NuxtLink>
        </li>
      </ul> -->
    </section>
    <!-- <section>
      <Separator />
      <iframe
        class="max-h-[65vh]"
        frameborder="0"
        height="600"
        src="https://yandex.ru/map-widget/v1/?um=constructor%3A3da4595a6346865d8223d34a3ff56c219a4f3852edd8bb18b888329ab0ba28fa&amp;source=constructor"
        title="Карта"
        width="100%"
      />
      <Separator />
    </section> -->
    <!-- <section class="flex px-8 py-4 sm:px-4">
      <span>© Biplane-Design 2000 - 2024</span>
    </section> -->
  </footer>
</template>

<style scoped>
[data-footer-columns] {
  display: grid;
  grid-template-columns: repeat(4,max-content);

  @media (width <= 1500px) {
    grid-template-columns: 400px 300px;
  }

  @media (width <= 920px) {
    grid-template-columns: 1fr;
  }

}
</style>

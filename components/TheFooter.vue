<template>
  <footer class="container flex flex-col">
    <Separator />
    <section class="flex grid-cols-[repeat(4,fit-content(100%))] flex-wrap gap-x-32 gap-y-8 px-8 py-8 lg:gap-x-16 md:gap-y-4 sm:px-4 sm:py-4">
      <ul class="flex flex-col gap-1">
        <h6 class="text-lg font-semibold md:text-base sm:text-sm">
          Контакты
        </h6>
        <li>Biplane-design@mail.ru</li>
        <li>(3473) 25-18-56</li>
      </ul>
      <ul class="flex flex-col gap-1">
        <h6 class="text-lg font-semibold md:text-base sm:text-sm">
          Время работы
        </h6>
        <li>Пн - Пт&nbsp;&nbsp;&nbsp;&nbsp;8 - 18</li>
      </ul>
      <ul class="flex flex-col gap-1">
        <h6 class="text-lg font-semibold md:text-base sm:text-sm">
          Адрес
        </h6>
        <li>
          Стерлитамак, ул&nbsp;Карла&nbsp;Маркса&nbsp;101Б, офис&nbsp;313
        </li>
      </ul>
      <ul class="flex flex-col gap-1">
        <h6 class="text-lg font-semibold md:text-base sm:text-sm">
          Студентам
        </h6>
        <li>
          <NuxtLink
            href="https://coolors.co"
            external
            target="_blank"
            class="underline hover:no-underline"
          >
            Цветовая палитра
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            href="https://habr.com/ru/companies/ruvds/articles/553582"
            external
            target="_blank"
            class="underline hover:no-underline"
          >
            Теория цвета
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
    <section>
      <Separator />
      <iframe
        class="max-h-[80dvh]"
        src="https://yandex.ru/map-widget/v1/?um=constructor%3A3da4595a6346865d8223d34a3ff56c219a4f3852edd8bb18b888329ab0ba28fa&amp;source=constructor"
        width="100%"
        height="600"
        frameborder="0"
      />
      <Separator />
    </section>
    <section class="flex px-8 py-4 sm:px-4">
      <span>© Биплан-Дизайн 2000 - 2024</span>
    </section>
  </footer>
</template>

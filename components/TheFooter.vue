<template>
  <footer class="container flex flex-col">
    <Separator />
    <section class="flex flex-wrap px-8 py-8 gap-x-32 gap-y-8 grid-cols-[repeat(4,fit-content(100%))]">
      <ul class="flex flex-col gap-1">
        <h6 class="font-bold text-lg">
          Контакты
        </h6>
        <li>Biplane-design@mail.ru</li>
        <li>(3473) 25-18-56</li>
      </ul>
      <ul class="flex flex-col gap-1">
        <h6 class="font-bold text-lg">
          Время работы
        </h6>
        <li>Пн - Пт&nbsp;&nbsp;&nbsp;&nbsp;8 - 18</li>
      </ul>
      <ul class="flex flex-col gap-1">
        <h6 class="font-bold text-lg">
          Адрес
        </h6>
        <li>
          Стерлитамак, ул Карла Маркса 101Б, офис 313
        </li>
      </ul>
      <ul class="flex flex-col gap-1">
        <h6 class="font-bold text-lg">
          Студентам
        </h6>
        <li>
          <NuxtLink href="https://coolors.co" target="_blank" class="underline hover:no-underline">
            Цветовая палитра
          </NuxtLink>
        </li>
        <li>
          <NuxtLink href="https://habr.com/ru/companies/ruvds/articles/553582" target="_blank" class="underline hover:no-underline">
            Теория цвета
          </NuxtLink>
        </li>
      </ul>
      <ul class="flex flex-col gap-1">
        <li class="font-bold ">
          <NuxtLink href="/" class="underline hover:no-underline">
            Пример документации проекта
          </NuxtLink>
        </li>
      </ul>
    </section>
    <section>
      <NuxtImg format="avif,webp,png" src="/images/map.png" class="w-full" />
    </section>
    <section class="flex py-4 px-8">
      <span>© Биплан-Дизайн 2000 - 2024</span>
    </section>
  </footer>
</template>

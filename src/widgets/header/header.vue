<script setup lang="ts">
import { useUser } from '~~/src/shared/model/user'
import { UserRound } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '~~/src/shared/ui/kit/navigation-menu'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~~/src/shared/ui/kit/dropdown-menu'
import { Separator } from '~~/src/shared/ui/kit/separator'

const user = useUser()
const route = useRoute()

const routes = [{
  link: '/projects',
  title: 'Проекты',
}, {
  link: '/about',
  title: 'О нас',
}]

async function singOut() {
  try {
    await $fetch('/api/auth/logout')
    toast.success('Вы вышли из аккаунта')
    await refreshNuxtData('user')
    if (useRoute().path.includes('admin')) await navigateTo('/admin/auth')
  }
  catch (_e) {
    toast.error('Не удалось выйти из аккаунта')
  }
}
</script>

<template>
  <header
    id="header"
    class="container z-50 flex flex-col"
  >
    <div class="z-50 flex items-center justify-between px-8 py-4 sm:px-4 sm:py-2">
      <NuxtLink
        class="flex items-center gap-4"
        to="/"
      >
        <img
          alt="Логотип"
          class="h-10 dark:invert-[70%] md:h-8"
          src="/logo.svg"
        >
        <span class="sm:hidden">Biplane-Design</span>
      </NuxtLink>
      <ClientOnly>
        <DropdownMenu>
          <DropdownMenuTrigger
            v-if="user"
            class="flex gap-3 items-center"
          >
            <UserRound :stroke-width="1.5" />
            {{ user.username }}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <NuxtLink
                class="w-full"
                to="/admin"
              >
                Админ панель
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NuxtLink
                class="w-full"
                to="/admin/account"
              >
                Аккаунт
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NuxtLink
                class="w-full"
                to="/admin/auth"
              >
                Вход/Регистрация
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                class="w-full text-start text-red-500"
                type="button"
                variant="link"
                @click="singOut"
              >
                Выйти
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ClientOnly>
      <NavigationMenu>
        <NavigationMenuList class="gap-6">
          <NavigationMenuItem
            v-for="r in routes"
            :key="r.link"
          >
            <NuxtLink
              class="cursor-pointer"
              :class="[
                r.link === route.path ? 'font-semibold' : '']"
              :to="r.link"
            >
              {{ r.title }}
            </NuxtLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
    <Separator />
  </header>
</template>

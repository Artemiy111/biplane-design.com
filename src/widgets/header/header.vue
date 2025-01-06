<script setup lang="ts">
import { UserRound } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import { useApi } from '~~/src/shared/api'
import { useUser } from '~~/src/shared/model/queries'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~~/src/shared/ui/kit/dropdown-menu'
import { Separator } from '~~/src/shared/ui/kit/separator'

const route = useRoute()
const api = useApi()
const { data: user, refresh } = useUser()
refresh()

const routes = [{
  link: '/projects',
  title: 'Проекты',
}, {
  link: '/about',
  title: 'О нас',
}]

const toastMessages = {
  success: 'Вы вышли из аккаунта',
  error: 'Не удалось выйти из аккаунта',
}

async function singOut() {
  try {
    await api.auth.logout.query()
    user.value = null
    toast.success(toastMessages.success)
    if (useRoute().path.includes('admin')) await navigateTo('/admin/auth')
  }
  catch (_e) {
    toast.error(toastMessages.error)
  }
}
</script>

<template>
  <header
    id="header"
    class="container z-50 flex h-20 flex-col"
  >
    <div class="z-50 flex h-full items-center justify-between">
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
      <DropdownMenu>
        <DropdownMenuTrigger
          v-if="user"
          class="flex items-center gap-3"
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

      <nav>
        <ul class="flex gap-6">
          <li
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
          </li>
        </ul>
      </nav>
    </div>
    <Separator />
  </header>
</template>

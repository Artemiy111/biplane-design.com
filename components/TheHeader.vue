<script setup lang="ts">
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '~/components/ui/navigation-menu'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()

const { md } = useScreenSize()

const routes = [{
  link: '/projects',
  title: 'Проекты',
}, {
  link: '/about',
  title: 'О нас',
}]

async function singOut() {
  await supabase.auth.signOut()
}
</script>

<template>
  <header class="container z-50 flex flex-col">
    <div class="z-50 flex items-center justify-between px-8 py-4 sm:px-4 sm:py-2">
      <NuxtLink
        to="/"
        class="flex items-center gap-4"
      >
        <img
          src="/logo.svg"
          class="h-10 dark:invert-[70%] md:h-8"
        >
        <span class="sm:hidden">Biplane-Design</span>
      </NuxtLink>
      <ClientOnly>
        <DropdownMenu>
          <DropdownMenuTrigger v-if="user">
            {{ user.email }}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <NuxtLink
                to="/admin"
                class="w-full"
              >
                Админ панель
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NuxtLink
                to="/admin/account"
                class="w-full"
              >
                Аккаунт
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NuxtLink
                to="/admin/login"
                class="w-full"
              >
                Вход/Регистрация
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                variant="link"
                class="w-full text-start text-red-500"
                @click="singOut"
              >
                Выйти
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ClientOnly>
      <NavigationMenu>
        <NavigationMenuList class="gap-4 sm:gap-2">
          <NavigationMenuItem
            v-for="r in routes"
            :key="r.link"
          >
            <NuxtLink
              :to="r.link"
              class="cursor-pointer"
              :class="[
                md ? navigationMenuTriggerStyle({ size: 'sm' }) : navigationMenuTriggerStyle(),
                r.link === route.path ? 'bg-primary-foreground font-bold' : '']"
            >
              {{ r.title }}
            </NuxtLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
    <Separator class="z-50" />
  </header>
</template>

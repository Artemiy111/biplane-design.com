<script setup lang="ts">
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '~/components/ui/navigation-menu'

const { md } = useScreenSize()

const route = useRoute()

const routes = [{
  link: '/projects',
  title: 'Проекты',
}, {
  link: '/about',
  title: 'О нас',
}]
</script>

<template>
  <header class="container z-50 flex flex-col">
    <div class="z-50 flex items-center justify-between px-8 py-4 sm:px-4 sm:py-2">
      <NuxtLink to="/" class="flex items-center gap-4">
        <img src="/logo.svg" class="h-10 dark:invert-[70%] md:h-8">
        <span class="sm:hidden">Biplane-Design</span>
      </NuxtLink>
      <NavigationMenu>
        <NavigationMenuList class="gap-4 sm:gap-2">
          <NavigationMenuItem v-for="r in routes" :key="r.link">
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
